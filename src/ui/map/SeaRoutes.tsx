import { createMemo, For } from 'solid-js';
import { Line } from 'solidjs-simple-maps';
import { geoCentroid } from 'd3-geo';
import { EUROPE_GRAPH } from '../../data/europeGraph';
import { CountryId } from '../../types/game';

interface SeaRoutesProps {
    geographies: any[];
}

export function SeaRoutes(props: SeaRoutesProps) {
    const routes = createMemo(() => {
        const countryCentroids: Record<string, [number, number]> = {};

        // 1. Calculate centroids for all visible countries
        props.geographies.forEach(geo => {
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
    });

    return (
        <g>
            <For each={routes()}>
                {route => (
                    <Line
                        from={route.from as any}
                        to={route.to as any}
                        stroke="#3b82f6"
                        stroke-width={1.5}
                        stroke-dasharray="4 4"
                        stroke-linecap="round"
                        class="sea-route"
                    />
                )}
            </For>
        </g>
    );
}
