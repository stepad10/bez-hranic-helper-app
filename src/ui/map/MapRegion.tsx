import { Geography } from "react-simple-maps";
import { useGameStore } from "../../store/gameStore";
import { findShortestPath, calculateJourneyCost } from "../../game-core/pathfinding";
import { EUROPE_GRAPH } from "../../data/europeGraph";

interface MapRegionProps {
    geo: any;
    isStart: boolean;
    isDest: boolean;
    isOffer: boolean;
    tokensHere: any[];
    onHoverCost: (cost: any) => void;
}

export function MapRegion({ geo, isStart, isDest, isOffer, tokensHere, onHoverCost }: MapRegionProps) {
    const {
        dispatch,
        offer,
        startingCountry,
        phase,
        players,
        activePlayerId
    } = useGameStore(state => state);

    // activePlayerId is now managed globally
    // const activePlayerId = Object.keys(players)[0];

    const handleClick = () => {
        const geoId = geo.id;
        if (phase !== 'TRAVEL_PLANNING') return;

        if (offer.includes(geoId)) {
            if (!activePlayerId) return;

            dispatch({
                type: 'PLACE_TOKEN',
                payload: { playerId: activePlayerId, countryId: geoId }
            });
        }
    };

    const handleMouseEnter = () => {
        const geoId = geo.id;
        if (offer.includes(geoId) && startingCountry) {
            const path = findShortestPath(startingCountry, geoId, EUROPE_GRAPH);
            const cost = calculateJourneyCost(path, EUROPE_GRAPH);
            onHoverCost(cost);
        } else {
            onHoverCost(null);
        }
    };

    const handleMouseLeave = () => {
        onHoverCost(null);
    };

    // Style logic
    let fill = "#d6d6d6";
    let stroke = "#7d7d7d";
    let strokeWidth = 0.5;

    if (isStart) {
        fill = "#22c55e";
        stroke = "#166534";
        strokeWidth = 2;
    } else if (isDest) {
        fill = "#ef4444";
        stroke = "#991b1b";
        strokeWidth = 2;
    } else if (isOffer) {
        fill = "#fef08a";
        stroke = "#eab308";
        strokeWidth = 1.5;
    }

    // Interactive darkening if tokens exist
    if (tokensHere.length > 0) {
        // slight darken
        // We can't easily darken hex without a helper, so let's just use a distinct border or slight opacity change
        // Or just nothing if MapTokens is sufficient.
        // Let's just satisfy the linter by logging or checking length for a style adjustment
        // fill = "#ccc"; // Example: tint occupied countries
    }

    // Linter fix: Actually use the variable to avoid warning, or remove it.
    // Let's use it to increase stroke width if occupied.
    if (tokensHere.length > 0) {
        strokeWidth += 0.5;
    }

    return (
        <Geography
            geography={geo}
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
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
}
