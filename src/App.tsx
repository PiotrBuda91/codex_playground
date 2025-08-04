import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import safetyZones from './data/safety-zones';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const App: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-122.4194, 37.7749],
      zoom: 12,
    });

    map.on('load', () => {
      map.addSource('safety-zones', {
        type: 'geojson',
        data: safetyZones as any,
      });

      map.addLayer({
        id: 'safety-zones-fill',
        type: 'fill',
        source: 'safety-zones',
        paint: {
          'fill-color': [
            'match',
            ['get', 'safety_level'],
            'safe', '#22c55e',
            'neutral', '#eab308',
            'unsafe', '#ef4444',
            '#808080',
          ],
          'fill-opacity': 0.5,
        },
      });

      map.addLayer({
        id: 'safety-zones-outline',
        type: 'line',
        source: 'safety-zones',
        paint: {
          'line-color': '#ffffff',
          'line-width': 1,
        },
      });

      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
      });

      map.on('mousemove', 'safety-zones-fill', (e) => {
        const feature = e.features && e.features[0];
        if (!feature) return;
        popup
          .setLngLat(e.lngLat)
          .setHTML(`<strong>${feature.properties?.name || 'Area'}</strong><br/>Safety: ${feature.properties?.safety_level}`)
          .addTo(map);
      });

      map.on('mouseleave', 'safety-zones-fill', () => {
        popup.remove();
      });
    });

    return () => {
      map.remove();
    };
  }, []);

  return (
    <div className="h-screen w-screen relative">
      <div ref={mapContainer} className="h-full w-full" />
      <div className="absolute left-4 bottom-4 bg-white bg-opacity-80 rounded p-2 text-sm">
        <h3 className="font-bold mb-2">Legend</h3>
        <div className="flex items-center mb-1">
          <span className="w-3 h-3 mr-2 bg-green-500"></span> Safe
        </div>
        <div className="flex items-center mb-1">
          <span className="w-3 h-3 mr-2 bg-yellow-400"></span> Neutral
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 mr-2 bg-red-500"></span> Unsafe
        </div>
      </div>
    </div>
  );
};

export default App;
