import { useGameStore } from "../../store/gameStore";

export function PlayerPanel() {
    const players = useGameStore(state => state.players);
    const selections = useGameStore(state => state.currentSelections);
    const round = useGameStore(state => state.round);
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
                return (
                    <div key={id} style={{
                        background: 'white',
                        padding: '1rem',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                        borderTop: `4px solid ${p.color}`,
                        minWidth: '120px',
                        pointerEvents: 'auto'
                    }}>
                        <div style={{ fontWeight: 'bold' }}>{p.name}</div>
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
