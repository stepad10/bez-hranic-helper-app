import { createSignal, createMemo, Show, For } from "solid-js";
import { gameStore, dispatch } from "../../store/gameStore";

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
        <div
            class="game-sidebar"
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                bottom: 0,
                width: "250px",
                background: "rgba(255, 255, 255, 0.95)",
                "box-shadow": "2px 0 8px rgba(0,0,0,0.1)",
                padding: "1.5rem",
                display: "flex",
                "flex-direction": "column",
                "z-index": 90, // Below top overlays but above map
                "overflow-y": "hidden",
            }}
        >
            {/* Header with Back Button */}
            <div style={{ display: "flex", "align-items": "center", "margin-bottom": "1rem" }}>
                <button
                    onClick={() => window.location.reload()}
                    title="Restart Game"
                    style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        "font-size": "1.2rem",
                        "margin-right": "0.5rem",
                        color: "#666",
                        padding: "0 0.25rem",
                    }}
                >
                    ✕
                </button>
                <h1 style={{ "font-size": "1.5rem", margin: 0, color: "#f59e0b", flex: 1 }}>Without Borders</h1>
            </div>

            {/* Phase Info */}
            <div style={{ "margin-bottom": "2rem" }}>
                <div style={{ "text-transform": "uppercase", "font-size": "0.75rem", color: "#666", "letter-spacing": "1px" }}>Round {gameStore.round}</div>
                <h2 style={{ "font-size": "1.1rem", margin: "0.25rem 0" }}>{gameStore.phase.replace("_", " ")}</h2>
                <p style={{ "line-height": "1.5", "font-size": "0.95rem", color: "#333" }}>{instructions()}</p>

                <Show when={gameStore.phase === "DEALING"}>
                    <button
                        onClick={() => dispatch({ type: "DEAL_ROUND", payload: { round: gameStore.round } })}
                        style={{
                            "margin-top": "1rem",
                            padding: "0.5rem 1rem",
                            background: "#3b82f6",
                            color: "white",
                            border: "none",
                            "border-radius": "4px",
                            cursor: "pointer",
                            display: "block",
                            width: "100%",
                        }}
                    >
                        Deal Round
                    </button>
                </Show>

                <Show when={gameStore.phase === "TRAVEL_PLANNING"}>
                    <button
                        onClick={() => dispatch({ type: "RESOLVE_ROUND" })}
                        disabled={!canResolve()}
                        style={{
                            "margin-top": "1rem",
                            padding: "0.5rem 1rem",
                            background: canResolve() ? "#22c55e" : "#9ca3af",
                            color: "white",
                            border: "none",
                            "border-radius": "4px",
                            cursor: canResolve() ? "pointer" : "not-allowed",
                            display: "block",
                            width: "100%",
                        }}
                    >
                        Finish Round & Evaluate
                    </button>
                </Show>

                <Show when={gameStore.phase === "ROUND_END"}>
                    <button
                        onClick={() => dispatch({ type: "DEAL_ROUND", payload: { round: gameStore.round + 1 } })}
                        style={{
                            "margin-top": "1rem",
                            padding: "0.5rem 1rem",
                            background: "#eab308",
                            color: "white",
                            border: "none",
                            "border-radius": "4px",
                            cursor: "pointer",
                            display: "block",
                            width: "100%",
                            "margin-bottom": "1rem",
                        }}
                    >
                        Next Round
                    </button>
                </Show>
            </div>

            {/* Score History Log - Scrollable Area */}
            <div style={{ flex: 1, "overflow-y": "auto", "min-height": 0, "margin-bottom": "1rem", "border-top": "1px solid #eee" }}>
                <HistoryLog />
            </div>

            {/* Legend */}
            <div style={{ "margin-top": "auto", "border-top": "1px solid #eee" }}>
                <button
                    onClick={() => setIsLegendOpen(!isLegendOpen())}
                    style={{
                        width: "100%",
                        background: "none",
                        border: "none",
                        padding: "0.5rem 0",
                        display: "flex",
                        "justify-content": "space-between",
                        "align-items": "center",
                        cursor: "pointer",
                        color: "#666",
                        "font-size": "0.9rem",
                        "font-weight": "bold",
                    }}
                >
                    <span>Map Legend</span>
                    <span>{isLegendOpen() ? "▼" : "▲"}</span>
                </button>

                <Show when={isLegendOpen()}>
                    <ul style={{ "list-style": "none", padding: "0 0 1rem 0", margin: 0, display: "flex", "flex-direction": "column", gap: "0.75rem" }}>
                        <LegendItem color="#22c55e" label="Starting Country" />
                        <LegendItem color="#ef4444" label="Destination Country" />
                        <LegendItem color="#fef08a" border="#eab308" label="Offer (Available)" />
                        <LegendItem color="#d6d6d6" border="#7d7d7d" label="Ordinary Country" />
                        <LegendItem color="#3b82f6" type="circle" label="Player Token" />
                    </ul>
                </Show>
            </div>
        </div>
    );
}

