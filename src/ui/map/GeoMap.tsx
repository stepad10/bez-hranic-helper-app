import { useState, useMemo } from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup, Marker } from "react-simple-maps";
import { geoCentroid } from "d3-geo";
import { EUROPE_GRAPH } from "../../data/europeGraph";
import { findShortestPath, calculateJourneyCost } from "../../game-core/pathfinding";
import europeTopo from "../../assets/europe.json"; // Direct JSON import
import { useGameStore } from "../../store/gameStore";

const geoUrl = europeTopo;

function GeoMap(): JSX.Element {
    const {
        offer,
        startingCountry,
        destinationCountry,
        placements,
        players,
        phase,
        dispatch
    } = useGameStore(state => state);

    // TODO: Current player logic? 
    // For now, we just auto-pick first player or use a debug player
    // In a real hot-seat game, we'd need a "Current Player" selector or turn order.
    // Let's assume for this "Part 1" we just let any click place a token for "Player 1" for testing,
    // or we rotate through them.
    // Let's grab the first available player for now.
    const activePlayerId = Object.keys(players)[0];

    const handleCountryClick = (geoId: string) => {
        if (phase !== 'TRAVEL_PLANNING') return;

        // Check if valid move (must be in offer)
        // Also ensure not already placed by THIS player (if limiting 1 per round)
        // But for rule simplicity: Just dispatch. The reducer or validation logic should handle constraints.

        // Interaction: If clicked country is in offer, place token.
        if (offer.includes(geoId)) {
            dispatch({
                type: 'PLACE_TOKEN',
                payload: { playerId: activePlayerId, countryId: geoId }
            });
        }
    };

    // Hover state for cost preview
    const [hoveredCost, setHoveredCost] = useState<{ total: number, breakdown: any } | null>(null);

    const handleMouseEnter = (geoId: string) => {
        if (offer.includes(geoId) && startingCountry) {
            const path = findShortestPath(startingCountry, geoId, EUROPE_GRAPH);
            const cost = calculateJourneyCost(path, EUROPE_GRAPH);
            setHoveredCost(cost);
        } else {
            setHoveredCost(null);
        }
    };

    const handleMouseLeave = () => {
        setHoveredCost(null);
    };

    return (
        <div style={{ position: 'relative', width: "100%", height: "100vh", background: "#f0f8ff" }}>

            {/* Hover Tooltip */}
            {hoveredCost && (
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
                                {geographies.map((geo) => {
                                    const geoId = geo.id;
                                    const isStart = geoId === startingCountry;
                                    const isDest = geoId === destinationCountry;
                                    const isOffer = offer.includes(geoId);

                                    // Placed Tokens on this country
                                    const tokensHere = placements.filter(p => p.countryId === geoId);

                                    // Style logic
                                    let fill = "#d6d6d6";
                                    let stroke = "#7d7d7d";
                                    let strokeWidth = 0.5;

                                    if (isStart) {
                                        fill = "#22c55e"; // Green
                                        stroke = "#166534";
                                        strokeWidth = 2;
                                    }
                                    else if (isDest) {
                                        fill = "#ef4444"; // Red
                                        stroke = "#991b1b";
                                        strokeWidth = 2;
                                    }
                                    else if (isOffer) {
                                        fill = "#fef08a"; // Yellow-ish
                                        stroke = "#eab308";
                                        strokeWidth = 1.5;
                                    }

                                    // Highlight if tokens are here
                                    if (tokensHere.length > 0) {
                                        // rudimentary visual: darken if occupied
                                        // fill = "#93c5fd"; 
                                    }

                                    return (
                                        <Geography
                                            key={geo.rsmKey}
                                            geography={geo}
                                            onClick={() => handleCountryClick(geoId)}
                                            onMouseEnter={() => handleMouseEnter(geoId)}
                                            onMouseLeave={handleMouseLeave}
                                            style={{
                                                default: {
                                                    fill: fill,
                                                    outline: "none",
                                                    stroke: stroke,
                                                    strokeWidth: strokeWidth,
                                                    transition: 'all 0.2s'
                                                },
                                                hover: {
                                                    fill: isOffer ? "#fcd34d" : "#a8a8a8",
                                                    outline: "none",
                                                    stroke: "#333",
                                                    strokeWidth: 1
                                                },
                                                pressed: { fill: "#E42", outline: "none" },
                                            }}
                                        />
                                    );
                                })}

                                {/* Labels & Tokens */}
                                {geographies.map((geo) => {
                                    const geoId = geo.id;
                                    if (!EUROPE_GRAPH[geoId]) return null;

                                    const centroid = geoCentroid(geo);
                                    const tokensHere = placements.filter(p => p.countryId === geoId);

                                    return (
                                        <g key={`${geo.rsmKey}-group`}>
                                            {/* City Label */}
                                            <Marker coordinates={centroid}>
                                                <text
                                                    textAnchor="middle"
                                                    y={2}
                                                    style={{
                                                        fontFamily: "Arial",
                                                        fontSize: "0.5em",
                                                        fill: "#333",
                                                        pointerEvents: "none",
                                                        fontWeight: "bold",
                                                        textShadow: "0px 0px 2px white"
                                                    }}
                                                >
                                                    {geoId}
                                                </text>
                                            </Marker>

                                            {/* Render Tokens as small circles offset from center */}
                                            {tokensHere.map((token, idx) => {
                                                const player = players[token.playerId];
                                                return (
                                                    <Marker key={`token-${idx}`} coordinates={[centroid[0] + 0.5 + (idx * 0.2), centroid[1] - 0.5 - (idx * 0.2)]}>
                                                        <circle
                                                            r={3}
                                                            fill={player?.color || 'black'}
                                                            stroke="white"
                                                            strokeWidth={1}
                                                        />
                                                    </Marker>
                                                );
                                            })}
                                        </g>
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
