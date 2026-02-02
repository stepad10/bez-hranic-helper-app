import { createSignal, createMemo, Show, For } from "solid-js";
import { gameStore, dispatch } from "../../store/gameStore";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { X, ChevronUp, ChevronDown } from "lucide-solid";

export function GameSidebar() {
    const [isLegendOpen, setIsLegendOpen] = createSignal(false);

    // Dynamic Instructions based on Phase & Round
    const instructions = createMemo(() => {
        const p = gameStore.phase;
        const r = gameStore.round;
        switch (p) {
            case "DEALING":
                return "Click 'Deal Round' to reveal the starting country and the offer.";
            case "TRAVEL_PLANNING":
                if (r <= 2) {
                    return "Select ONE country from the yellow offer. Try to minimize border crossings from the Green starting country. avoid direct neighbors (+30€)!";
                }
                if (r <= 4) {
                    return "Select TWO different countries. Plan a route: Start -> Choice 1 -> Choice 2. Minimize total borders and avoid neighbors.";
                }
                return "Select TWO countries. Plan a route: Start -> Choice 1 -> Choice 2 -> Destination (Red). Pass through both chosen countries.";
            case "ROUND_END":
                return "Round complete! Review the journey costs and click 'Next Round' to continue.";
            case "GAME_END":
                return "Game Over! Check the winner.";
            default:
                return "Welcome to Without Borders!";
        }
    });

    const canResolve = createMemo(() => {
        const requiredSelections = gameStore.round <= 2 ? 1 : 2;
        const pIds = Object.keys(gameStore.players);
        return (
            pIds.length > 0 &&
            pIds.every((pid) => {
                const playerSelections = gameStore.currentSelections[pid] || [];
                return playerSelections.length === requiredSelections;
            })
        );
    });

    return (
        <aside class="fixed bottom-0 left-0 top-0 flex w-[300px] flex-col overflow-hidden border-r bg-background/95 shadow-xl backdrop-blur-sm transition-all z-50">
            {/* Header with Back Button */}
            <div class="flex items-center justify-between border-b p-4">
                <Button variant="ghost" size="icon" onClick={() => window.location.reload()} title="Restart Game">
                    <X class="h-5 w-5" />
                    <span class="sr-only">Restart</span>
                </Button>
                <h1 class="text-xl font-bold text-primary">Without Borders</h1>
            </div>

            {/* Content Container */}
            <div class="flex flex-1 flex-col overflow-y-auto p-4">
                {/* Phase Info */}
                <div class="mb-6 space-y-2">
                    <div class="text-xs font-bold uppercase tracking-wider text-muted-foreground">Round {gameStore.round}</div>
                    <h2 class="text-lg font-semibold capitalize text-foreground">{gameStore.phase.replace("_", " ").toLowerCase()}</h2>
                    <p class="text-sm leading-relaxed text-muted-foreground">{instructions()}</p>

                    <div class="pt-2">
                        <Show when={gameStore.phase === "DEALING"}>
                            <Button class="w-full" onClick={() => dispatch({ type: "DEAL_ROUND", payload: { round: gameStore.round } })}>
                                Deal Round
                            </Button>
                        </Show>

                        <Show when={gameStore.phase === "TRAVEL_PLANNING"}>
                            <Button
                                class="w-full"
                                onClick={() => dispatch({ type: "RESOLVE_ROUND" })}
                                disabled={!canResolve()}
                                variant={canResolve() ? "default" : "secondary"}
                            >
                                Finish Round & Evaluate
                            </Button>
                        </Show>

                        <Show when={gameStore.phase === "ROUND_END"}>
                            <Button
                                class="w-full bg-amber-500 hover:bg-amber-600"
                                onClick={() => dispatch({ type: "DEAL_ROUND", payload: { round: gameStore.round + 1 } })}
                            >
                                Next Round
                            </Button>
                        </Show>
                    </div>
                </div>

                {/* Score History Log */}
                <div class="flex-1 border-t pt-4">
                    <HistoryLog />
                </div>
            </div>

            {/* Legend Footer */}
            <div class="border-t bg-muted/30">
                <button
                    onClick={() => setIsLegendOpen(!isLegendOpen())}
                    class="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                >
                    <span>Map Legend</span>
                    {isLegendOpen() ? <ChevronDown class="h-4 w-4" /> : <ChevronUp class="h-4 w-4" />}
                </button>

                <Show when={isLegendOpen()}>
                    <ul class="space-y-2 px-4 pb-4 pt-1">
                        <LegendItem color="bg-green-500" label="Starting Country" />
                        <LegendItem color="bg-red-500" label="Destination Country" />
                        <LegendItem color="bg-yellow-200" border="border-yellow-500" label="Offer (Available)" />
                        <LegendItem color="bg-gray-300" border="border-gray-500" label="Ordinary Country" />
                        <LegendItem color="bg-blue-500" type="circle" label="Player Token" />
                    </ul>
                </Show>
            </div>
        </aside>
    );
}

