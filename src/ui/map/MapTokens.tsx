import { Marker } from "react-simple-maps";
import { geoCentroid } from "d3-geo";
import { EUROPE_GRAPH } from "../../data/europeGraph";
import { useGameStore } from "../../store/gameStore";

interface MapTokensProps {
    geo: any;
    tokensHere: any[];
}

export function MapTokens({ geo, tokensHere }: MapTokensProps) {
    const players = useGameStore(state => state.players);
    const geoId = geo.id;

    if (!EUROPE_GRAPH[geoId]) return null;

    const centroid = geoCentroid(geo);

    return (
        <g>
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

            {/* Render Tokens */}
            {tokensHere.map((token, idx) => {
                const player = players[token.playerId];
                // slight spiral or offset for stacking?
                // simple linear offset for now
                const offsetX = 0.5 + (idx * 0.4);
                const offsetY = -0.5 - (idx * 0.4);

                return (
                    <Marker key={`token-${idx}`} coordinates={[centroid[0] + offsetX, centroid[1] + offsetY]}>
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
}