function LegendItem(_props: { color: string; border?: string; label: string; type?: "box" | "circle" }) {
    // Props default
    const type = () => _props.type || "box";
    return (
        <li style={{ display: "flex", "align-items": "center", gap: "0.5rem", "font-size": "0.75rem" }}>
            <div
                style={{
                    width: "12px",
                    height: "12px",
                    background: _props.color,
                    border: _props.border ? `2px solid ${_props.border}` : "none",
                    "border-radius": type() === "circle" ? "50%" : "2px",
                }}
            />
            <span>{_props.label}</span>
        </li>
    );
}

function HistoryLog() {
    const history = createMemo(() => gameStore.roundHistory);

    // Show latest first
    const reversedHistory = createMemo(() => [...history()].reverse());

    return (
        <Show when={reversedHistory().length > 0}>
            <div style={{ "padding-top": "1rem" }}>
                <h3 style={{ "font-size": "1rem", margin: "0 0 1rem 0", color: "#666" }}>Round History</h3>
                <div style={{ display: "flex", "flex-direction": "column", gap: "1.5rem" }}>
                    <For each={reversedHistory()}>
                        {(summary) => (
                            <div style={{ "font-size": "0.85rem" }}>
                                <div style={{ "font-weight": "bold", "margin-bottom": "0.5rem", color: "#888" }}>Round {summary.round}</div>
                                <div style={{ display: "flex", "flex-direction": "column", gap: "0.5rem" }}>
                                    <For each={Object.keys(summary.players)}>
                                        {(pid) => {
                                            const pVal = summary.players[pid];
                                            const pName = gameStore.players[pid]?.name || pid;
                                            const pColor = gameStore.players[pid]?.color || "#333";
                                            const path = pVal.path;

                                            const isHighlighted = () => gameStore.highlightedPlayerId === pid;

                                            return (
                                                <div
                                                    // onMouseEnter ... dispatch?
                                                    style={{
                                                        "border-left": `3px solid ${pColor}`,
                                                        "padding-left": "0.5rem",
                                                        "padding-right": "0.5rem",
                                                        "padding-top": "0.25rem",
                                                        "padding-bottom": "0.25rem",
                                                        cursor: "pointer",
                                                        background: isHighlighted() ? "rgba(0,0,0,0.05)" : "transparent",
                                                        transition: "background 0.2s",
                                                        "border-radius": "0 4px 4px 0",
                                                    }}
                                                >
                                                    <div style={{ "font-weight": "bold" }}>{pName}</div>

                                                    {/* Path Visualization */}
                                                    <Show when={path && path.length > 0}>
                                                        <div style={{ "font-size": "0.8rem", color: "#666", margin: "0.25rem 0", "font-family": "monospace" }}>
                                                            <For each={path}>
                                                                {(cid, i) => (
                                                                    <span>
                                                                        {cid}
                                                                        <Show when={i() < path!.length - 1}>
                                                                            <span style={{ color: "#aaa", margin: "0 4px" }}>-(10)→</span>
                                                                        </Show>
                                                                    </span>
                                                                )}
                                                            </For>
                                                        </div>
                                                    </Show>

                                                    <div style={{ display: "grid", "grid-template-columns": "1fr auto", gap: "0.25rem", color: "#555" }}>
                                                        <Show when={pVal.journeyCost > 0}>
                                                            <span>Travel Total: -{pVal.journeyCost}€</span>
                                                        </Show>
                                                        <Show when={pVal.space40Cost > 0}>
                                                            <span>Space 40: -{pVal.space40Cost}€</span>
                                                        </Show>
                                                        <Show when={pVal.stackingPenalty > 0}>
                                                            <span>Stacking: -{pVal.stackingPenalty}€</span>
                                                        </Show>
                                                        <Show
                                                            when={pVal.totalEarnings !== undefined}
                                                            fallback={
                                                                <>
                                                                    <span style={{ "font-weight": "bold" }}>Total Cost:</span>{" "}
                                                                    <span style={{ color: "#ef4444", "font-weight": "bold" }}>-{pVal.totalCost}€</span>
                                                                </>
                                                            }
                                                        >
                                                            <>
                                                                <span style={{ "font-weight": "bold" }}>Total Earned:</span>{" "}
                                                                <span style={{ color: "#10b981", "font-weight": "bold" }}>+{pVal.totalEarnings}€</span>
                                                            </>
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
            </div>
        </Show>
    );
}
