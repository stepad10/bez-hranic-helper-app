import { gameStore, dispatch } from "../../store/gameStore";
import { For, Show, createMemo } from "solid-js";

export function PlayerPanel() {
    const playerIds = createMemo(() => Object.keys(gameStore.players));

    return (
        <Show when={playerIds().length > 0}>
            <div class="player-panel" style={{
                position: 'absolute',
                bottom: "20px",
                left: "20px",
                right: "20px",
                display: 'flex',
                gap: '1rem',
                "justify-content": 'center',
                "z-index": 100,
                "pointer-events": 'none' // Let clicks pass through gaps
            }}>
                <For each={playerIds()}>
                    {(id) => {
                        const p = () => gameStore.players[id];
                        const isActive = () => id === gameStore.activePlayerId;
                        const selectionCount = () => (gameStore.currentSelections[id] || []).length;
                        const isReady = () => selectionCount() === (gameStore.round <= 2 ? 1 : 2);

                        return (
                            <div
                                onClick={() => dispatch({ type: 'SET_ACTIVE_PLAYER', payload: id })}
                                style={{
                                    background: isActive() ? '#fff' : 'rgba(255,255,255,0.8)',
                                    padding: '1rem',
                                    "border-radius": '8px',
                                    "box-shadow": '0 4px 6px rgba(0,0,0,0.1)',
                                    "border-top": `4px solid ${p().color}`,
                                    border: isActive() ? `2px solid ${p().color}` : '2px solid transparent',
                                    transform: isActive() ? 'translateY(-10px)' : 'none',
                                    transition: 'all 0.2s',
                                    "min-width": '120px',
                                    "pointer-events": 'auto',
                                    cursor: 'pointer'
                                }}
                            >
                                <div style={{ "font-weight": 'bold' }}>{p().name}</div>
                                <div style={{ "font-size": '1.2em', color: '#10b981' }}>{p().money} €</div>
                                <div style={{ "font-size": '0.8em', color: '#666' }}>
                                    Tokens: {p().tokens.remaining}
                                    <Show when={isReady()}>
                                        <span style={{ "margin-left": '0.5rem', color: '#10b981' }}>✓ Ready</span>
                                    </Show>
                                </div>
                            </div>
                        );
                    }}
                </For>
            </div>
        </Show>
    );
}
