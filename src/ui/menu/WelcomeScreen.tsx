import { useGameStore } from '../../store/gameStore';

export function WelcomeScreen() {
    const dispatch = useGameStore(state => state.dispatch);

    const handlePassNPlay = () => {
        dispatch({ type: 'ENTER_SETUP' });
    };

    const handleOnlinePlay = () => {
        // No-op for now
        alert("Online Play is coming soon!");
    };

    return (
        <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            zIndex: 1000
        }}>
            <h1 style={{ fontSize: '4rem', marginBottom: '4rem', textShadow: '0 4px 6px rgba(0,0,0,0.3)' }}>
                Without Borders
            </h1>

            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
                minWidth: '300px'
            }}>
                <button
                    onClick={handlePassNPlay}
                    style={{
                        padding: '1.5rem',
                        background: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                        transition: 'transform 0.1s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px'
                    }}
                    onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
                    onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                    <span>👥</span> Pass 'n Play
                </button>

                <button
                    onClick={handleOnlinePlay}
                    style={{
                        padding: '1.5rem',
                        background: 'rgba(255,255,255,0.1)',
                        color: '#94a3b8',
                        border: '2px dashed #475569',
                        borderRadius: '12px',
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        cursor: 'not-allowed', // Changed to help user understand it's not ready
                        boxShadow: 'none',
                        transition: 'transform 0.1s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px'
                    }}
                >
                    <span>🌐</span> Online Play
                </button>
            </div>

            <p style={{ marginTop: '3rem', color: '#64748b', fontSize: '0.9rem' }}>
                v1.0.0 Alpha
            </p>
        </div>
    );
}
