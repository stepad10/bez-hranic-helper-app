import { useGameStore } from "../../store/gameStore";
import { EUROPE_GRAPH } from "../../data/europeGraph";

export function CardOffer() {
    const offer = useGameStore(state => state.offer);
    const startingCountry = useGameStore(state => state.startingCountry);
    const destinationCountry = useGameStore(state => state.destinationCountry);

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
                    {offer.map(countryId => (
                        <div key={countryId} style={{
                            background: 'white', border: '1px solid #ddd', borderRadius: '6px',
                            padding: '0.5rem', minWidth: '80px', textAlign: 'center',
                            cursor: 'help' // Placeholder for interaction
                        }}>
                            {getName(countryId)}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
