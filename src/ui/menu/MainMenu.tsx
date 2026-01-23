import { useState } from 'react';
import { useGameStore } from '../../store/gameStore';

export function MainMenu() {
    const dispatch = useGameStore(state => state.dispatch);
    const settings = useGameStore(state => state.settings);
    const [playerCount, setPlayerCount] = useState<number>(2);
    const [activeDescription, setActiveDescription] = useState<string | null>(null);

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

    const SettingRow = ({ label, description, children }: { label: string, description: string, children: React.ReactNode }) => (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '1rem',
                padding: '0.75rem 1rem',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '8px',
                transition: 'background 0.2s',
                cursor: 'default'
            }}
            onMouseEnter={() => setActiveDescription(description)}
            onMouseLeave={() => setActiveDescription(null)}
        >
            <span style={{ fontWeight: 500 }}>{label}</span>
            {children}
        </div>
    );

    return (
        <div style={{
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            width: '100%',
            zIndex: 1000
        }}>
            <h1 style={{ fontSize: '4rem', marginBottom: '2rem', textShadow: '0 4px 6px rgba(0,0,0,0.3)' }}>
                Without Borders
            </h1>

            <div style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                padding: '2.5rem',
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '2rem',
                width: '600px', // Fixed width to prevent growing
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <label style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#e2e8f0' }}>Number of Players</label>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        {[2, 3, 4].map(count => (
                            <button
                                key={count}
                                onClick={() => setPlayerCount(count)}
                                style={{
                                    flex: 1,
                                    padding: '1.25rem',
                                    borderRadius: '12px',
                                    border: 'none',
                                    background: playerCount === count ? '#3b82f6' : 'rgba(255,255,255,0.1)',
                                    color: 'white',
                                    cursor: 'pointer',
                                    fontSize: '1.25rem',
                                    fontWeight: 'bold',
                                    transition: 'all 0.2s',
                                    transform: playerCount === count ? 'scale(1.05)' : 'scale(1)',
                                    boxShadow: playerCount === count ? '0 4px 12px rgba(59, 130, 246, 0.4)' : 'none'
                                }}
                            >
                                {count} Players
                            </button>
                        ))}
                    </div>
                </div>

                <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '0 0' }} />

                {/* Settings Section */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Game Settings</h3>

                    {/* Travel Costs Toggle */}
                    <SettingRow
                        label="Show Travel Costs"
                        description="Display the cost of moving between countries on the map lines."
                    >
                        <div
                            onClick={toggleTravelCosts}
                            style={{
                                width: '48px', height: '26px',
                                background: settings.showTravelCosts ? '#22c55e' : '#475569',
                                borderRadius: '99px',
                                position: 'relative',
                                cursor: 'pointer',
                                transition: 'background 0.2s'
                            }}
                        >
                            <div style={{
                                width: '22px', height: '22px',
                                background: 'white', borderRadius: '50%',
                                position: 'absolute', top: '2px',
                                left: settings.showTravelCosts ? '24px' : '2px',
                                transition: 'left 0.2s',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                            }} />
                        </div>
                    </SettingRow>

                    {/* Map Selection */}
                    <SettingRow
                        label="Map Region"
                        description="Select the region to play on. Currently only Europe is available."
                    >
                        <div style={{ display: 'flex', gap: '0.25rem', background: 'rgba(0,0,0,0.2)', padding: '4px', borderRadius: '8px' }}>
                            <button
                                style={{
                                    background: 'white',
                                    color: '#0f172a',
                                    border: 'none',
                                    borderRadius: '6px',
                                    padding: '0.4rem 1rem',
                                    fontSize: '0.9rem',
                                    cursor: 'default',
                                    fontWeight: 'bold'
                                }}
                            >
                                Europe
                            </button>
                        </div>
                    </SettingRow>

                    {/* Map Style Selector */}
                    <SettingRow
                        label="Map Labels"
                        description="Choose 'Blank' for a cleaner look or 'Codes' to see country abbreviations (e.g. AUT, CZE)."
                    >
                        <div style={{ display: 'flex', gap: '0.25rem', background: 'rgba(0,0,0,0.2)', padding: '4px', borderRadius: '8px' }}>
                            {(['blank', 'codes'] as const).map(style => (
                                <button
                                    key={style}
                                    onClick={() => updateMapStyle(style)}
                                    style={{
                                        background: settings.mapStyle === style ? 'white' : 'transparent',
                                        color: settings.mapStyle === style ? '#0f172a' : '#94a3b8',
                                        border: 'none',
                                        borderRadius: '6px',
                                        padding: '0.4rem 1rem',
                                        fontSize: '0.9rem',
                                        cursor: 'pointer',
                                        fontWeight: settings.mapStyle === style ? 'bold' : 'normal',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {style === 'blank' ? 'Blank' : 'Codes'}
                                </button>
                            ))}
                        </div>
                    </SettingRow>

                    {/* Stacking Rule (Addon) */}
                    <SettingRow
                        label="Stacking Penalty"
                        description={
                            settings.stackingRule === 'ordered'
                                ? "Standard Rule: The first player on a country is safe. Anyone arriving later pays -10."
                                : "Addon Rule: No penalties for stacking. Good for casual Pass 'n Play."
                        }
                    >
                        <div style={{ display: 'flex', gap: '0.25rem', background: 'rgba(0,0,0,0.2)', padding: '4px', borderRadius: '8px' }}>
                            <button
                                onClick={() => dispatch({ type: 'UPDATE_SETTINGS', payload: { stackingRule: 'ordered' } })}
                                style={{
                                    background: settings.stackingRule === 'ordered' ? 'white' : 'transparent',
                                    color: settings.stackingRule === 'ordered' ? '#0f172a' : '#94a3b8',
                                    border: 'none',
                                    borderRadius: '6px',
                                    padding: '0.4rem 1rem',
                                    fontSize: '0.9rem',
                                    cursor: 'pointer',
                                    fontWeight: settings.stackingRule === 'ordered' ? 'bold' : 'normal',
                                    transition: 'all 0.2s'
                                }}
                            >
                                Standard
                            </button>
                            <button
                                onClick={() => dispatch({ type: 'UPDATE_SETTINGS', payload: { stackingRule: 'none' } })}
                                style={{
                                    background: settings.stackingRule === 'none' ? 'white' : 'transparent',
                                    color: settings.stackingRule === 'none' ? '#0f172a' : '#94a3b8',
                                    border: 'none',
                                    borderRadius: '6px',
                                    padding: '0.4rem 1rem',
                                    fontSize: '0.9rem',
                                    cursor: 'pointer',
                                    fontWeight: settings.stackingRule === 'none' ? 'bold' : 'normal',
                                    transition: 'all 0.2s'
                                }}
                            >
                                None
                            </button>
                        </div>
                    </SettingRow>
                </div>

                {/* Dynamic Description Box */}
                <div style={{
                    height: 'auto',
                    minHeight: '3rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                    paddingTop: '1rem',
                    color: '#94a3b8',
                    fontStyle: 'italic',
                    fontSize: '0.95rem',
                    textAlign: 'center',
                    whiteSpace: 'normal',
                    lineHeight: '1.4'
                }}>
                    {activeDescription || "Hover over settings to see more details."}
                </div>

                <button
                    onClick={handleStart}
                    style={{
                        width: '100%',
                        padding: '1.25rem',
                        background: '#22c55e',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                        transition: 'all 0.1s',
                        marginTop: '0'
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
