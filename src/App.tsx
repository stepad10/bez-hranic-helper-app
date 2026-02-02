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
    const showGameUI = () => gameStore.phase !== "MENU" && gameStore.phase !== "SETUP";

    return (
        <div class="relative min-h-screen w-full overflow-hidden bg-background text-foreground">
            <Show when={gameStore.phase === "MENU"}>
                <WelcomeScreen />
            </Show>
            <Show when={gameStore.phase === "SETUP"}>
                <MainMenu />
            </Show>

            {/* Game Phase */}
            <Show when={showGameUI()}>
                <GameSidebar />

                {/* Main Content Area - Shifted by Sidebar Width */}
                <main class="relative h-screen w-full pl-[300px]">
                    <GeoMap />

                    {/* UI Overlay Layer - Pass events through where needed */}
                    <div class="pointer-events-none absolute inset-0 z-40">
                        {/* Re-enable pointer events for interactive UI elements */}
                        <div class="pointer-events-auto">
                            <CardOffer />
                            <PlayerPanel />
                        </div>
                    </div>

                    <Show when={gameStore.phase === "GAME_END"}>
                        <GameEndView />
                    </Show>
                </main>
            </Show>
        </div>
    );
}

export default App;
