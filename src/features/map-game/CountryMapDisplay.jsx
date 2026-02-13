import { memo, useEffect, useState } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { geoCentroid, geoBounds } from 'd3-geo';

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

export const CountryMap = memo(({ countryCode }) => {
  const [projection, setProjection] = useState({ center: [0, 20], scale: 150 });

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-6">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={projection}
        width={800}
        height={500}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) => {
            const targetGeo = geographies.find(g => g.properties.ISO_A2 === countryCode);
            
            if (targetGeo) {
              const bounds = geoBounds(targetGeo);
              const centroid = geoCentroid(targetGeo);
              const dx = bounds[1][0] - bounds[0][0];
              const dy = bounds[1][1] - bounds[0][1];
              const maxDim = Math.max(dx, dy);
              const scale = maxDim > 0 ? 800 / maxDim : 150;
              
              setTimeout(() => {
                setProjection({
                  center: [centroid[0], centroid[1]],
                  scale: Math.min(scale * 0.8, 1200),
                });
              }, 100);
            }

            return geographies.map(geo => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill={geo.properties.ISO_A2 === countryCode ? '#10b981' : '#f4f4f5'}
                stroke="#e4e4e7"
                strokeWidth={0.5}
                style={{
                  default: { outline: 'none' },
                  hover: { outline: 'none' },
                }}
              />
            ));
          }}
        </Geographies>
      </ComposableMap>
      <p className="text-center text-sm text-gray-500 mt-4">
        این کشور در <span className="font-semibold text-primary">{}</span> قرار دارد
      </p>
    </div>
  );
});

CountryMap.displayName = 'CountryMap';