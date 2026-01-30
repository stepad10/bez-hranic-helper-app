import { createSignal, Show, For } from "solid-js";
import { JourneyCost } from "../../game-core/pathfinding";
import { ComposableMap, Geographies, ZoomableGroup, createCoordinates } from "solidjs-simple-maps";
import { Feature } from "geojson";
import europeTopo from "../../assets/europe.json";
import { gameStore } from "../../store/gameStore";
import { MapRegion } from "./MapRegion";
import { MapTokens } from "./MapTokens";
import { SeaRoutes } from "./SeaRoutes";
import { PlayerPaths } from "./PlayerPaths";

const geoUrl = europeTopo;

function GeoMap() {
    // Hover state for cost preview
    const [hoveredCost, setHoveredCost] = createSignal<JourneyCost | null>(null);

    return (
        <Show
            when={gameStore.phase !== "TRAVEL_PLANNING"}
            fallback={
                <div class="map-hidden-container">
                    <div class="map-hidden-title">Map Hidden</div>
                    <div class="map-hidden-descriptor">
                        Consult the "Offer" cards on the right.
                        <br />
                        Rely on your knowledge of Europe's geography!
                    </div>
                </div>
            }
        >
            <div class="map-container">
                {/* Hover Tooltip */}
                <Show when={hoveredCost() && gameStore.settings.showTravelCosts}>
                    <div class="map-tooltip">
                        <div class="map-tooltip-title">Cost: {hoveredCost()?.total} €</div>
                        <div class="map-tooltip-subtitle">
                            {(hoveredCost()?.breakdown.borders || 0) / 10} Borders |{" "}
                            {(hoveredCost()?.breakdown.neighbors || 0) > 0 ? "Neighbor Penalty" : "No Neighbors"}
                        </div>
                    </div>
                </Show>

                <ComposableMap
                    projection="geoMercator"
                    projectionConfig={{ scale: 700, center: createCoordinates(15, 50) }}
                    style={{ width: "100%", height: "100%" }}
                >
                    <ZoomableGroup center={createCoordinates(15, 50)} zoom={1} minZoom={0.5} maxZoom={4}>
                        <Geographies geography={geoUrl}>
                            {({ geographies }) => (
                                <>
                                    {/* Sea Routes Layer (Underneath Countries) */}
                                    <SeaRoutes geographies={geographies} />

                                    <For each={geographies}>{(geo) => <MapRegion geo={geo} onHoverCost={setHoveredCost} />}</For>

                                    {/* Player Paths */}
                                    <PlayerPaths geographies={geographies} />

                                    {/* Labels & Tokens Overlay */}
                                    <For each={geographies}>{(geo: Feature) => <MapTokens geo={geo} />}</For>
                                </>
                            )}
                        </Geographies>
                    </ZoomableGroup>
                </ComposableMap>
            </div>
        </Show>
    );
}

export default GeoMap;
