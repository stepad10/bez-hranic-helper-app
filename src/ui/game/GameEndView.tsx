import { useGameStore } from '../../store/gameStore';

export function GameEndView() {
    const players = useGameStore(state => state.players);
    const sortedPlayers = Object.values(players).sort((a, b) => b.money - a.money);
    const winner = sortedPlayers[0];

    return (
        <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.85)',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        }}>
            <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Game Over</h1>

            <div style={{
                background: 'white',
                color: '#333',
                padding: '2rem',
                borderRadius: '16px',
                minWidth: '300px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
            }}>
                <h2 style={{ textAlign: 'center', color: '#B45309', marginBottom: '1.5rem' }}>
                    Winner: {winner.name}
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {sortedPlayers.map((player, idx) => (
                        <div key={player.id} style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            padding: '0.5rem 1rem',
                            background: idx === 0 ? '#FEF3C7' : '#F3F4F6',
                            borderRadius: '8px',
                            fontWeight: idx === 0 ? 'bold' : 'normal'
                        }}>
                            <span>{idx + 1}. {player.name}</span>
                            <span>{player.money} €</span>
                        </div>
                    ))}
                </div>
            </div>

            <button
                onClick={() => window.location.reload()}
                style={{
                    marginTop: '2rem',
                    padding: '0.75rem 2rem',
                    background: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1.2rem',
                    cursor: 'pointer'
                }}
            >
                Play Again
            </button>
        </div>
    );
}
