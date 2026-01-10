import { useGameStore } from "../../store/gameStore";

export function GameSidebar() {
    const phase = useGameStore(state => state.phase);
    const round = useGameStore(state => state.round);

    // Dynamic Instructions based on Phase & Round
    const getInstructions = () => {
        switch (phase) {
            case 'DEALING':
                return "Click 'Deal Round' to reveal the starting country and the offer.";
            case 'TRAVEL_PLANNING':
                if (round <= 2) {
                    return "Select ONE country from the yellow offer. Try to minimize border crossings from the Green starting country. avoid direct neighbors (+30€)!";
                }
                if (round <= 4) {
                    return "Select TWO different countries. Plan a route: Start -> Choice 1 -> Choice 2. Minimize total borders and avoid neighbors.";
                }
                return "Select TWO countries. Plan a route: Start -> Choice 1 -> Choice 2 -> Destination (Red). Pass through both chosen countries.";
            case 'ROUND_END':
                return "Round complete! Review the journey costs and click 'Next Round' to continue.";
            case 'GAME_END':
                return "Game Over! Check the winner.";
            default:
                return "Welcome to Without Borders!";
        }
    };

    return (
        <div className="game-sidebar" style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            width: '250px',
            background: 'rgba(255, 255, 255, 0.95)',
            boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 90, // Below top overlays but above map
            overflowY: 'auto'
        }}>
            <h1 style={{ fontSize: '1.5rem', marginTop: 0, color: '#f59e0b' }}>Without Borders</h1>

            {/* Phase Info */}
            <div style={{ marginBottom: '2rem' }}>
                <div style={{ textTransform: 'uppercase', fontSize: '0.75rem', color: '#666', letterSpacing: '1px' }}>
                    Round {round}
                </div>
                <h2 style={{ fontSize: '1.1rem', margin: '0.25rem 0' }}>{phase.replace('_', ' ')}</h2>
                <p style={{ lineHeight: '1.5', fontSize: '0.95rem', color: '#333' }}>
                    {getInstructions()}
                </p>
            </div>

            {/* Legend */}
            <div style={{ marginTop: 'auto' }}>
                <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>Map Legend</h3>
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <LegendItem color="#22c55e" label="Starting Country" />
                    <LegendItem color="#ef4444" label="Destination Country" />
                    <LegendItem color="#fef08a" border="#eab308" label="Offer (Available)" />
                    <LegendItem color="#d6d6d6" border="#7d7d7d" label="Ordinary Country" />
                    <LegendItem color="#3b82f6" type="circle" label="Player Token" />
                </ul>
            </div>

            <div style={{ marginTop: '2rem', fontSize: '0.8rem', color: '#999', textAlign: 'center' }}>
                v0.1.0 Alpha
            </div>
        </div>
    );
}

function LegendItem({ color, border, label, type = 'box' }: { color: string, border?: string, label: string, type?: 'box' | 'circle' }) {
    return (
        <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem' }}>
            <div style={{
                width: '16px',
                height: '16px',
                background: color,
                border: border ? `2px solid ${border}` : 'none',
                borderRadius: type === 'circle' ? '50%' : '4px'
            }} />
            <span>{label}</span>
        </li>
    );
}
