import { useMemo } from 'react';
import { Line } from 'react-simple-maps';
import { geoCentroid } from 'd3-geo';
import { EUROPE_GRAPH } from '../../data/europeGraph';
import { CountryId } from '../../types/game';

interface SeaRoutesProps {
    geographies: any[];
}

export function SeaRoutes({ geographies }: SeaRoutesProps) {
    const routes = useMemo(() => {
        const countryCentroids: Record<string, [number, number]> = {};

        // 1. Calculate centroids for all visible countries
        geographies.forEach(geo => {
            const centroid = geoCentroid(geo);
            const id = geo.id as CountryId;
            if (id && centroid) {
                countryCentroids[id] = centroid;
            }
        });

        // 2. Identify unique SEA connections
        const lines: { from: [number, number], to: [number, number], key: string }[] = [];
        const processed = new Set<string>();

        Object.values(EUROPE_GRAPH).forEach(node => {
            node.neighbors.forEach(neighbor => {
                if (neighbor.type === 'SEA') {
                    // Create a sorted key to avoid duplicates (A-B and B-A)
                    const [id1, id2] = [node.id, neighbor.target].sort();
                    const edgeKey = `${id1}-${id2}`;

                    if (!processed.has(edgeKey)) {
                        const start = countryCentroids[node.id];
                        const end = countryCentroids[neighbor.target];

                        if (start && end) {
                            lines.push({ from: start, to: end, key: edgeKey });
                            processed.add(edgeKey);
                        }
                    }
                }
            });
        });

        return lines;
    }, [geographies]);

    return (
        <g>
            {routes.map(route => (
                <Line
                    key={route.key}
                    from={route.from}
                    to={route.to}
                    stroke="#3b82f6"
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    strokeLinecap="round"
                    style={{ pointerEvents: "none", opacity: 0.5 }}
                />
            ))}
        </g>
    );
}
