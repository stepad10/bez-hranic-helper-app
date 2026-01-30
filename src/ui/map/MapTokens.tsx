import { Marker, createCoordinates } from "solidjs-simple-maps";
import { geoCentroid } from "d3-geo";
import { Feature } from "geojson";
import { EUROPE_GRAPH } from "../../data/europeGraph";
import { gameStore } from "../../store/gameStore";
import { createMemo, For, Show } from "solid-js";

interface MapTokensProps {
    geo: Feature;
}

export function MapTokens(props: MapTokensProps) {
    // Derived values must be accessors or inside render
    // geoId is static per component instance typically, but access via props IS simpler
    const geoId = () => (props.geo.id || "") as string;

    const tokensHere = createMemo(() => gameStore.placements.filter((p) => p.countryId === geoId()));

    // Early return pattern: in Solid, this runs once. If props.geo changes, this won't re-run unless we wrap the whole return in a Memo or derived signal.
    // However, typically MapTokens is rendered *for* a specific geo.
    // To be safe, we can use <Show>

    // cast coordinates to Coordinates to avoid d3-geo vs solidjs-simple-maps mismatch
    const centroid = () => {
        const c = geoCentroid(props.geo);
        return createCoordinates(c[0], c[1]);
    };

    return (
        <Show when={EUROPE_GRAPH[geoId()]}>
            <g>
                {/* City Label - Conditional */}
                <Show when={gameStore.settings.mapStyle === "codes"}>
                    <Marker coordinates={centroid()}>
                        <text text-anchor="middle" y={2} class="map-token-label">
                            {geoId()}
                        </text>
                    </Marker>
                </Show>

                {/* Render Tokens */}
                <For each={tokensHere()}>
                    {(token, idx) => {
                        const player = () => gameStore.players[token.playerId];
                        // idx is a signal in <For>
                        const offsetX = () => 0.5 + idx() * 0.4;
                        const offsetY = () => -0.5 - idx() * 0.4;
                        const c = geoCentroid(props.geo); // raw coords

                        return (
                            <Marker coordinates={createCoordinates(c[0] + offsetX(), c[1] + offsetY())}>
                                <circle r={3} fill={player()?.color || "black"} stroke="white" stroke-width={1} />
                            </Marker>
                        );
                    }}
                </For>
            </g>
        </Show>
    );
}
