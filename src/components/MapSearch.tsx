'use client';

import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

export default function MapSearch({
  onSearch,
  userLocation,
}: {
  onSearch?: (coords: [number, number], label: string) => void;
  userLocation?: [number, number];
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!query.trim()) return setSuggestions([]);

      const base = 'https://nominatim.openstreetmap.org/search';
      const params = new URLSearchParams({
        q: query,
        format: 'json',
        limit: '5',
        addressdetails: '1',
        bounded: '1',
      });

      if (userLocation) {
        const [lon, lat] = userLocation;
        params.append('lat', lat.toString());
        params.append('lon', lon.toString());
      }

      try {
        const res = await fetch(`${base}?${params.toString()}`, {
          headers: {
            'User-Agent': 'my-map-app/1.0 (your@email.com)',
          },
        });
        const data = await res.json();
        setSuggestions(data);
      } catch (err) {
        console.error('Nominatim error:', err);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [query, userLocation]);

  const handleSelect = (place: any) => {
    const coords: [number, number] = [parseFloat(place.lon), parseFloat(place.lat)];
    const label: string = place.display_name;
    onSearch?.(coords, label);
    setOpen(false);
    setQuery('');
    setSuggestions([]);
  };

  return (
    <div className="absolute top-4 left-4 z-10 w-72">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="bg-transparent p-2 rounded shadow hover:bg-gray-300"
          aria-label="Open search"
          title="Open search"
        >
          <Search className="w-5 h-5" />
        </button>
      ) : (
        <div className="bg-transparent rounded shadow p-2 space-y-2 text-gray-100">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Search nearby..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-grow px-2 py-2 border rounded outline-none"
            />
          </div>

          {suggestions.length > 0 && (
            <ul className="max-h-60 overflow-auto border rounded bg-transparent text-fuchsia-100">
              {suggestions.map((place) => (
                <li
                  key={place.place_id}
                  onClick={() => handleSelect(place)}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-md text-gray-100"
                >
                  {place.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