function LegendItem(_props: { color: string; border?: string; label: string; type?: "box" | "circle" }) {
    const type = () => _props.type || "box";
    return (
        <li class="flex items-center gap-2 text-xs text-secondary-foreground">
            <div
                class={cn(
                    "h-3 w-3 shadow-sm",
                    _props.color,
                    _props.border ? `border-2 ${_props.border.replace("border-", "border-")}` : "", // Tailwind class merge quirk, relying on 'border-color' usage
                    // Actually _props.border is passed like "border-yellow-500", so we just need to append it if it's a class.
                    // But wait, the original passed a color hex string. Now I switched to classes.
                    // Let's assume _props.color is a class like "bg-red-500" and border is "border-red-600".
                    _props.border,
                    type() === "circle" ? "rounded-full" : "rounded-sm",
                )}
            />
            <span>{_props.label}</span>
        </li>
    );
}

function HistoryLog() {
    const history = createMemo(() => gameStore.roundHistory);
    const reversedHistory = createMemo(() => [...history()].reverse());

    return (
        <Show when={reversedHistory().length > 0}>
            <h3 class="mb-3 text-sm font-semibold text-muted-foreground">Round History</h3>
            <div class="space-y-4 pr-1">
                <For each={reversedHistory()}>
                    {(summary) => (
                        <div class="text-xs">
                            <div class="mb-1 font-bold text-muted-foreground/80">Round {summary.round}</div>
                            <div class="space-y-2">
                                <For each={Object.keys(summary.players)}>
                                    {(pid) => {
                                        const pVal = summary.players[pid];
                                        const pName = gameStore.players[pid]?.name || pid;
                                        const pColor = gameStore.players[pid]?.color || "#333";
                                        const path = pVal.path;
                                        const isHighlighted = () => gameStore.highlightedPlayerId === pid;

                                        return (
                                            <div
                                                class={cn(
                                                    "border-l-4 py-1 pl-2 pr-2 transition-colors hover:bg-muted/50 rounded-r-md",
                                                    isHighlighted() ? "bg-muted" : "bg-transparent",
                                                )}
                                                style={{ "border-color": pColor }}
                                            >
                                                <div class="font-medium text-foreground">{pName}</div>
                                                <Show when={path && path.length > 0}>
                                                    <div class="my-1 font-mono text-[10px] text-muted-foreground">
                                                        <For each={path}>
                                                            {(cid, i) => (
                                                                <span>
                                                                    {cid}
                                                                    <Show when={i() < path!.length - 1}>
                                                                        <span class="mx-1 text-muted-foreground/50">→</span>
                                                                    </Show>
                                                                </span>
                                                            )}
                                                        </For>
                                                    </div>
                                                </Show>

                                                <div class="text-muted-foreground">
                                                    <Show when={pVal.journeyCost > 0}>
                                                        <div>Travel: -{pVal.journeyCost}€</div>
                                                    </Show>
                                                    <Show when={pVal.space40Cost > 0}>
                                                        <div>Space 40: -{pVal.space40Cost}€</div>
                                                    </Show>
                                                    <Show when={pVal.stackingPenalty > 0}>
                                                        <div>Stacking: -{pVal.stackingPenalty}€</div>
                                                    </Show>
                                                    <Show
                                                        when={pVal.totalEarnings !== undefined}
                                                        fallback={
                                                            <div>
                                                                <span class="font-semibold">Cost: </span>
                                                                <span class="font-bold text-destructive">-{pVal.totalCost}€</span>
                                                            </div>
                                                        }
                                                    >
                                                        <div>
                                                            <span class="font-semibold">Earned:</span>
                                                            <span class="font-bold text-green-600">+{pVal.totalEarnings}€</span>
                                                        </div>
                                                    </Show>
                                                </div>
                                            </div>
                                        );
                                    }}
                                </For>
                            </div>
                        </div>
                    )}
                </For>
            </div>
        </Show>
    );
}
