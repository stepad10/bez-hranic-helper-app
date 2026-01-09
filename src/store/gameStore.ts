import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { GameState, PlayerId, GameAction } from '../types/game';

interface GameStore extends GameState {
    dispatch: (action: GameAction) => void;
}

const INITIAL_STATE: Omit<GameStore, 'dispatch'> = {
    round: 1,
    phase: 'DEALING',
    players: {},
    offer: [],
    startingCountry: null,
    destinationCountry: null,
    placements: [],
};

export const useGameStore = create<GameStore>()(
    devtools(
        (set) => ({
            ...INITIAL_STATE,

            dispatch: (action: GameAction) => {
                set((state) => reducer(state, action));
            },
        }),
        { name: 'WithoutBordersStore' }
    )
);

// Pure Reducer Function for State Logic
function reducer(state: GameStore, action: GameAction): Partial<GameStore> {
    switch (action.type) {
        case 'START_GAME':
            // simplistic init for now
            return {
                ...state,
                players: action.payload.playerIds.reduce((acc, id, idx) => ({
                    ...acc,
                    [id]: {
                        id,
                        name: `Player ${idx + 1}`,
                        color: ['#ef4444', '#3b82f6', '#22c55e', '#eab308'][idx % 4], // Tailwind colors: red, blue, green, yellow
                        money: 100, // Round 1 start
                        tokens: { remaining: 1, placed: false },
                    }
                }), {}),
            };

        case 'PLACE_TOKEN':
            return {
                ...state,
                placements: [
                    ...state.placements,
                    {
                        playerId: action.payload.playerId,
                        countryId: action.payload.countryId,
                        timestamp: Date.now(),
                    }
                ]
            };

        // TODO: Implement other cases as we build logic
        default:
            return state;
    }
}
