import "./app.scss";
import GeoMap from "./ui/map/GeoMap.tsx";
import { GameControls } from "./ui/game/GameControls";
import { PlayerPanel } from "./ui/game/PlayerPanel";
import { CardOffer } from "./ui/game/CardOffer";
import { GameSidebar } from "./ui/game/GameSidebar";
import { useGameStore } from "./store/gameStore";
import { GameEndView } from "./ui/game/GameEndView";

function App() {
    const phase = useGameStore(state => state.phase);
    return (
        <div className="main" style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', display: 'flex' }}>
            {/* Sidebar on the Left */}
            <GameSidebar />

            <div style={{ position: 'relative', flex: 1, height: '100%' }}>
                <GeoMap />

                {/* UI Overlay Layer */}
                <GameControls />
                <CardOffer />
                <PlayerPanel />
                {phase === 'GAME_END' && <GameEndView />}
            </div>
        </div>
    );
}

export default App;
