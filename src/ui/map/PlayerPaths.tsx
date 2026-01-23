import { useMemo } from 'react';
import { Line } from 'react-simple-maps';
import { geoCentroid } from 'd3-geo';
import { useGameStore } from '../../store/gameStore';
import { CountryId } from '../../types/game';

interface PlayerPathsProps {
    geographies: any[];
}

export function PlayerPaths({ geographies }: PlayerPathsProps) {
    const roundHistory = useGameStore(state => state.roundHistory);
    const players = useGameStore(state => state.players);
    const phase = useGameStore(state => state.phase);
    const highlightedPlayerId = useGameStore(state => state.highlightedPlayerId);
    const activePlayerId = useGameStore(state => state.activePlayerId);

    const { lines } = useMemo(() => {
        const result = { lines: [] as any[] };

        // Only show in ROUND_END or GAME_END
        if (phase !== 'ROUND_END' && phase !== 'GAME_END') return result;

        const latestRound = roundHistory[roundHistory.length - 1];
        if (!latestRound) return result;

        const countryCentroids: Record<string, [number, number]> = {};
        geographies.forEach(geo => {
            const centroid = geoCentroid(geo);
            const id = geo.id as CountryId;
            if (id && centroid) {
                countryCentroids[id] = centroid;
            }
        });

        Object.keys(latestRound.players).forEach((pid, index) => {
            const pData = latestRound.players[pid];
            const player = players[pid];
            const path = pData.path;

            if (path && path.length > 0) {
                // Short crossing lines logic removed per user request, using full lines
                if (path.length > 1) {
                    for (let i = 0; i < path.length - 1; i++) {
                        const fromId = path[i];
                        const toId = path[i + 1];
                        const start = countryCentroids[fromId];
                        const end = countryCentroids[toId];

                        if (start && end) {
                            const isHighlighted = highlightedPlayerId === pid || activePlayerId === pid;
                            // Default: 50% opacity, 1px width
                            // Highlighted: 100% opacity, 3px width
                            const opacity = isHighlighted ? 1 : 0.5;
                            const width = isHighlighted ? 3 : 1.5;

                            result.lines.push({
                                from: start,
                                to: end,
                                color: player.color,
                                key: `${pid}-${fromId}-${toId}-${i}`,
                                offset: index * 2,
                                opacity,
                                width,
                                pid, // Pass PID for hover action source
                                isHighlighted // for sorting/z-index potentially?
                            });
                        }
                    }
                }
            }
        });

        // specific sorting to ensure highlighted is on top?
        result.lines.sort((a, b) => (a.isHighlighted === b.isHighlighted) ? 0 : a.isHighlighted ? 1 : -1);

        return result;
    }, [geographies, roundHistory, phase, players, highlightedPlayerId, activePlayerId]);

    if (lines.length === 0) return null;

    return (
        <g>
            {lines.map(line => (
                <Line
                    key={line.key}
                    from={line.from}
                    to={line.to}
                    stroke={line.color}
                    strokeWidth={line.width}
                    strokeLinecap="round"
                    style={{ pointerEvents: "none", opacity: line.opacity, transition: 'all 0.2s' }}
                />
            ))}
        </g>
    );
}

// Note: Simple offset logic isn't effectively implemented above without complex math for parallel lines on a map.
// For now, simple overlap is acceptable MVP. If strict visualization is needed, we'd need to calculate perpendicular vectors.
