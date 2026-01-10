import "./app.scss";
import GeoMap from "./ui/map/GeoMap.tsx";
import { GameControls } from "./ui/game/GameControls";
import { PlayerPanel } from "./ui/game/PlayerPanel";
import { CardOffer } from "./ui/game/CardOffer";
import { GameSidebar } from "./ui/game/GameSidebar";

function App() {
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
            </div>
        </div>
    );
}

export default App;
