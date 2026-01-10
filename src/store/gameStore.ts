import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { GameState, GameAction, CountryId } from '../types/game';
import { EUROPE_GRAPH } from '../data/europeGraph';

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
    deck: [],
    discard: [],
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

// Debug helper
if (typeof window !== 'undefined') {
    (window as any).gameStore = useGameStore;
}

// Helper to shuffle array
const shuffle = <T>(array: T[]): T[] => {
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
};

// Pure Reducer Function for State Logic
function reducer(state: GameStore, action: GameAction): Partial<GameStore> {
    switch (action.type) {
        case 'START_GAME': {
            const allCountries = Object.keys(EUROPE_GRAPH) as CountryId[];
            const deck = shuffle(allCountries);

            return {
                ...state,
                round: 1,
                phase: 'DEALING',
                players: action.payload.playerIds.reduce((acc, id, idx) => ({
                    ...acc,
                    [id]: {
                        id,
                        name: `Player ${idx + 1}`,
                        color: ['#ef4444', '#3b82f6', '#22c55e', '#eab308'][idx % 4],
                        money: 100, // Part 1 (Rounds 1-2) Start Money
                        tokens: { remaining: 1, placed: false },
                    }
                }), {}),
                placements: [],
                offer: [],
                startingCountry: null,
                deck,
                discard: [],
            };
        }

        case 'DEAL_ROUND': {
            const { round } = action.payload;
            let currentDeck = [...state.deck];
            let currentDiscard = [...state.discard];

            const drawCard = (): CountryId | undefined => {
                if (currentDeck.length === 0) {
                    if (currentDiscard.length === 0) return undefined; // Should not happen with 45 cards? 
                    // Actually 45 cards is enough for 5 rounds (40 cards), but round 6 needs 9 more (49).
                    // So we reshuffle.
                    currentDeck = shuffle(currentDiscard);
                    currentDiscard = [];
                }
                return currentDeck.pop();
            };

            const offer: CountryId[] = [];

            // Draw 7 for offer
            for (let i = 0; i < 7; i++) {
                const card = drawCard();
                if (card) offer.push(card);
            }

            // Draw Starting Country
            const startingCountry = drawCard() || null;

            // Draw Destination Country (Only for Rounds 5-7, i.e., Parts 3 & Finale)
            // Rules: Part 1(1-2), Part 2(3-4) -> 1 start.
            // Part 3(5-6), Round 7 -> 2 cards (start + dest).
            let destinationCountry: CountryId | null = null;
            if (round >= 5) {
                destinationCountry = drawCard() || null;
            }

            return {
                ...state,
                round: round,
                phase: 'TRAVEL_PLANNING', // Auto-advance to planning after dealing
                deck: currentDeck,
                discard: currentDiscard,
                offer,
                startingCountry,
                destinationCountry,
                placements: [], // Reset placements for new round
            };
        }

        case 'RESOLVE_ROUND': {
            // Move all current board cards to discard
            const usedCards: CountryId[] = [...state.offer];
            if (state.startingCountry) usedCards.push(state.startingCountry);
            if (state.destinationCountry) usedCards.push(state.destinationCountry);

            return {
                ...state,
                phase: 'ROUND_END',
                offer: [],
                startingCountry: null,
                destinationCountry: null,
                discard: [...state.discard, ...usedCards],
            };
        }

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
