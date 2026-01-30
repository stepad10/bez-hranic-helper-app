import { createMemo, For, Show } from "solid-js";
import { Line, Coordinates, createCoordinates } from "solidjs-simple-maps";
import { geoCentroid, GeoPermissibleObjects } from "d3-geo";
import { Feature } from "geojson";
import { gameStore } from "../../store/gameStore";
import { CountryId } from "../../types/game";

interface PlayerPathsProps {
    geographies: GeoPermissibleObjects[];
}

interface PathLine {
    from: Coordinates;
    to: Coordinates;
    color: string;
    key: string;
    offset: number;
    opacity: number;
    width: number;
    pid: string;
    isHighlighted: boolean;
}

export function PlayerPaths(props: PlayerPathsProps) {
    const lines = createMemo(() => {
        const result: PathLine[] = [];

        // Only show in ROUND_END or GAME_END
        if (gameStore.phase !== "ROUND_END" && gameStore.phase !== "GAME_END") return result;

        const latestRound = gameStore.roundHistory[gameStore.roundHistory.length - 1];
        if (!latestRound) return result;

        const countryCentroids: Record<string, Coordinates> = {};
        props.geographies.forEach((geo) => {
            const centroid = geoCentroid(geo);
            const id = (geo as Feature).id as CountryId;
            if (id && centroid) {
                countryCentroids[id] = createCoordinates(centroid[0], centroid[1]);
            }
        });

        Object.keys(latestRound.players).forEach((pid, index) => {
            const pData = latestRound.players[pid];
            const player = gameStore.players[pid];
            const path = pData.path;

            if (path && path.length > 0) {
                if (path.length > 1) {
                    for (let i = 0; i < path.length - 1; i++) {
                        const fromId = path[i];
                        const toId = path[i + 1];
                        const start = countryCentroids[fromId];
                        const end = countryCentroids[toId];

                        if (start && end) {
                            const isHighlighted = gameStore.highlightedPlayerId === pid || gameStore.activePlayerId === pid;
                            const opacity = isHighlighted ? 1 : 0.5;
                            const width = isHighlighted ? 3 : 1.5;

                            result.push({
                                from: start,
                                to: end,
                                color: player.color,
                                key: `${pid}-${fromId}-${toId}-${i}`,
                                offset: index * 2,
                                opacity,
                                width,
                                pid,
                                isHighlighted,
                            });
                        }
                    }
                }
            }
        });

        // specific sorting to ensure highlighted is on top?
        result.sort((a, b) => (a.isHighlighted === b.isHighlighted ? 0 : a.isHighlighted ? 1 : -1));

        return result;
    });

    return (
        <Show when={lines().length > 0}>
            <g>
                <For each={lines()}>
                    {(line) => (
                        <Line
                            from={line.from}
                            to={line.to}
                            stroke={line.color}
                            stroke-width={line.width}
                            stroke-linecap="round"
                            class="player-path"
                            style={{ opacity: line.opacity }}
                        />
                    )}
                </For>
            </g>
        </Show>
    );
}

// Note: Simple offset logic isn't effectively implemented above without complex math for parallel lines on a map.
// For now, simple overlap is acceptable MVP. If strict visualization is needed, we'd need to calculate perpendicular vectors.
