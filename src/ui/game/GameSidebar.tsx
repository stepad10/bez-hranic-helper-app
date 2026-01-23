import { useState } from 'react';
import { useGameStore } from "../../store/gameStore";

export function GameSidebar() {
    const [isLegendOpen, setIsLegendOpen] = useState(false);
    const phase = useGameStore(state => state.phase);
    const round = useGameStore(state => state.round);
    const dispatch = useGameStore(state => state.dispatch);

    const selections = useGameStore(state => state.currentSelections);
    const players = useGameStore(state => state.players);

    // Dynamic Instructions based on Phase & Round
    const getInstructions = () => {
        switch (phase) {
            case 'DEALING':
                return "Click 'Deal Round' to reveal the starting country and the offer.";
            case 'TRAVEL_PLANNING':
                if (round <= 2) {
                    return "Select ONE country from the yellow offer. Try to minimize border crossings from the Green starting country. avoid direct neighbors (+30€)!";
                }
                if (round <= 4) {
                    return "Select TWO different countries. Plan a route: Start -> Choice 1 -> Choice 2. Minimize total borders and avoid neighbors.";
                }
                return "Select TWO countries. Plan a route: Start -> Choice 1 -> Choice 2 -> Destination (Red). Pass through both chosen countries.";
            case 'ROUND_END':
                return "Round complete! Review the journey costs and click 'Next Round' to continue.";
            case 'GAME_END':
                return "Game Over! Check the winner.";
            default:
                return "Welcome to Without Borders!";
        }
    };

    const canResolve = () => {
        const requiredSelections = round <= 2 ? 1 : 2;
        return Object.keys(players).length > 0 && Object.keys(players).every(pid => {
            const playerSelections = selections[pid] || [];
            return playerSelections.length === requiredSelections;
        });
    };

    return (
        <div className="game-sidebar" style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            width: '250px',
            background: 'rgba(255, 255, 255, 0.95)',
            boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 90, // Below top overlays but above map
            overflowY: 'hidden'
        }}>
            {/* Header with Back Button */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <button
                    onClick={() => window.location.reload()}
                    title="Restart Game"
                    style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        fontSize: '1.2rem', marginRight: '0.5rem', color: '#666',
                        padding: '0 0.25rem'
                    }}
                >
                    ✕
                </button>
                <h1 style={{ fontSize: '1.5rem', margin: 0, color: '#f59e0b', flex: 1 }}>Without Borders</h1>
            </div>

            {/* Phase Info */}
            <div style={{ marginBottom: '2rem' }}>
                <div style={{ textTransform: 'uppercase', fontSize: '0.75rem', color: '#666', letterSpacing: '1px' }}>
                    Round {round}
                </div>
                <h2 style={{ fontSize: '1.1rem', margin: '0.25rem 0' }}>{phase.replace('_', ' ')}</h2>
                <p style={{ lineHeight: '1.5', fontSize: '0.95rem', color: '#333' }}>
                    {getInstructions()}
                </p>

                {phase === 'DEALING' && (
                    <button
                        onClick={() => dispatch({ type: 'DEAL_ROUND', payload: { round } })}
                        style={{
                            marginTop: '1rem',
                            padding: '0.5rem 1rem',
                            background: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            display: 'block',
                            width: '100%'
                        }}
                    >
                        Deal Round
                    </button>
                )}

                {phase === 'TRAVEL_PLANNING' && (
                    <button
                        onClick={() => dispatch({ type: 'RESOLVE_ROUND' })}
                        disabled={!canResolve()}
                        style={{
                            marginTop: '1rem',
                            padding: '0.5rem 1rem',
                            background: canResolve() ? '#22c55e' : '#9ca3af',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: canResolve() ? 'pointer' : 'not-allowed',
                            display: 'block',
                            width: '100%'
                        }}>
                        Finish Round & Evaluate
                    </button>
                )}

                {phase === 'ROUND_END' && (
                    <button
                        onClick={() => dispatch({ type: 'DEAL_ROUND', payload: { round: round + 1 } })}
                        style={{
                            marginTop: '1rem',
                            padding: '0.5rem 1rem',
                            background: '#eab308',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            display: 'block',
                            width: '100%',
                            marginBottom: '1rem'
                        }}>
                        Next Round
                    </button>
                )}

            </div>

            {/* Score History Log - Scrollable Area */}
            <div style={{ flex: 1, overflowY: 'auto', minHeight: 0, marginBottom: '1rem', borderTop: '1px solid #eee' }}>
                <HistoryLog players={players} />
            </div>

            {/* Legend */}
            {/* Legend */}
            <div style={{ marginTop: 'auto', borderTop: '1px solid #eee' }}>
                <button
                    onClick={() => setIsLegendOpen(!isLegendOpen)}
                    style={{
                        width: '100%',
                        background: 'none',
                        border: 'none',
                        padding: '0.5rem 0',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        cursor: 'pointer',
                        color: '#666',
                        fontSize: '0.9rem',
                        fontWeight: 'bold'
                    }}
                >
                    <span>Map Legend</span>
                    <span>{isLegendOpen ? '▼' : '▲'}</span>
                </button>

                {isLegendOpen && (
                    <ul style={{ listStyle: 'none', padding: '0 0 1rem 0', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <LegendItem color="#22c55e" label="Starting Country" />
                        <LegendItem color="#ef4444" label="Destination Country" />
                        <LegendItem color="#fef08a" border="#eab308" label="Offer (Available)" />
                        <LegendItem color="#d6d6d6" border="#7d7d7d" label="Ordinary Country" />
                        <LegendItem color="#3b82f6" type="circle" label="Player Token" />
                    </ul>
                )}
            </div>
        </div>
    );
}

