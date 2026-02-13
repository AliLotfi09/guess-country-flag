import { memo, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { geoCentroid, geoBounds } from 'd3-geo';

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

export const CountryMap = memo(({ countryCode }) => {
  const [projection, setProjection] = useState({
    center: [0, 20],
    scale: 150,
  });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-6 overflow-hidden shadow-soft">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-200/20 rounded-full blur-3xl" />
        
        <div className="relative">
          <ComposableMap
            projection="geoMercator"
            projectionConfig={projection}
            width={800}
            height={500}
            className="w-full h-auto"
          >
            <Geographies geography={geoUrl}>
              {({ geographies }) => {
                const targetGeo = geographies.find(
                  geo => geo.properties.ISO_A2 === countryCode
                );

                if (targetGeo) {
                  // محاسبه مرکز و zoom
                  const bounds = geoBounds(targetGeo);
                  const centroid = geoCentroid(targetGeo);
                  const dx = bounds[1][0] - bounds[0][0];
                  const dy = bounds[1][1] - bounds[0][1];
                  const maxDimension = Math.max(dx, dy);
                  const scale = maxDimension > 0 ? 800 / maxDimension : 150;

                  setTimeout(() => {
                    setProjection({
                      center: [centroid[0], centroid[1]],
                      scale: Math.min(scale * 0.8, 1200),
                    });
                  }, 100);
                }

                return (
                  <>
                    {/* All countries in light gray */}
                    {geographies.map((geo) => (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={geo.properties.ISO_A2 === countryCode ? '#007AFF' : '#E5E5EA'}
                        stroke="#FFFFFF"
                        strokeWidth={0.5}
                        style={{
                          default: { outline: 'none' },
                          hover: { outline: 'none' },
                          pressed: { outline: 'none' },
                        }}
                      />
                    ))}
                  </>
                );
              }}
            </Geographies>
          </ComposableMap>
        </div>
      </div>
    </motion.div>
  );
});

CountryMap.displayName = 'CountryMap';