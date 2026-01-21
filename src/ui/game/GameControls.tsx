import { useGameStore } from "../../store/gameStore";

export function GameControls() {
    const phase = useGameStore(state => state.phase);
    const round = useGameStore(state => state.round);
    const selections = useGameStore(state => state.currentSelections);
    const players = useGameStore(state => state.players);
    const dispatch = useGameStore(state => state.dispatch);

    const handleStart = () => {
        // Restarting -> Go back to setup? Or same players?
        // Let's make "Restart" go back to Setup by refreshing or implementing a RESET action.
        window.location.reload();
    };

    const handleDeal = () => {
        dispatch({ type: 'DEAL_ROUND', payload: { round } });
    };

    const handleResolve = () => {
        dispatch({ type: 'RESOLVE_ROUND' });
    };

    const canResolve = () => {
        const requiredSelections = round <= 2 ? 1 : 2;
        return Object.keys(players).every(pid => {
            const playerSelections = selections[pid] || [];
            return playerSelections.includes('SPACE_40') || playerSelections.length === requiredSelections;
        });
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <button
                        onClick={handleResolve}
                        disabled={!canResolve()}
                        style={{
                            padding: '0.5rem 1rem',
                            background: canResolve() ? '#22c55e' : '#9ca3af',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: canResolve() ? 'pointer' : 'not-allowed'
                        }}>
                        Finish Round & Evaluate
                    </button>

                </div>
            )}

            {phase === 'ROUND_END' && (
                <button onClick={() => {
                    if (round >= 7) {
                        // Trigger GAME_END via a specific action or just set next phase?
                        // Our reducer's RESOLVE_ROUND already sets phase to GAME_END if round > 7?
                        // Wait, reducer checks `state.round` which isn't incremented yet.
                        // RESOLVE_ROUND sets next phase based on `state.round + 1`.
                        // If round was 7, nextRound is 8, phase becomes GAME_END.
                        // So we just need to confirm if we clicked "Finish Round" in round 7, passed `RESOLVE_ROUND`
                        // then we are in `GAME_END` immediately?
                        // Ah, `RESOLVE_ROUND` logic: `const nextPhase = nextRound > 7 ? 'GAME_END' : 'ROUND_END';`
                        // But it returns `phase: nextPhase`.
                        // So if we were in Round 7, hit Resolve, we are ALREADY in GAME_END.
                        // The `phase === 'ROUND_END'` block wouldn't even show!
                        // But wait, my reducer logic:
                        // `const nextRound = state.round + 1;`
                        // `const nextPhase = nextRound > 7 ? 'GAME_END' : 'ROUND_END';`
                        // `return { ... phase: nextPhase ... }`
                        // If round=7, nextRound=8. nextPhase='GAME_END'.
                        // So after Resolve, we are in GAME_END.
                        // So we need a block for GAME_END if we want controls there (like Restart).
                    } else {
                        dispatch({ type: 'DEAL_ROUND', payload: { round: round + 1 } });
                    }
                }} style={{ padding: '0.5rem 1rem', background: '#eab308', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Next Round
                </button>
            )}

            {phase === 'GAME_END' && (
                <div style={{ padding: '0.5rem', background: '#fef3c7', borderRadius: '4px', textAlign: 'center' }}>
                    Game Over!
                </div>
            )}

            <hr style={{ width: '100%', margin: '0.5rem 0' }} />

            <button onClick={handleStart} style={{ padding: '0.25rem 0.5rem', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8em' }}>
                Restart Game
            </button>
        </div>
    );
}
