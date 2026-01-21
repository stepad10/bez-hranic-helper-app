import { useGameStore } from "../../store/gameStore";

export function PlayerPanel() {
    const players = useGameStore(state => state.players);
    const selections = useGameStore(state => state.currentSelections);
    const round = useGameStore(state => state.round);
    const activePlayerId = useGameStore(state => state.activePlayerId);
    const dispatch = useGameStore(state => state.dispatch);
    const playerIds = Object.keys(players);

    if (playerIds.length === 0) return null;

    return (
        <div className="player-panel" style={{
            position: 'absolute',
            bottom: 20,
            left: 20,
            right: 20,
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            zIndex: 100,
            pointerEvents: 'none' // Let clicks pass through gaps
        }}>
            {playerIds.map(id => {
                const p = players[id];
                const isActive = id === activePlayerId;

                return (
                    <div
                        key={id}
                        onClick={() => dispatch({ type: 'SET_ACTIVE_PLAYER', payload: id })}
                        style={{
                            background: isActive ? '#fff' : 'rgba(255,255,255,0.8)',
                            padding: '1rem',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                            borderTop: `4px solid ${p.color}`,
                            border: isActive ? `2px solid ${p.color}` : '2px solid transparent',
                            transform: isActive ? 'translateY(-10px)' : 'none',
                            transition: 'all 0.2s',
                            minWidth: '120px',
                            pointerEvents: 'auto',
                            cursor: 'pointer'
                        }}
                    >
                        <div style={{ fontWeight: 'bold' }}>{p.name} {isActive && '(Active)'}</div>
                        <div style={{ fontSize: '1.2em', color: '#10b981' }}>{p.money} €</div>
                        <div style={{ fontSize: '0.8em', color: '#666' }}>
                            Tokens: {p.tokens.remaining}
                            {(selections[id] || []).length === (round <= 2 ? 1 : 2) && (
                                <span style={{ marginLeft: '0.5rem', color: '#10b981' }}>✓ Ready</span>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
