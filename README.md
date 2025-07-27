# OSRM Routing with Mapbox Integration

This project is a web-based mapping application that integrates **Mapbox** for interactive maps and **OSRM (Open Source Routing Machine)** for routing functionality. The application is specifically set up to provide routing services for **Pakistan**, with the OSRM backend built from source using Pakistan's map data.

## Features

- **Interactive Map**: Powered by Mapbox, with a globe projection and satellite view.
- **User Location**: Automatically detects and displays the user's current location.
- **Search Functionality**: Search for locations near the user's current position using OpenStreetMap's Nominatim API.
- **Routing**: Provides turn-by-turn directions between two locations using OSRM.
- **Customizable Layers**: Displays user location, selected location, and route on the map.
- **Draggable Directions Panel**: View step-by-step route instructions in a draggable UI component.

---

## Setup Instructions

### Prerequisites

1. **Node.js**: Install [Node.js](https://nodejs.org/) (v16 or later recommended).
2. **Mapbox Account**: Create a free account at [Mapbox](https://www.mapbox.com/) and obtain an API token.
3. **OSRM Backend**: Set up the OSRM backend for Pakistan (instructions below).
4. **Environment Variables**: Create a `.env.local` file in the root of the project with the following:
   ```env
   NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_access_token
   ```

---

### OSRM Backend Setup for Pakistan

1. **Download OSRM**:
   - Clone the OSRM repository:
     ```bash
     git clone https://github.com/Project-OSRM/osrm-backend.git
     cd osrm-backend
     ```

2. **Install Dependencies**:
   - Follow the [OSRM installation guide](https://github.com/Project-OSRM/osrm-backend/wiki/Building-OSRM) to install dependencies.

3. **Download Pakistan Map Data**:
   - Download the `.osm.pbf` file for Pakistan from [Geofabrik](https://download.geofabrik.de/asia/pakistan.html).

4. **Prepare the Map Data**:
   - Extract and preprocess the map data:
     ```bash
     osrm-extract -p profiles/car.lua pakistan-latest.osm.pbf
     osrm-contract pakistan-latest.osrm
     ```

5. **Run the OSRM Backend**:
   - Start the OSRM server:
     ```bash
     osrm-routed pakistan-latest.osrm
     ```
   - The server will run on `http://localhost:5000`.

---

### Project Setup

1. **Install Dependencies**:
   - Navigate to the project directory and install dependencies:
     ```bash
     npm install
     ```

2. **Run the Development Server**:
   - Start the Next.js development server:
     ```bash
     npm run dev
     ```
   - Open [http://localhost:3000](http://localhost:3000) in your browser.

3. **Verify OSRM Integration**:
   - Ensure the OSRM backend is running on `http://localhost:5000`.
   - The application will use this backend for routing.

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx         # Root layout for the application
│   ├── page.tsx           # Main page rendering the MapComp component
├── components/
│   ├── MapComp.tsx        # Main map component with Mapbox integration
│   ├── MapSearch.tsx      # Search bar for location search
│   ├── RouteInstructions.tsx # Draggable directions panel
├── styles/
│   ├── globals.css        # Global styles
```

---

## Key Components

### 1. **MapComp**
- Integrates Mapbox for rendering the map.
- Displays user location, selected location, and routes.
- Fetches routes from the OSRM backend.

### 2. **MapSearch**
- Provides a search bar for finding locations.
- Uses OpenStreetMap's Nominatim API for suggestions.
- Prioritizes suggestions based on the user's location.

### 3. **RouteInstructions**
- Displays step-by-step directions for the route.
- Draggable UI for better user experience.

---

## Environment Variables

- `NEXT_PUBLIC_MAPBOX_TOKEN`: Your Mapbox API token.
- Ensure the OSRM backend is running on `http://localhost:5000`.

---

## Future Enhancements

- Add support for multiple routing profiles (e.g., walking, cycling).
- Improve error handling for API requests.
- Add unit tests for key components.

---

## Acknowledgments

- [Mapbox](https://www.mapbox.com/) for the interactive map.
- [OSRM](http://project-osrm.org/) for the routing engine.
- [OpenStreetMap](https://www.openstreetmap.org/) for map data.
