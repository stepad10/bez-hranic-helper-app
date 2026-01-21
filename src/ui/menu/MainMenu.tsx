import { useState } from 'react';
import { useGameStore } from '../../store/gameStore';

export function MainMenu() {
    const dispatch = useGameStore(state => state.dispatch);
    const settings = useGameStore(state => state.settings);
    const [playerCount, setPlayerCount] = useState<number>(2);

    const toggleTravelCosts = () => {
        dispatch({ type: 'UPDATE_SETTINGS', payload: { showTravelCosts: !settings.showTravelCosts } });
    };

    const updateMapStyle = (style: 'blank' | 'codes') => {
        dispatch({ type: 'UPDATE_SETTINGS', payload: { mapStyle: style } });
    };

    const handleStart = () => {
        const pIds = Array.from({ length: playerCount }, (_, i) => `p${i + 1}`);
        dispatch({ type: 'START_GAME', payload: { playerIds: pIds } });
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
            <h1 style={{ fontSize: '4rem', marginBottom: '2rem', textShadow: '0 4px 6px rgba(0,0,0,0.3)' }}>
                Without Borders
            </h1>

            <div style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                padding: '2rem',
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
                minWidth: '300px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#e2e8f0' }}>Number of Players</label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {[2, 3, 4].map(count => (
                            <button
                                key={count}
                                onClick={() => setPlayerCount(count)}
                                style={{
                                    flex: 1,
                                    padding: '1rem',
                                    borderRadius: '8px',
                                    border: 'none',
                                    background: playerCount === count ? '#3b82f6' : 'rgba(255,255,255,0.1)',
                                    color: 'white',
                                    cursor: 'pointer',
                                    fontSize: '1.2rem',
                                    transition: 'all 0.2s',
                                    transform: playerCount === count ? 'scale(1.05)' : 'scale(1)'
                                }}
                            >
                                {count}
                            </button>
                        ))}
                    </div>
                </div>

                <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '0.5rem 0' }} />

                {/* Settings Section */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1rem', color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Settings</h3>

                    {/* Travel Costs Toggle */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                        <span>Show Travel Costs</span>
                        <div
                            onClick={toggleTravelCosts}
                            style={{
                                width: '40px', height: '22px',
                                background: settings.showTravelCosts ? '#22c55e' : '#475569',
                                borderRadius: '99px',
                                position: 'relative',
                                cursor: 'pointer',
                                transition: 'background 0.2s'
                            }}
                        >
                            <div style={{
                                width: '18px', height: '18px',
                                background: 'white', borderRadius: '50%',
                                position: 'absolute', top: '2px',
                                left: settings.showTravelCosts ? '20px' : '2px',
                                transition: 'left 0.2s'
                            }} />
                        </div>
                    </div>

                    {/* Map Style Selector */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                        <span>Map Style</span>
                        <div style={{ display: 'flex', gap: '0.25rem', background: 'rgba(0,0,0,0.2)', padding: '2px', borderRadius: '6px' }}>
                            {(['blank', 'codes'] as const).map(style => (
                                <button
                                    key={style}
                                    onClick={() => updateMapStyle(style)}
                                    style={{
                                        background: settings.mapStyle === style ? 'white' : 'transparent',
                                        color: settings.mapStyle === style ? '#0f172a' : '#94a3b8',
                                        border: 'none',
                                        borderRadius: '4px',
                                        padding: '0.25rem 0.75rem',
                                        fontSize: '0.85rem',
                                        cursor: 'pointer',
                                        fontWeight: settings.mapStyle === style ? 'bold' : 'normal'
                                    }}
                                >
                                    {style === 'blank' ? 'Blank' : 'Codes'}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleStart}
                    style={{
                        padding: '1rem',
                        background: '#22c55e',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                        transition: 'transform 0.1s'
                    }}
                    onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
                    onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                    Start Game
                </button>
            </div>

            <p style={{ marginTop: '2rem', color: '#94a3b8' }}>
                Plan your journey across Europe
            </p>
        </div>
    );
}
