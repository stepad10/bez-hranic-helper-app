import "./app.scss";
import GeoMap from "./ui/map/GeoMap";
import { PlayerPanel } from "./ui/game/PlayerPanel";
import { CardOffer } from "./ui/game/CardOffer";
import { GameSidebar } from "./ui/game/GameSidebar";
import { gameStore } from "./store/gameStore";
import { GameEndView } from "./ui/game/GameEndView";
import { MainMenu } from "./ui/menu/MainMenu";
import { WelcomeScreen } from "./ui/menu/WelcomeScreen";
import { Show } from "solid-js";

function App() {
    return (
        <div class="main">
            <Show when={gameStore.phase === 'MENU'}>
                <WelcomeScreen />
            </Show>
            <Show when={gameStore.phase === 'SETUP'}>
                <MainMenu />
            </Show>

            {/* Game Phase */}
            <Show when={gameStore.phase !== 'MENU' && gameStore.phase !== 'SETUP'}>
                {/* Sidebar on the Left */}
                <GameSidebar />
                <GeoMap />

                {/* UI Overlay Layer */}
                <CardOffer />
                <PlayerPanel />
                <Show when={gameStore.phase === 'GAME_END'}>
                    <GameEndView />
                </Show>
            </Show>
        </div>
    );
}

export default App;
