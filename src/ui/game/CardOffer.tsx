import { gameStore, dispatch } from "../../store/gameStore";
import { EUROPE_GRAPH } from "../../data/europeGraph";
import { createMemo, For, Show } from "solid-js";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function CardOffer() {
    // Helpers to get name from ID
    const getName = (id: string | null) => (id ? EUROPE_GRAPH[id]?.name || id : "");

    const offerItems = createMemo(() => [...gameStore.offer, "SPACE_40"]);

    return (
        <div class="absolute left-1/2 top-5 z-40 flex -translate-x-1/2 flex-col items-center gap-4 pointer-events-none">
            {/* Start / Destination Center Cards */}
            <div class="flex gap-8 pointer-events-auto">
                <Show when={gameStore.startingCountry}>
                    <Card class="border-2 border-green-500 bg-white shadow-md">
                        <CardContent class="p-3 text-center">
                            <div class="text-[0.65rem] uppercase tracking-wider text-muted-foreground">Start</div>
                            <div class="text-lg font-bold text-green-700 leading-tight">{getName(gameStore.startingCountry)}</div>
                        </CardContent>
                    </Card>
                </Show>

                <Show when={gameStore.destinationCountry}>
                    <Card class="border-2 border-red-500 bg-white shadow-md">
                        <CardContent class="p-3 text-center">
                            <div class="text-[0.65rem] uppercase tracking-wider text-muted-foreground">Destination</div>
                            <div class="text-lg font-bold text-red-700 leading-tight">{getName(gameStore.destinationCountry)}</div>
                        </CardContent>
                    </Card>
                </Show>
            </div>

            {/* Offer Bar */}
            <Show when={gameStore.offer.length > 0}>
                <div class="flex gap-2 rounded-xl bg-white/90 p-2 shadow-sm backdrop-blur-sm pointer-events-auto border border-white/20">
                    <For each={offerItems()}>
                        {(countryId) => {
                            const isSpace40 = countryId === "SPACE_40";
                            // Reactive checking of selection
                            const isSelected = () =>
                                gameStore.activePlayerId && (gameStore.currentSelections[gameStore.activePlayerId] || []).includes(countryId);

                            // Find all players who selected this
                            const selectingPlayers = createMemo(() =>
                                Object.keys(gameStore.currentSelections)
                                    .filter((pid) => gameStore.currentSelections[pid]?.includes(countryId))
                                    .map((pid) => gameStore.players[pid]),
                            );

                            const handleCardClick = () => {
                                if (gameStore.activePlayerId && gameStore.phase === "TRAVEL_PLANNING") {
                                    dispatch({ type: "PLACE_TOKEN", payload: { playerId: gameStore.activePlayerId, countryId } });
                                }
                            };

                            const isClickable = () => gameStore.activePlayerId && gameStore.phase === "TRAVEL_PLANNING";

                            return (
                                <Card
                                    onClick={handleCardClick}
                                    class={cn(
                                        "flex min-w-[6rem] cursor-pointer flex-col items-center justify-between transition-all hover:scale-105 active:scale-95",
                                        isSelected()
                                            ? "border-2 border-blue-500 bg-blue-50 shadow-md"
                                            : "border border-slate-200 bg-white hover:border-slate-300",
                                        !isClickable() && "cursor-default hover:scale-100 hover:border-slate-200",
                                    )}
                                >
                                    <CardContent class="flex flex-col items-center gap-1 p-2">
                                        <div class={cn("font-bold text-sm", isSelected() ? "text-blue-700" : "text-slate-700")}>
                                            {isSpace40 ? "Space 40" : getName(countryId)}
                                        </div>
                                        <Show when={isSpace40}>
                                            <div class="text-[0.6rem] text-muted-foreground">Pass (-40€)</div>
                                        </Show>

                                        {/* Player Tokens */}
                                        <div class="mt-1 flex flex-wrap justify-center gap-1">
                                            <For each={selectingPlayers()}>
                                                {(p) => (
                                                    <div
                                                        class="h-3 w-3 rounded-full border border-white shadow-sm ring-1 ring-black/5"
                                                        style={{ background: p.color }}
                                                        title={p.name}
                                                    />
                                                )}
                                            </For>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        }}
                    </For>
                </div>
            </Show>
        </div>
    );
}
