import { Geography } from "solidjs-simple-maps";
import { Feature } from "geojson";
import { gameStore, dispatch } from "../../store/gameStore";
import { findShortestPath, calculateJourneyCost, JourneyCost } from "../../game-core/pathfinding";
import { EUROPE_GRAPH } from "../../data/europeGraph";
import { createMemo, createSignal } from "solid-js";

interface MapRegionProps {
    geo: Feature;
    onHoverCost: (cost: JourneyCost | null) => void;
}

export function MapRegion(props: MapRegionProps) {
    const geoId = () => (props.geo.id || "") as string;

    const isStart = createMemo(() => gameStore.startingCountry === geoId());
    const isDest = createMemo(() => gameStore.destinationCountry === geoId());
    const isOffer = createMemo(() => gameStore.offer.includes(geoId()));
    const tokensHere = createMemo(() => gameStore.placements.filter((p) => p.countryId === geoId()));

    const [isHovered, setIsHovered] = createSignal(false);

    const handleClick = () => {
        if (gameStore.phase !== "TRAVEL_PLANNING") return;

        // Use accessor value
        if (isOffer()) {
            if (!gameStore.activePlayerId) return;

            dispatch({
                type: "PLACE_TOKEN",
                payload: { playerId: gameStore.activePlayerId, countryId: geoId() },
            });
        }
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
        if (isOffer() && gameStore.startingCountry) {
            const path = findShortestPath(gameStore.startingCountry, geoId(), EUROPE_GRAPH);
            const cost = calculateJourneyCost(path, EUROPE_GRAPH);
            props.onHoverCost(cost);
        } else {
            props.onHoverCost(null);
        }
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        props.onHoverCost(null);
    };

    // Style logic using createMemo for reactivity based on derived signals
    const currentStyle = createMemo(() => {
        let fill = "#d6d6d6";
        let stroke = "#7d7d7d";
        let strokeWidth = 0.5;

        // Base State
        if (isStart()) {
            fill = "#22c55e"; // Green-500
            stroke = "#166534"; // Green-800
            strokeWidth = 2;
        } else if (isDest()) {
            fill = "#ef4444"; // Red-500
            stroke = "#991b1b"; // Red-800
            strokeWidth = 2;
        } else if (isOffer()) {
            fill = "#fef08a"; // Yellow-200
            stroke = "#eab308"; // Yellow-500
            strokeWidth = 1.5;
        }

        // Hover State overrides
        if (isHovered()) {
            if (isOffer()) {
                fill = "#fcd34d"; // Yellow-300
                stroke = "#333333";
                strokeWidth = 1;
            } else {
                fill = "#a8a8a8"; // Darker Gray
            }
        }

        // Increase stroke width if occupied (applied on top of hover if needed, or stick to base logic)
        if (tokensHere().length > 0) {
            strokeWidth += 0.5;
        }

        return { fill, stroke, strokeWidth };
    });

    return (
        <Geography
            geography={props.geo}
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            fill={currentStyle().fill}
            stroke={currentStyle().stroke}
            stroke-width={currentStyle().strokeWidth}
            class="map-region"
        />
    );
}
