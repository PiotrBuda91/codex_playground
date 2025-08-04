import { FeatureCollection } from 'geojson';

const safetyZones: FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        name: 'Downtown',
        safety_level: 'unsafe',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-122.423057, 37.7749],
            [-122.413057, 37.7749],
            [-122.413057, 37.7849],
            [-122.423057, 37.7849],
            [-122.423057, 37.7749],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        name: 'Golden Gate Park',
        safety_level: 'safe',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-122.4862, 37.7694],
            [-122.4526, 37.7694],
            [-122.4526, 37.7788],
            [-122.4862, 37.7788],
            [-122.4862, 37.7694],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        name: 'Neutral Zone',
        safety_level: 'neutral',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-122.434, 37.7599],
            [-122.424, 37.7599],
            [-122.424, 37.7699],
            [-122.434, 37.7699],
            [-122.434, 37.7599],
          ],
        ],
      },
    },
  ],
};

export default safetyZones;
