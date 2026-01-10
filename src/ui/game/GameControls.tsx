import { useGameStore } from "../../store/gameStore";

export function GameControls() {
    const phase = useGameStore(state => state.phase);
    const round = useGameStore(state => state.round);
    const dispatch = useGameStore(state => state.dispatch);

    const handleStart = () => {
        dispatch({ type: 'START_GAME', payload: { playerIds: ['p1', 'p2', 'p3', 'p4'] } });
    };

    const handleDeal = () => {
        dispatch({ type: 'DEAL_ROUND', payload: { round } });
    };

    const handleResolve = () => {
        dispatch({ type: 'RESOLVE_ROUND' });
    };

    return (
        <div className="game-controls" style={{
            position: 'absolute',
            top: 20,
            right: 20,
            background: 'white',
            padding: '1rem',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
        }}>
            <h3 style={{ margin: '0 0 0.5rem 0' }}>Round {round} - {phase}</h3>

            {phase === 'DEALING' && (
                <button onClick={handleDeal} style={{ padding: '0.5rem 1rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Deal Round
                </button>
            )}

            {phase === 'TRAVEL_PLANNING' && (
                <button onClick={handleResolve} style={{ padding: '0.5rem 1rem', background: '#22c55e', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Finish Round & Evaluate
                </button>
            )}

            {phase === 'ROUND_END' && (
                <button onClick={() => dispatch({ type: 'DEAL_ROUND', payload: { round: round + 1 } })} style={{ padding: '0.5rem 1rem', background: '#eab308', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Next Round
                </button>
            )}

            <hr style={{ width: '100%', margin: '0.5rem 0' }} />

            <button onClick={handleStart} style={{ padding: '0.25rem 0.5rem', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8em' }}>
                Restart Game
            </button>
        </div>
    );
}
