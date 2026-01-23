import "./app.scss";
import GeoMap from "./ui/map/GeoMap.tsx";
import { PlayerPanel } from "./ui/game/PlayerPanel";
import { CardOffer } from "./ui/game/CardOffer";
import { GameSidebar } from "./ui/game/GameSidebar";
import { useGameStore } from "./store/gameStore";
import { GameEndView } from "./ui/game/GameEndView";
import { MainMenu } from "./ui/menu/MainMenu";
import { WelcomeScreen } from "./ui/menu/WelcomeScreen";

function App() {
    const phase = useGameStore(state => state.phase);
    return (
        <div className="main">
            {phase === 'MENU' && <WelcomeScreen />}
            {phase === 'SETUP' && <MainMenu />}

            {/* Game Phase */}
            {phase !== 'MENU' && phase !== 'SETUP' && (
                <>
                    {/* Sidebar on the Left */}
                    <GameSidebar />
                    <GeoMap />

                    {/* UI Overlay Layer */}
                    <CardOffer />
                    <PlayerPanel />
                    {phase === 'GAME_END' && <GameEndView />}
                </>
            )}
        </div>
    );
}

export default App;
