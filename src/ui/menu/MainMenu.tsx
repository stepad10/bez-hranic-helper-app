import { createSignal, For, JSX } from "solid-js";
import { gameStore, dispatch } from "../../store/gameStore";

export function MainMenu() {
    const [playerCount, setPlayerCount] = createSignal<number>(2);
    const [activeDescription, setActiveDescription] = createSignal<string | null>(null);

    const toggleTravelCosts = () => {
        dispatch({ type: "UPDATE_SETTINGS", payload: { showTravelCosts: !gameStore.settings.showTravelCosts } });
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
            style={{
                display: "flex",
                "align-items": "center",
                "justify-content": "space-between",
                "font-size": "1rem",
                padding: "0.75rem 1rem",
                background: "rgba(255,255,255,0.03)",
                "border-radius": "8px",
                transition: "background 0.2s",
                cursor: "default",
            }}
            onMouseEnter={() => setActiveDescription(props.description)}
            onMouseLeave={() => setActiveDescription(null)}
        >
            <span style={{ "font-weight": 500 }}>{props.label}</span>
            {props.children}
        </div>
    );

    return (
        <div
            style={{
                background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
                display: "flex",
                "flex-direction": "column",
                "align-items": "center",
                "justify-content": "center",
                color: "white",
                width: "100%",
                "z-index": 1000,
            }}
        >
            <h1 style={{ "font-size": "4rem", "margin-bottom": "2rem", "text-shadow": "0 4px 6px rgba(0,0,0,0.3)" }}>Without Borders</h1>

            <div
                style={{
                    background: "rgba(255, 255, 255, 0.1)",
                    "backdrop-filter": "blur(10px)",
                    padding: "2.5rem",
                    "border-radius": "16px",
                    display: "flex",
                    "flex-direction": "column",
                    gap: "2rem",
                    width: "600px", // Fixed width to prevent growing
                    "box-shadow": "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                }}
            >
                <div style={{ display: "flex", "flex-direction": "column", gap: "0.75rem" }}>
                    <div style={{ display: "flex", "align-items": "center" }}>
                        <label style={{ "font-size": "1.2rem", "font-weight": "bold", color: "#e2e8f0" }}>Number of Players</label>
                    </div>

                    <div style={{ display: "flex", gap: "0.75rem" }}>
                        <For each={[2, 3, 4]}>
                            {(count) => (
                                <button
                                    onClick={() => setPlayerCount(count)}
                                    style={{
                                        flex: 1,
                                        padding: "1.25rem",
                                        "border-radius": "12px",
                                        border: "none",
                                        background: playerCount() === count ? "#3b82f6" : "rgba(255,255,255,0.1)",
                                        color: "white",
                                        cursor: "pointer",
                                        "font-size": "1.25rem",
                                        "font-weight": "bold",
                                        transition: "all 0.2s",
                                        transform: playerCount() === count ? "scale(1.05)" : "scale(1)",
                                        "box-shadow": playerCount() === count ? "0 4px 12px rgba(59, 130, 246, 0.4)" : "none",
                                    }}
                                >
                                    {count} Players
                                </button>
                            )}
                        </For>
                    </div>
                </div>

                <div style={{ height: "1px", background: "rgba(255,255,255,0.1)", margin: "0 0" }} />

                {/* Settings Section */}
                <div style={{ display: "flex", "flex-direction": "column", gap: "0.5rem" }}>
                    <h3 style={{ margin: "0 0 0.5rem 0", "font-size": "1rem", color: "#cbd5e1", "text-transform": "uppercase", "letter-spacing": "0.05em" }}>
                        Game Settings
                    </h3>

                    {/* Travel Costs Toggle */}
                    <SettingRow label="Show Travel Costs" description="Display the cost of moving between countries on the map lines.">
                        <div
                            onClick={toggleTravelCosts}
                            style={{
                                width: "48px",
                                height: "26px",
                                background: gameStore.settings.showTravelCosts ? "#22c55e" : "#475569",
                                "border-radius": "99px",
                                position: "relative",
                                cursor: "pointer",
                                transition: "background 0.2s",
                            }}
                        >
                            <div
                                style={{
                                    width: "22px",
                                    height: "22px",
                                    background: "white",
                                    "border-radius": "50%",
                                    position: "absolute",
                                    top: "2px",
                                    left: gameStore.settings.showTravelCosts ? "24px" : "2px",
                                    transition: "left 0.2s",
                                    "box-shadow": "0 2px 4px rgba(0,0,0,0.2)",
                                }}
                            />
                        </div>
                    </SettingRow>

                    {/* Map Selection */}
                    <SettingRow label="Map Region" description="Select the region to play on. Currently only Europe is available.">
                        <div style={{ display: "flex", gap: "0.25rem", background: "rgba(0,0,0,0.2)", padding: "4px", "border-radius": "8px" }}>
                            <button
                                style={{
                                    background: "white",
                                    color: "#0f172a",
                                    border: "none",
                                    "border-radius": "6px",
                                    padding: "0.4rem 1rem",
                                    "font-size": "0.9rem",
                                    cursor: "default",
                                    "font-weight": "bold",
                                }}
                            >
                                Europe
                            </button>
                        </div>
                    </SettingRow>

                    {/* Map Style Selector */}
                    <SettingRow label="Map Labels" description="Choose 'Blank' for a cleaner look or 'Codes' to see country abbreviations (e.g. AUT, CZE).">
                        <div style={{ display: "flex", gap: "0.25rem", background: "rgba(0,0,0,0.2)", padding: "4px", "border-radius": "8px" }}>
                            <For each={["blank", "codes"] as const}>
                                {(style) => (
                                    <button
                                        onClick={() => updateMapStyle(style)}
                                        style={{
                                            background: gameStore.settings.mapStyle === style ? "white" : "transparent",
                                            color: gameStore.settings.mapStyle === style ? "#0f172a" : "#94a3b8",
                                            border: "none",
                                            "border-radius": "6px",
                                            padding: "0.4rem 1rem",
                                            "font-size": "0.9rem",
                                            cursor: "pointer",
                                            "font-weight": gameStore.settings.mapStyle === style ? "bold" : "normal",
                                            transition: "all 0.2s",
                                        }}
                                    >
                                        {style === "blank" ? "Blank" : "Codes"}
                                    </button>
                                )}
                            </For>
                        </div>
                    </SettingRow>

                    {/* Stacking Rule (Addon) */}
                    <SettingRow
                        label="Stacking Penalty"
                        description={
                            gameStore.settings.stackingRule === "ordered"
                                ? "Standard Rule: The first player on a country is safe. Anyone arriving later pays -10."
                                : "Addon Rule: No penalties for stacking. Good for casual Pass 'n Play."
                        }
                    >
                        <div style={{ display: "flex", gap: "0.25rem", background: "rgba(0,0,0,0.2)", padding: "4px", "border-radius": "8px" }}>
                            <button
                                onClick={() => dispatch({ type: "UPDATE_SETTINGS", payload: { stackingRule: "ordered" } })}
                                style={{
                                    background: gameStore.settings.stackingRule === "ordered" ? "white" : "transparent",
                                    color: gameStore.settings.stackingRule === "ordered" ? "#0f172a" : "#94a3b8",
                                    border: "none",
                                    "border-radius": "6px",
                                    padding: "0.4rem 1rem",
                                    "font-size": "0.9rem",
                                    cursor: "pointer",
                                    "font-weight": gameStore.settings.stackingRule === "ordered" ? "bold" : "normal",
                                    transition: "all 0.2s",
                                }}
                            >
                                Standard
                            </button>
                            <button
                                onClick={() => dispatch({ type: "UPDATE_SETTINGS", payload: { stackingRule: "none" } })}
                                style={{
                                    background: gameStore.settings.stackingRule === "none" ? "white" : "transparent",
                                    color: gameStore.settings.stackingRule === "none" ? "#0f172a" : "#94a3b8",
                                    border: "none",
                                    "border-radius": "6px",
                                    padding: "0.4rem 1rem",
                                    "font-size": "0.9rem",
                                    cursor: "pointer",
                                    "font-weight": gameStore.settings.stackingRule === "none" ? "bold" : "normal",
                                    transition: "all 0.2s",
                                }}
                            >
                                None
                            </button>
                        </div>
                    </SettingRow>
                </div>

                {/* Dynamic Description Box */}
                <div
                    style={{
                        height: "auto",
                        "min-height": "3rem",
                        display: "flex",
                        "align-items": "center",
                        "justify-content": "center",
                        "border-top": "1px solid rgba(255,255,255,0.1)",
                        "padding-top": "1rem",
                        color: "#94a3b8",
                        "font-style": "italic",
                        "font-size": "0.95rem",
                        "text-align": "center",
                        "white-space": "normal",
                        "line-height": "1.4",
                    }}
                >
                    {activeDescription() || "Hover over settings to see more details."}
                </div>

                <button
                    onClick={handleStart}
                    style={{
                        width: "100%",
                        padding: "1.25rem",
                        background: "#22c55e",
                        color: "white",
                        border: "none",
                        "border-radius": "12px",
                        "font-size": "1.5rem",
                        "font-weight": "bold",
                        cursor: "pointer",
                        "box-shadow": "0 4px 6px rgba(0,0,0,0.1)",
                        transition: "all 0.1s",
                        "margin-top": "0",
                    }}
                    onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
                    onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                    Start Game
                </button>
            </div>

            <p style={{ "margin-top": "2rem", color: "#94a3b8" }}>Plan your journey across Europe</p>
        </div>
    );
}
