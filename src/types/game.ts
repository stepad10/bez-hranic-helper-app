export type PlayerId = string;
export type CountryId = string;

export type RoundPhase =
    | 'SETUP' // Initial screen
    | 'DEALING'
    | 'TRAVEL_PLANNING'
    | 'EVALUATION'
    | 'ROUND_END'
    | 'GAME_END';

export interface Player {
    readonly id: PlayerId;
    readonly name: string;
    readonly color: string; // Hex code or CSS/Tailwind class
    readonly money: number;
    readonly tokens: {
        readonly remaining: number; // Tokens available to place
        readonly placed: boolean; // For Part 1 (one token)
    };
    // In advanced parts, we might track specific token IDs or locations here if needed, 
    // but usually placement is tracked on the board state.
}

export interface Country {
    readonly id: CountryId;
    readonly name: string;
    readonly neighbors: readonly CountryId[];
    // Metadata for UI
    readonly coordinates?: [number, number];
}

export interface PlacedToken {
    readonly playerId: PlayerId;
    readonly countryId: CountryId | 'SPACE_40'; // 'SPACE_40' is the special "pass" zone
    readonly timestamp: number; // For stacking order (earlier = lower = better)
}

export interface GameState {
    readonly round: number; // 1-7
    readonly phase: RoundPhase;
    readonly players: Record<PlayerId, Player>;

    // Board State
    readonly offer: readonly CountryId[]; // 7 cards usually
    readonly currentSelections: Record<PlayerId, (CountryId | 'SPACE_40')[]>; // Track choices per round
    readonly startingCountry: CountryId | null;
    readonly destinationCountry: CountryId | null; // For rounds 5-7

    // Card Management
    readonly deck: readonly CountryId[];
    readonly discard: readonly CountryId[];

    readonly placements: readonly PlacedToken[]; // All tokens currently on board

    // Actions log or history could go here for "Time Travel" / Undo
}

// Discriminated Union for Actions - Reducer Pattern ready
export type GameAction =
    | { type: 'START_GAME'; payload: { playerIds: string[] } }
    | { type: 'DEAL_ROUND'; payload: { round: number } } // Handles shuffling if needed, drawing 7+1 cards
    | { type: 'PLACE_TOKEN'; payload: { playerId: PlayerId; countryId: CountryId | 'SPACE_40' } }
    | { type: 'RESOLVE_ROUND'; } // Triggers evaluation logic
    | { type: 'UPDATE_MONEY'; payload: { playerId: PlayerId; amount: number; operation: 'add' | 'subtract' } };
