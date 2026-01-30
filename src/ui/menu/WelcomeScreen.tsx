import { dispatch } from "../../store/gameStore";

export function WelcomeScreen() {
    const handlePassNPlay = () => {
        dispatch({ type: "ENTER_SETUP" });
    };

    const handleOnlinePlay = () => {
        // No-op for now
        alert("Online Play is coming soon!");
    };

    return (
        <div
            style={{
                position: "absolute",
                top: "0",
                left: "0",
                right: "0",
                bottom: "0",
                background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
                display: "flex",
                "flex-direction": "column",
                "align-items": "center",
                "justify-content": "center",
                color: "white",
                "z-index": 1000,
            }}
        >
            <h1 style={{ "font-size": "4rem", "margin-bottom": "4rem", "text-shadow": "0 4px 6px rgba(0,0,0,0.3)" }}>Without Borders</h1>

            <div
                style={{
                    display: "flex",
                    "flex-direction": "column",
                    gap: "1.5rem",
                    "min-width": "300px",
                }}
            >
                <button
                    onClick={handlePassNPlay}
                    style={{
                        padding: "1.5rem",
                        background: "#3b82f6",
                        color: "white",
                        border: "none",
                        "border-radius": "12px",
                        "font-size": "1.5rem",
                        "font-weight": "bold",
                        cursor: "pointer",
                        "box-shadow": "0 4px 6px rgba(0,0,0,0.1)",
                        transition: "transform 0.1s",
                        display: "flex",
                        "align-items": "center",
                        "justify-content": "center",
                        gap: "10px",
                    }}
                    onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
                    onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                    <span>👥</span> Pass 'n Play
                </button>

                <button
                    onClick={handleOnlinePlay}
                    style={{
                        padding: "1.5rem",
                        background: "rgba(255,255,255,0.1)",
                        color: "#94a3b8",
                        border: "2px dashed #475569",
                        "border-radius": "12px",
                        "font-size": "1.5rem",
                        "font-weight": "bold",
                        cursor: "not-allowed", // Changed to help user understand it's not ready
                        "box-shadow": "none",
                        transition: "transform 0.1s",
                        display: "flex",
                        "align-items": "center",
                        "justify-content": "center",
                        gap: "10px",
                    }}
                >
                    <span>🌐</span> Online Play
                </button>
            </div>

            <p style={{ "margin-top": "3rem", color: "#64748b", "font-size": "0.9rem" }}>v1.0.0 Alpha</p>
        </div>
    );
}
