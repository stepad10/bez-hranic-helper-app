import { createStore } from "solid-js/store";
import { GameAction } from "../types/game";
import { INITIAL_STATE, GameStore } from "./state";
import { reducer } from "./reducer";

// Re-export state interfaces and initial state for consumers
export type { GameStore, RoundSummary } from "./state";
export { INITIAL_STATE } from "./state";

// Create SolidJS Store
export const [gameStore, setGameStore] = createStore<GameStore>({
    ...INITIAL_STATE,
    dispatch: (action: GameAction) => dispatch(action),
});

// Dispatch function
export const dispatch = (action: GameAction) => {
    setGameStore((state) => reducer(state, action));
};

declare global {
    interface Window {
        gameStore: typeof gameStore;
        setGameStore: typeof setGameStore;
    }
}

// Debug helper
if (typeof window !== "undefined") {
    window.gameStore = gameStore;
    window.setGameStore = setGameStore;
}
