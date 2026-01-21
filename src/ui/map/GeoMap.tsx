import { useState } from "react";
import { ComposableMap, Geographies, ZoomableGroup } from "react-simple-maps";
import europeTopo from "../../assets/europe.json";
import { useGameStore } from "../../store/gameStore";
import { MapRegion } from "./MapRegion";
import { MapTokens } from "./MapTokens";
import { SeaRoutes } from "./SeaRoutes";

const geoUrl = europeTopo;

function GeoMap(): JSX.Element {
    const {
        offer,
        startingCountry,
        destinationCountry,
        placements,
        settings
    } = useGameStore(state => state);

    // Hover state for cost preview
    const [hoveredCost, setHoveredCost] = useState<{ total: number, breakdown: any } | null>(null);

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
