import { useGameStore } from "../../store/gameStore";
import { EUROPE_GRAPH } from "../../data/europeGraph";

export function CardOffer() {
    const offer = useGameStore(state => state.offer);
    const startingCountry = useGameStore(state => state.startingCountry);
    const destinationCountry = useGameStore(state => state.destinationCountry);
    const activePlayerId = useGameStore(state => state.activePlayerId);
    const selections = useGameStore(state => state.currentSelections);
    const players = useGameStore(state => state.players);
    const dispatch = useGameStore(state => state.dispatch);
    const phase = useGameStore(state => state.phase);

    // Helpers to get name from ID
    const getName = (id: string | null) => id ? (EUROPE_GRAPH[id]?.name || id) : '';

    return (
        <div className="card-offer" style={{
            position: 'absolute',
            top: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
            zIndex: 100,
            pointerEvents: 'none'
        }}>
            {/* Start / Destination Center Cards */}
            <div style={{ display: 'flex', gap: '2rem', pointerEvents: 'auto' }}>
                {startingCountry && (
                    <div style={{
                        background: '#fff', padding: '0.5rem 1rem', borderRadius: '8px',
                        border: '2px solid #22c55e', boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '0.7em', textTransform: 'uppercase', color: '#666' }}>Start</div>
                        <div style={{ fontWeight: 'bold', fontSize: '1.2em' }}>{getName(startingCountry)}</div>
                    </div>
                )}

                {destinationCountry && (
                    <div style={{
                        background: '#fff', padding: '0.5rem 1rem', borderRadius: '8px',
                        border: '2px solid #ef4444', boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '0.7em', textTransform: 'uppercase', color: '#666' }}>Destination</div>
                        <div style={{ fontWeight: 'bold', fontSize: '1.2em' }}>{getName(destinationCountry)}</div>
                    </div>
                )}
            </div>

            {/* Offer Bar */}
            {offer.length > 0 && (
                <div style={{
                    display: 'flex', gap: '0.5rem',
                    background: 'rgba(255,255,255,0.9)', padding: '0.5rem', borderRadius: '12px',
                    pointerEvents: 'auto'
                }}>
                    {[...offer, 'SPACE_40'].map(countryId => {
                        const isSpace40 = countryId === 'SPACE_40';
                        const isSelected = activePlayerId && (selections[activePlayerId] || []).includes(countryId);

                        // Find all players who selected this
                        const selectingPlayers = Object.keys(selections)
                            .filter(pid => selections[pid]?.includes(countryId))
                            .map(pid => players[pid]);

                        return (
                            <div
                                key={countryId}
                                onClick={() => {
                                    if (activePlayerId && phase === 'TRAVEL_PLANNING') {
                                        dispatch({ type: 'PLACE_TOKEN', payload: { playerId: activePlayerId, countryId } });
                                    }
                                }}
                                style={{
                                    background: isSelected ? '#eff6ff' : 'white',
                                    border: isSelected ? '2px solid #3b82f6' : '1px solid #ddd',
                                    borderRadius: '6px',
                                    padding: '0.5rem', minWidth: '80px', textAlign: 'center',
                                    cursor: (activePlayerId && phase === 'TRAVEL_PLANNING') ? 'pointer' : 'default',
                                    position: 'relative',
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem'
                                }}>
                                <div style={{ fontWeight: isSelected ? 'bold' : 'normal' }}>
                                    {isSpace40 ? 'Space 40' : getName(countryId)}
                                </div>
                                {isSpace40 && <div style={{ fontSize: '0.7em', color: '#666' }}>Pass (-40€)</div>}

                                {/* Player Tokens */}
                                <div style={{ display: 'flex', gap: '2px', marginTop: '2px', flexWrap: 'wrap', justifyContent: 'center' }}>
                                    {selectingPlayers.map(p => (
                                        <div key={p.id} style={{
                                            width: '12px', height: '12px', borderRadius: '50%',
                                            background: p.color, border: '1px solid white',
                                            boxShadow: '0 1px 2px rgba(0,0,0,0.2)'
                                        }} title={p.name} />
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
