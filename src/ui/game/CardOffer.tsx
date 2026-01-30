import { gameStore, dispatch } from "../../store/gameStore";
import { EUROPE_GRAPH } from "../../data/europeGraph";
import { createMemo, For, Show } from "solid-js";

export function CardOffer() {
    // Helpers to get name from ID
    const getName = (id: string | null) => id ? (EUROPE_GRAPH[id]?.name || id) : '';

    const offerItems = createMemo(() => [...gameStore.offer, 'SPACE_40']);

    return (
        <div class="card-offer" style={{
            position: 'absolute',
            top: "20px",
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            "flex-direction": 'column',
            "align-items": 'center',
            gap: '1rem',
            "z-index": 100,
            "pointer-events": 'none'
        }}>
            {/* Start / Destination Center Cards */}
            <div style={{ display: 'flex', gap: '2rem', "pointer-events": 'auto' }}>
                <Show when={gameStore.startingCountry}>
                    <div style={{
                        background: '#fff', padding: '0.5rem 1rem', "border-radius": '8px',
                        border: '2px solid #22c55e', "box-shadow": '0 4px 6px rgba(0,0,0,0.2)',
                        "text-align": 'center'
                    }}>
                        <div style={{ "font-size": '0.7em', "text-transform": 'uppercase', color: '#666' }}>Start</div>
                        <div style={{ "font-weight": 'bold', "font-size": '1.2em' }}>{getName(gameStore.startingCountry)}</div>
                    </div>
                </Show>

                <Show when={gameStore.destinationCountry}>
                    <div style={{
                        background: '#fff', padding: '0.5rem 1rem', "border-radius": '8px',
                        border: '2px solid #ef4444', "box-shadow": '0 4px 6px rgba(0,0,0,0.2)',
                        "text-align": 'center'
                    }}>
                        <div style={{ "font-size": '0.7em', "text-transform": 'uppercase', color: '#666' }}>Destination</div>
                        <div style={{ "font-weight": 'bold', "font-size": '1.2em' }}>{getName(gameStore.destinationCountry)}</div>
                    </div>
                </Show>
            </div>

            {/* Offer Bar */}
            <Show when={gameStore.offer.length > 0}>
                <div style={{
                    display: 'flex', gap: '0.5rem',
                    background: 'rgba(255,255,255,0.9)', padding: '0.5rem', "border-radius": '12px',
                    "pointer-events": 'auto'
                }}>
                    <For each={offerItems()}>
                        {(countryId) => {
                            const isSpace40 = countryId === 'SPACE_40';
                            // Reactive checking of selection
                            const isSelected = () => gameStore.activePlayerId && (gameStore.currentSelections[gameStore.activePlayerId] || []).includes(countryId);

                            // Find all players who selected this
                            const selectingPlayers = createMemo(() => Object.keys(gameStore.currentSelections)
                                .filter(pid => gameStore.currentSelections[pid]?.includes(countryId))
                                .map(pid => gameStore.players[pid]));

                            const handleCardClick = () => {
                                if (gameStore.activePlayerId && gameStore.phase === 'TRAVEL_PLANNING') {
                                    dispatch({ type: 'PLACE_TOKEN', payload: { playerId: gameStore.activePlayerId, countryId } });
                                }
                            };

                            const isClickable = () => gameStore.activePlayerId && gameStore.phase === 'TRAVEL_PLANNING';

                            return (
                                <div
                                    onClick={handleCardClick}
                                    style={{
                                        background: isSelected() ? '#eff6ff' : 'white',
                                        border: isSelected() ? '2px solid #3b82f6' : '1px solid #ddd',
                                        "border-radius": '6px',
                                        padding: '0.5rem', "min-width": '80px', "text-align": 'center',
                                        cursor: isClickable() ? 'pointer' : 'default',
                                        position: 'relative',
                                        display: 'flex', "flex-direction": 'column', "align-items": 'center', gap: '0.25rem'
                                    }}>
                                    <div style={{ "font-weight": isSelected() ? 'bold' : 'normal' }}>
                                        {isSpace40 ? 'Space 40' : getName(countryId)}
                                    </div>
                                    <Show when={isSpace40}>
                                        <div style={{ "font-size": '0.7em', color: '#666' }}>Pass (-40€)</div>
                                    </Show>

                                    {/* Player Tokens */}
                                    <div style={{ display: 'flex', gap: '2px', "margin-top": '2px', "flex-wrap": 'wrap', "justify-content": 'center' }}>
                                        <For each={selectingPlayers()}>
                                            {(p) => (
                                                <div style={{
                                                    width: '12px', height: '12px', "border-radius": '50%',
                                                    background: p.color, border: '1px solid white',
                                                    "box-shadow": '0 1px 2px rgba(0,0,0,0.2)'
                                                }} title={p.name} />
                                            )}
                                        </For>
                                    </div>
                                </div>
                            );
                        }}
                    </For>
                </div>
            </Show>
        </div>
    );
}
