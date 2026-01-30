import { Marker } from "solidjs-simple-maps";
import { geoCentroid } from "d3-geo";
import { EUROPE_GRAPH } from "../../data/europeGraph";
import { gameStore } from "../../store/gameStore";
import { createMemo, For, Show } from "solid-js";

interface MapTokensProps {
    geo: any;
}

export function MapTokens(props: MapTokensProps) {
    // Derived values must be accessors or inside render
    // geoId is static per component instance typically, but access via props IS simpler
    const geoId = () => props.geo.id;

    const tokensHere = createMemo(() => gameStore.placements.filter(p => p.countryId === geoId()));

    // Early return pattern: in Solid, this runs once. If props.geo changes, this won't re-run unless we wrap the whole return in a Memo or derived signal.
    // However, typically MapTokens is rendered *for* a specific geo.
    // To be safe, we can use <Show>

    // cast coordinates to any to avoid d3-geo vs solidjs-simple-maps mismatch
    const centroid = () => geoCentroid(props.geo) as any; // Recalculate if geo changes? geo usually static.

    return (
        <Show when={EUROPE_GRAPH[geoId()]}>
            <g>
                {/* City Label - Conditional */}
                <Show when={gameStore.settings.mapStyle === 'codes'}>
                    <Marker coordinates={centroid()}>
                        <text
                            text-anchor="middle"
                            y={2}
                            class="map-token-label"
                        >
                            {geoId()}
                        </text>
                    </Marker>
                </Show>

                {/* Render Tokens */}
                <For each={tokensHere()}>
                    {(token, idx) => {
                        const player = () => gameStore.players[token.playerId];
                        // idx is a signal in <For>
                        const offsetX = () => 0.5 + (idx() * 0.4);
                        const offsetY = () => -0.5 - (idx() * 0.4);
                        const c = centroid(); // call once

                        return (
                            <Marker coordinates={[c[0] + offsetX(), c[1] + offsetY()] as any}>
                                <circle
                                    r={3}
                                    fill={player()?.color || 'black'}
                                    stroke="white"
                                    stroke-width={1}
                                />
                            </Marker>
                        );
                    }}
                </For>
            </g>
        </Show>
    );
}
