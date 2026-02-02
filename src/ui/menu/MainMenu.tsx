import { createSignal, For, JSX } from "solid-js";
import { gameStore, dispatch } from "../../store/gameStore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch, SwitchControl, SwitchThumb } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export function MainMenu() {
    const [playerCount, setPlayerCount] = createSignal<number>(2);
    const [activeDescription, setActiveDescription] = createSignal<string | null>(null);

    const toggleTravelCosts = () => {
        dispatch({
            type: "UPDATE_SETTINGS",
            payload: { showTravelCosts: !gameStore.settings.showTravelCosts },
        });
    };

    const updateMapStyle = (style: "blank" | "codes") => {
        dispatch({ type: "UPDATE_SETTINGS", payload: { mapStyle: style } });
    };

    const handleStart = () => {
        const pIds = Array.from({ length: playerCount() }, (_, i) => `p${i + 1}`);
        dispatch({ type: "START_GAME", payload: { playerIds: pIds } });
    };

    const SettingRow = (props: { label: string; description: string; children: JSX.Element }) => (
        <div
            class="flex items-center justify-between rounded-md bg-white/5 p-3 transition-colors hover:bg-white/10"
            onMouseEnter={() => setActiveDescription(props.description)}
            onMouseLeave={() => setActiveDescription(null)}
        >
            <span class="font-medium text-slate-200">{props.label}</span>
            {props.children}
        </div>
    );

    return (
        <div class="flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950 p-6 text-slate-100">
            <h1 class="mb-8 text-5xl font-extrabold tracking-tight text-white drop-shadow-md">Without Borders</h1>

            <Card class="w-full max-w-2xl border-white/10 bg-white/10 shadow-2xl backdrop-blur-md">
                <CardHeader>
                    <CardTitle class="text-2xl text-slate-100">Game Setup</CardTitle>
                    <CardDescription class="text-slate-400">Configure the rules and players for your journey.</CardDescription>
                </CardHeader>
                <CardContent class="grid gap-6">
                    {/* Player Count */}
                    <div class="space-y-3">
                        <label class="text-sm font-semibold uppercase tracking-wider text-slate-400">Number of Players</label>
                        <div class="grid grid-cols-3 gap-3">
                            <For each={[2, 3, 4]}>
                                {(count) => (
                                    <Button
                                        variant={playerCount() === count ? "default" : "outline"}
                                        class={cn(
                                            "h-14 text-lg transition-all",
                                            playerCount() === count
                                                ? "bg-blue-600 hover:bg-blue-500 border-transparent shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                                                : "border-white/20 bg-transparent text-slate-300 hover:bg-white/10 hover:text-white",
                                        )}
                                        onClick={() => setPlayerCount(count)}
                                    >
                                        {count} Players
                                    </Button>
                                )}
                            </For>
                        </div>
                    </div>

                    <div class="h-px w-full bg-white/10" />

                    {/* Settings Section */}
                    <div class="space-y-4">
                        <h3 class="text-xs font-bold uppercase tracking-widest text-slate-500">Settings</h3>

                        {/* Travel Costs Toggle */}
                        <SettingRow label="Show Travel Costs" description="Display the cost of moving between countries on the map lines.">
                            <Switch checked={gameStore.settings.showTravelCosts} onChange={toggleTravelCosts}>
                                <SwitchControl>
                                    <SwitchThumb />
                                </SwitchControl>
                            </Switch>
                        </SettingRow>

                        {/* Map Style Selector */}
                        <SettingRow label="Map Labels" description="Choose 'Blank' for a cleaner look or 'Codes' to see country abbreviations.">
                            <div class="flex gap-1 rounded-lg bg-black/20 p-1">
                                <For each={["blank", "codes"] as const}>
                                    {(style) => (
                                        <button
                                            onClick={() => updateMapStyle(style)}
                                            class={cn(
                                                "rounded-md px-3 py-1.5 text-sm font-medium transition-all",
                                                gameStore.settings.mapStyle === style ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-white",
                                            )}
                                        >
                                            {style === "blank" ? "Blank" : "Codes"}
                                        </button>
                                    )}
                                </For>
                            </div>
                        </SettingRow>

                        {/* Stacking Rule */}
                        <SettingRow
                            label="Stacking Penalty"
                            description={
                                gameStore.settings.stackingRule === "ordered"
                                    ? "Standard Rule: The first player on a country is safe. Anyone arriving later pays -10."
                                    : "Addon Rule: No penalties for stacking. Good for casual Pass 'n Play."
                            }
                        >
                            <div class="flex gap-1 rounded-lg bg-black/20 p-1">
                                <button
                                    onClick={() => dispatch({ type: "UPDATE_SETTINGS", payload: { stackingRule: "ordered" } })}
                                    class={cn(
                                        "rounded-md px-3 py-1.5 text-sm font-medium transition-all",
                                        gameStore.settings.stackingRule === "ordered" ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-white",
                                    )}
                                >
                                    Standard
                                </button>
                                <button
                                    onClick={() => dispatch({ type: "UPDATE_SETTINGS", payload: { stackingRule: "none" } })}
                                    class={cn(
                                        "rounded-md px-3 py-1.5 text-sm font-medium transition-all",
                                        gameStore.settings.stackingRule === "none" ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-white",
                                    )}
                                >
                                    None
                                </button>
                            </div>
                        </SettingRow>
                    </div>

                    {/* Description Box */}
                    <div class="flex min-h-[3rem] items-center justify-center border-t border-white/10 pt-4 text-center text-sm italic text-slate-400">
                        {activeDescription() || "Hover over settings to see more details."}
                    </div>
                </CardContent>
                <CardFooter class="pb-8 pt-2">
                    <Button
                        class="h-16 w-full text-xl font-bold tracking-wide shadow-lg hover:shadow-green-500/20"
                        size="lg"
                        onClick={handleStart}
                        variant="default" // primary
                        style={{ "background-color": "#22c55e" }} // Keeping the green accent or use 'default' variant logic
                    >
                        Start Journey
                    </Button>
                </CardFooter>
            </Card>

            <p class="mt-8 text-slate-500">Plan your journey across Europe</p>
        </div>
    );
}
