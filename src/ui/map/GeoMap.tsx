import { useState } from "react";
import { ComposableMap, Geographies, ZoomableGroup } from "react-simple-maps";
import europeTopo from "../../assets/europe.json";
import { useGameStore } from "../../store/gameStore";
import { MapRegion } from "./MapRegion";
import { MapTokens } from "./MapTokens";
import { SeaRoutes } from "./SeaRoutes";
import { PlayerPaths } from "./PlayerPaths";

const geoUrl = europeTopo;

function GeoMap(): JSX.Element {
    const {
        offer,
        startingCountry,
        destinationCountry,
        placements,
        settings,
        phase
    } = useGameStore(state => state);

    // Hover state for cost preview
    const [hoveredCost, setHoveredCost] = useState<{ total: number, breakdown: any } | null>(null);

    // Map Hidden State for Travel Planning
    if (phase === 'TRAVEL_PLANNING') {
        return (
            <div style={{
                position: 'relative', width: "100%", height: "100vh",
                background: "#0f172a",
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                color: 'white', overflow: "hidden"
            }}>
                <div style={{
                    fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem',
                    textTransform: 'uppercase', letterSpacing: '2px',
                    textShadow: '0 4px 10px rgba(0,0,0,0.5)'
                }}>
                    Map Hidden
                </div>
                <div style={{ fontSize: '1rem', opacity: 0.7, maxWidth: '400px', textAlign: 'center', lineHeight: '1.5' }}>
                    Consult the "Offer" cards on the right.
                    <br />
                    Rely on your knowledge of Europe's geography!
                </div>
            </div>
        );
    }

    return (
        <div style={{ position: 'relative', width: "100%", height: "100vh", background: "#f0f8ff", overflow: "hidden" }}>

            {/* Hover Tooltip */}
            {hoveredCost && settings.showTravelCosts && (
                <div style={{
                    position: 'absolute',
                    top: 20, left: '50%', transform: 'translateX(-50%)',
                    marginTop: '80px', // Below the card offer
                    background: 'rgba(0,0,0,0.8)', color: 'white',
                    padding: '0.5rem 1rem', borderRadius: '4px',
                    pointerEvents: 'none', zIndex: 110,
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Cost: {hoveredCost.total} €</div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                        {hoveredCost.breakdown.borders / 10} Borders | {hoveredCost.breakdown.neighbors > 0 ? 'Neighbor Penalty' : 'No Neighbors'}
                    </div>
                </div>
            )}

            <ComposableMap projection="geoMercator" projectionConfig={{ scale: 700, center: [15, 50] }} style={{ width: "100%", height: "100%" }}>
                <ZoomableGroup center={[15, 50]} zoom={1} minZoom={0.5} maxZoom={4}>
                    <Geographies geography={geoUrl}>
                        {({ geographies }) => (
                            <>
                                {/* Sea Routes Layer (Underneath Countries) */}
                                <SeaRoutes geographies={geographies} />

                                {geographies.map((geo) => {
                                    const geoId = geo.id;
                                    const isStart = geoId === startingCountry;
                                    const isDest = geoId === destinationCountry;
                                    const isOffer = offer.includes(geoId);
                                    const tokensHere = placements.filter(p => p.countryId === geoId);

                                    return (
                                        <MapRegion
                                            key={geo.rsmKey}
                                            geo={geo}
                                            isStart={isStart}
                                            isDest={isDest}
                                            isOffer={isOffer}
                                            tokensHere={tokensHere}
                                            onHoverCost={setHoveredCost}
                                        />
                                    );
                                })}

                                {/* Player Paths for Scoring Verification (Round End) - Overlaid on Countries */}
                                <PlayerPaths geographies={geographies} />

                                {/* Labels & Tokens Overlay */}
                                {geographies.map((geo) => {
                                    const geoId = geo.id;
                                    const tokensHere = placements.filter(p => p.countryId === geoId);

                                    return (
                                        <MapTokens
                                            key={`${geo.rsmKey}-tokens`}
                                            geo={geo}
                                            tokensHere={tokensHere}
                                        />
                                    );
                                })}
                            </>
                        )}
                    </Geographies>
                </ZoomableGroup>
            </ComposableMap>
        </div>
    );
}

export default GeoMap;
