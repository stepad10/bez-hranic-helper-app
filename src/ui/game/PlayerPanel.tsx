import { gameStore, dispatch } from "../../store/gameStore";
import { For, Show, createMemo } from "solid-js";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function PlayerPanel() {
    const playerIds = createMemo(() => Object.keys(gameStore.players));

    return (
        <Show when={playerIds().length > 0}>
            <div class="absolute bottom-5 left-5 right-5 z-40 flex justify-center gap-4 pointer-events-none">
                <For each={playerIds()}>
                    {(id) => {
                        const p = () => gameStore.players[id];
                        const isActive = () => id === gameStore.activePlayerId;
                        const selectionCount = () => (gameStore.currentSelections[id] || []).length;
                        const isReady = () => selectionCount() === (gameStore.round <= 2 ? 1 : 2);

                        return (
                            <Card
                                onClick={() => dispatch({ type: "SET_ACTIVE_PLAYER", payload: id })}
                                class={cn(
                                    "min-w-[9rem] cursor-pointer overflow-hidden border-2 transition-all duration-200 pointer-events-auto hover:-translate-y-1 hover:shadow-lg",
                                    isActive()
                                        ? "translate-y-[-0.5rem] border-primary bg-background shadow-xl scale-105 ring-2 ring-primary/20 ring-offset-2"
                                        : "translate-y-0 border-white/50 bg-white/90 text-muted-foreground shadow-sm hover:bg-white",
                                )}
                                style={{
                                    "border-top-color": p().color, // Keep the colored top border identity
                                    "border-top-width": "4px",
                                }}
                            >
                                <CardContent class="p-3">
                                    <div class={cn("font-bold text-sm truncate", isActive() ? "text-foreground" : "text-muted-foreground")}>{p().name}</div>
                                    <div class="mt-1 text-lg font-black text-emerald-600">{p().money} €</div>
                                    <div class="mt-1 flex items-center justify-between text-[0.7rem] text-muted-foreground font-medium uppercase tracking-wide">
                                        <span>Tokens: {p().tokens.remaining}</span>
                                        <Show when={isReady()}>
                                            <span class="ml-2 font-bold text-emerald-600 animate-pulse">✓ Ready</span>
                                        </Show>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    }}
                </For>
            </div>
        </Show>
    );
}
