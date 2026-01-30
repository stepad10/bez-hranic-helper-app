import { GameAction, GameState, CountryId } from "../types/game";

export interface RoundSummary {
    round: number;
    players: Record<
        string,
        {
            journeyCost: number;
            stackingPenalty: number;
            space40Cost: number;
            totalCost: number;
            totalEarnings?: number; // For Round 7
            path: CountryId[] | null; // The actual path taken
        }
    >;
}

export interface GameStore extends GameState {
    settings: {
        showTravelCosts: boolean;
        mapStyle: "blank" | "codes";
        map: "europe";
        stackingRule: "ordered" | "none";
    };
    activePlayerId: string | null;
    highlightedPlayerId: string | null; // For visualization
    roundHistory: RoundSummary[];
    dispatch: (
        action:
            | GameAction
            | { type: "UPDATE_SETTINGS"; payload: Partial<GameStore["settings"]> }
            | { type: "SET_ACTIVE_PLAYER"; payload: string }
            | { type: "SET_HIGHLIGHTED_PLAYER"; payload: string | null },
    ) => void;
}

export const INITIAL_STATE: Omit<GameStore, "dispatch"> = {
    round: 1,
    phase: "MENU",
    players: {},
    offer: [],
    startingCountry: null,
    destinationCountry: null,
    placements: [],
    deck: [],
    discard: [],
    currentSelections: {},
    settings: {
        showTravelCosts: true,
        mapStyle: "blank",
        map: "europe",
        stackingRule: "none", // Default: No stacking penalties (Pass 'n Play friendly)
    },
    activePlayerId: null,
    highlightedPlayerId: null,
    roundHistory: [],
};
