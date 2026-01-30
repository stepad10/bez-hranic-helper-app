import { createMemo, For } from 'solid-js';
import { gameStore } from '../../store/gameStore';

export function GameEndView() {
    const sortedPlayers = createMemo(() =>
        Object.values(gameStore.players).sort((a, b) => b.money - a.money)
    );
    // Sort might not be stable if called on same array instance if it mutates... Object.values creates new array. Good.

    // Derived winner
    const winner = () => sortedPlayers()[0];

    return (
        <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.85)',
            color: 'white',
            display: 'flex',
            "flex-direction": 'column',
            "align-items": 'center',
            "justify-content": 'center',
            "z-index": 1000
        }}>
            <h1 style={{ "font-size": '3rem', "margin-bottom": '1rem' }}>Game Over</h1>

            <div style={{
                background: 'white',
                color: '#333',
                padding: '2rem',
                "border-radius": '16px',
                "min-width": '300px',
                "box-shadow": '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
            }}>
                <h2 style={{ "text-align": 'center', color: '#B45309', "margin-bottom": '1.5rem' }}>
                    Winner: {winner()?.name}
                </h2>

                <div style={{ display: 'flex', "flex-direction": 'column', gap: '1rem' }}>
                    <For each={sortedPlayers()}>
                        {(player, idx) => (
                            <div style={{
                                display: 'flex',
                                "justify-content": 'space-between',
                                padding: '0.5rem 1rem',
                                background: idx() === 0 ? '#FEF3C7' : '#F3F4F6',
                                "border-radius": '8px',
                                "font-weight": idx() === 0 ? 'bold' : 'normal'
                            }}>
                                <span>{idx() + 1}. {player.name}</span>
                                <span>{player.money} €</span>
                            </div>
                        )}
                    </For>
                </div>
            </div>

            <button
                onClick={() => window.location.reload()}
                style={{
                    "margin-top": '2rem',
                    padding: '0.75rem 2rem',
                    background: '#ef4444',
                    color: 'white',
                    border: 'none',
                    "border-radius": '8px',
                    "font-size": '1.2rem',
                    cursor: 'pointer'
                }}
            >
                Play Again
            </button>
        </div>
    );
}
