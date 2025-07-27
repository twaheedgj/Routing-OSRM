'use client';

import { useEffect, useRef, useState } from 'react';
import Map, { Source, Layer } from 'react-map-gl/mapbox';
import type { MapRef } from 'react-map-gl/mapbox';
import MapSearch from './MapSearch';
import RouteInstructions from './RouteInstructions';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
export default function MapComp() {
  const mapRef = useRef<MapRef | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const animationRef = useRef<number | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<[number, number] | null>(null);
  const [routeGeoJSON, setRouteGeoJSON] = useState<any | null>(null);
  const [routeSteps, setRouteSteps] = useState<any[] | null>(null);
  // 🔁 Rotate globe
  useEffect(() => {
    const rotate = () => {
      const map = mapRef.current?.getMap();
      if (map) {
        const bearing = map.getBearing();
        map.rotateTo(bearing + 0.1, { duration: 0 });
      }
      animationRef.current = requestAnimationFrame(rotate);
    };

    rotate();
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  // 📍 Get current location
  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const coords: [number, number] = [longitude, latitude];
        setUserLocation(coords);
      },
      (error) => {
        console.error('Geolocation error:', error);
      }
    );
  }, []);

  // 🚀 Fly to user location when ready
  useEffect(() => {
    if (mapLoaded && userLocation) {
      const map = mapRef.current?.getMap();
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      map?.flyTo({
        center: userLocation,
        zoom: 14,
        speed: 1.5,
        curve: 1.2,
        essential: true
      });
    }
  }, [mapLoaded, userLocation]);

  // 🛣 Call OSRM for route
  const fetchRoute = async (from: [number, number], to: [number, number]) => {
  const url = `http://localhost:5000/route/v1/driving/${from.join(',')};${to.join(',')}?overview=full&geometries=geojson&steps=true`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    if (!data.routes || !data.routes.length) return;

    const geometry = data.routes[0].geometry;
    const steps = data.routes[0].legs[0].steps || [];
    setRouteGeoJSON({
      type: 'Feature',
      geometry
    });
    setRouteSteps(steps);

    // 🚀 Fit map to route bounds
    const coords = geometry.coordinates;
    const bounds = coords.reduce(
      (b: mapboxgl.LngLatBounds, coord: number[]) =>
        b.extend(coord as [number, number]),
      new mapboxgl.LngLatBounds(coords[0], coords[0])
    );

    const map = mapRef.current?.getMap();
    map?.fitBounds(bounds, {
      padding: 100,
      duration: 1500
    });

  } catch (err) {
    console.error('OSRM error:', err);
  }
};


  return (
    <div className="relative w-full h-screen">
      <MapSearch
        onSearch={(coords, label) => {
            setSelectedLocation(coords);
          if (userLocation) {
            fetchRoute(userLocation, coords);
          }
        }}
        userLocation={userLocation || undefined}
      />
       {Array.isArray(routeSteps) && routeSteps.length > 0 && (
  <RouteInstructions steps={routeSteps} />)}
      <Map          
        ref={mapRef}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        initialViewState={{
          longitude: 0,
          latitude: 0,
          zoom: 1
        }}
        onLoad={() => setMapLoaded(true)}
        mapStyle="mapbox://styles/mapbox/satellite-v9"
        projection="globe"
        terrain={{ source: 'mapbox-dem', exaggeration: 1.5 }}
        style={{ width: '100%', height: '100%' }}
      >
        <Source
          id="mapbox-dem"
          type="raster-dem"
          url="mapbox://mapbox.mapbox-terrain-dem-v1"
          tileSize={512}
          maxzoom={19}
        />

        {userLocation && (
          <Source
            id="user-location"
            type="geojson"
            data={{
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: userLocation
              },
              properties: {}
            }}
          >
            <Layer
              id="user-location-layer"
              type="circle"
              paint={{
                'circle-radius': 8,
                'circle-color': '#007cbf',
                'circle-stroke-width': 2,
                'circle-stroke-color': '#fff'
              }}
            />
          </Source>
        )}

        {routeGeoJSON && (
          <Source id="route" type="geojson" data={routeGeoJSON}>
            <Layer
              id="route-line"
              type="line"
              paint={{
                'line-color': '#3b82f6',
                'line-width': 5,
                'line-opacity': 0.8
              }}
            />
          </Source>
        
        )}
        {selectedLocation && (
          <Source
            id="selected-location"
            type="geojson"
            data={{
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: selectedLocation
              },
              properties: {}
            }}
          >
            <Layer
              id="selected-location-layer"
              type="circle"
              paint={{
                'circle-radius': 8,
                'circle-color': '#f97316',
                'circle-stroke-width': 2,
                'circle-stroke-color': '#fff'
              }}
            />
          </Source>
        )}

      </Map>
    </div>
  );
}