function LegendItem({ color, border, label, type = 'box' }: { color: string, border?: string, label: string, type?: 'box' | 'circle' }) {
    return (
        <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem' }}>
            <div style={{
                width: '12px',
                height: '12px',
                background: color,
                border: border ? `2px solid ${border}` : 'none',
                borderRadius: type === 'circle' ? '50%' : '2px'
            }} />
            <span>{label}</span>
        </li>
    );
}

function HistoryLog({ players }: { players: any }) {
    const history = useGameStore(state => state.roundHistory);
    const highlightedPlayerId = useGameStore(state => state.highlightedPlayerId);

    if (!history || history.length === 0) return null;

    // Show latest first
    const reversedHistory = [...history].reverse();

    return (
        <div style={{ paddingTop: '1rem' }}>
            <h3 style={{ fontSize: '1rem', margin: '0 0 1rem 0', color: '#666' }}>Round History</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {reversedHistory.map((summary) => (
                    <div key={summary.round} style={{ fontSize: '0.85rem' }}>
                        <div style={{ fontWeight: 'bold', marginBottom: '0.5rem', color: '#888' }}>Round {summary.round}</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {Object.keys(summary.players).map(pid => {
                                const pVal = summary.players[pid];
                                const pName = players[pid]?.name || pid;
                                const pColor = players[pid]?.color || '#333';
                                const path = pVal.path;

                                const isHighlighted = highlightedPlayerId === pid;

                                return (
                                    <div
                                        key={pid}
                                        style={{
                                            borderLeft: `3px solid ${pColor}`,
                                            paddingLeft: '0.5rem',
                                            paddingRight: '0.5rem',
                                            paddingTop: '0.25rem',
                                            paddingBottom: '0.25rem',
                                            cursor: 'pointer',
                                            background: isHighlighted ? 'rgba(0,0,0,0.05)' : 'transparent',
                                            transition: 'background 0.2s',
                                            borderRadius: '0 4px 4px 0'
                                        }}
                                    >
                                        <div style={{ fontWeight: 'bold' }}>{pName}</div>

                                        {/* Path Visualization */}
                                        {path && path.length > 0 && (
                                            <div style={{ fontSize: '0.8rem', color: '#666', margin: '0.25rem 0', fontFamily: 'monospace' }}>
                                                {path.map((cid, i) => (
                                                    <span key={i}>
                                                        {cid}
                                                        {i < path.length - 1 && (
                                                            <span style={{ color: '#aaa', margin: '0 4px' }}>
                                                                -(10)→
                                                            </span>
                                                        )}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.25rem', color: '#555' }}>
                                            {pVal.journeyCost > 0 && <span>Travel Total: -{pVal.journeyCost}€</span>}
                                            {pVal.space40Cost > 0 && <span>Space 40: -{pVal.space40Cost}€</span>}
                                            {pVal.stackingPenalty > 0 && <span>Stacking: -{pVal.stackingPenalty}€</span>}
                                            {pVal.totalEarnings !== undefined ? (
                                                <><span style={{ fontWeight: 'bold' }}>Total Earned:</span> <span style={{ color: '#10b981', fontWeight: 'bold' }}>+{pVal.totalEarnings}€</span></>
                                            ) : (
                                                <><span style={{ fontWeight: 'bold' }}>Total Cost:</span> <span style={{ color: '#ef4444', fontWeight: 'bold' }}>-{pVal.totalCost}€</span></>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
