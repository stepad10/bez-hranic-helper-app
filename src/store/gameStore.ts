import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { GameState, GameAction, CountryId } from '../types/game';
import { EUROPE_GRAPH } from '../data/europeGraph';
import { findMultiStagePath, calculateJourneyCost } from '../game-core/pathfinding';

interface GameStore extends GameState {
    settings: {
        showTravelCosts: boolean;
        mapStyle: 'blank' | 'codes';
    };
    dispatch: (action: GameAction | { type: 'UPDATE_SETTINGS', payload: Partial<GameStore['settings']> }) => void;
}

const INITIAL_STATE: Omit<GameStore, 'dispatch'> = {
    round: 1,
    phase: 'SETUP',
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
        mapStyle: 'blank'
    }
};

export const useGameStore = create<GameStore>()(
    devtools(
        (set) => ({
            ...INITIAL_STATE,

            dispatch: (action: GameAction | { type: 'UPDATE_SETTINGS', payload: Partial<GameStore['settings']> }) => {
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
function reducer(state: GameStore, action: any): Partial<GameStore> {
    switch (action.type) {
        case 'UPDATE_SETTINGS': {
            return {
                ...state,
                settings: {
                    ...state.settings,
                    ...action.payload
                }
            };
        }

        case 'START_GAME': {
            const allCountries = Object.keys(EUROPE_GRAPH) as CountryId[];
            const deck = shuffle(allCountries);

            return {
                ...state,
                round: 1,
                phase: 'DEALING',
                players: action.payload.playerIds.reduce((acc: any, id: string, idx: number) => ({
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
                currentSelections: {},
            };
        }

        case 'DEAL_ROUND': {
            const { round } = action.payload;
            let currentDeck = [...state.deck];
            let currentDiscard = [...state.discard];

            const drawCard = (): CountryId | undefined => {
                if (currentDeck.length === 0) {
                    if (currentDiscard.length === 0) return undefined;
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

            // Draw Destination Country (Only for Rounds 5-7)
            let destinationCountry: CountryId | null = null;
            if (round >= 5) {
                destinationCountry = drawCard() || null;
            }

            return {
                ...state,
                round: round,
                phase: 'TRAVEL_PLANNING',
                deck: currentDeck,
                discard: currentDiscard,
                offer,
                startingCountry,
                destinationCountry,
                placements: [], // Visual reset (though history usually kept in real game, for now reset for clarity)
                currentSelections: {}, // Reset selections
            };
        }

        case 'RESOLVE_ROUND': {
            // Move all current board cards to discard
            const usedCards: CountryId[] = [...state.offer];
            if (state.startingCountry) usedCards.push(state.startingCountry);
            if (state.destinationCountry) usedCards.push(state.destinationCountry);

            // Scoring Logic
            const updatedPlayers = { ...state.players };
            const selections = state.currentSelections;
            const start = state.startingCountry;
            const dest = state.destinationCountry;
            const isFinale = state.round === 7;

            // Validation: Ensure all players have correct number of selections
            const requiredSelections = state.round <= 2 ? 1 : 2;
            const allReady = Object.keys(state.players).every(pid => {
                const selections = state.currentSelections[pid] || [];
                return selections.length === requiredSelections;
            });

            if (!allReady) {
                console.warn("Attempted to resolve round without all players ready");
                return state; // No-op if not ready
            }

            if (start) {
                Object.keys(updatedPlayers).forEach(pid => {
                    const player = { ...updatedPlayers[pid] };
                    const choices = selections[pid] || [];

                    // 1. Stacking Penalty (Simplified: if shared choice, pay 10)
                    // Real rule: "If you place token where another is..."
                    // In simultaneous reveal, if multiple players pick same, they ALL pay?
                    // Rules say: "If a player places a token on a country where another token is ALREADY placed"
                    // In simultaneous play, usually they are placed at same time. 
                    // Let's assume for this version: If >1 player picked same country, they clash.
                    // OR check against *previous* rounds' placements?
                    // "Tokens remain on the board" -> Yes.
                    // So we check if `state.placements` (historical) + other current players have this country.

                    // For Part 1/2, let's just check if ANYONE else is there (historical).
                    // We need to know if `countryId` has tokens from BEFORE this round.
                    // `state.placements` currently includes `currentSelections` because we merged them in `PLACE_TOKEN`.
                    // We need to differentiate "new" vs "old".
                    // Actually `PLACE_TOKEN` in our reducer is accumulating to `placements` list too.
                    // So `placements` has everything.

                    let roundCost = 0;
                    let roundEarnings = 0;

                    // Calculate Journey Cost
                    if (choices.length > 0) {
                        try {
                            // Path: Start -> Choice 1 (-> Choice 2) -> Dest
                            // We need to order choices? Or optimal?
                            // optimize: try permutations if 2 choices
                            // Rules: "...to the first chosen country... then to the second..."
                            // Usually player decides order. default: order of selection?
                            // Let's assume order of selection or just greedy sort?
                            // `findMultiStagePath` signature: (stops[], graph) -> path
                            // We treat all choices as waypoints including start and dest.

                            const fullPath = [start, ...choices];
                            if (dest) fullPath.push(dest);

                            const path = findMultiStagePath(fullPath, EUROPE_GRAPH);

                            if (path) {
                                // Pass fullPath as waypoints for Neighbor Penalty calculation
                                const cost = calculateJourneyCost(path, EUROPE_GRAPH, fullPath);
                                if (isFinale) {
                                    roundEarnings += cost.total;
                                } else {
                                    roundCost += cost.total;
                                }
                            }
                        } catch (e) {
                            console.error("Pathfinding failed", e);
                        }
                    } else {
                        // Penalty for no move? If not Space 40?
                        // Rules usually force a move or pass. 
                        // If empty, maybe assume skipped/forgot? 
                        // For now, 0 cost if nothing selected (maybe they ran out of money?)
                    }

                    // Stacking Penalty (Only for non-Space40 choices)
                    if (!choices.includes('SPACE_40')) {
                        choices.forEach(cid => {
                            const tokensOnCountry = state.placements.filter(p => p.countryId === cid);
                            if (tokensOnCountry.length > 1) {
                                if (isFinale) {
                                    roundEarnings -= 10;
                                } else {
                                    roundCost += 10;
                                }
                            }
                        });
                    }

                    if (isFinale) {
                        player.money += roundEarnings;
                    } else {
                        player.money = Math.max(0, player.money - roundCost);
                    }

                    // Consume token
                    if (player.tokens.remaining > 0) {
                        player.tokens = {
                            ...player.tokens,
                            remaining: player.tokens.remaining - 1,
                            placed: true
                        };
                    }

                    updatedPlayers[pid] = player;
                });
            }

            const nextRound = state.round + 1;
            const nextPhase = nextRound > 7 ? 'GAME_END' : 'ROUND_END';

            return {
                ...state,
                phase: nextPhase,
                players: updatedPlayers,
                offer: [],
                startingCountry: null,
                destinationCountry: null,
                discard: [...state.discard, ...usedCards],
                currentSelections: {},
            };
        }

        case 'PLACE_TOKEN': {
            const { playerId, countryId } = action.payload;

            // Limit selections based on round
            // Rounds 1-2: 1 selection
            // Rounds 3-6: 2 selections
            const maxSelections = state.round <= 2 ? 1 : 2;

            const playerSelections = state.currentSelections[playerId] || [];

            // Toggle logic or Add logic?
            // Let's go with: Add if under limit, ignore if at limit (or replace?)
            // For simplicity: If already selected, remove it (toggle). If not, add if < max.

            let newSelections = [...playerSelections];
            if (newSelections.includes(countryId)) {
                newSelections = newSelections.filter(c => c !== countryId);
            } else if (newSelections.length < maxSelections) {
                newSelections.push(countryId);
            }

            return {
                ...state,
                currentSelections: {
                    ...state.currentSelections,
                    [playerId]: newSelections
                },
                // Update placements for visual feedback (Showing tokens on map)
                // We re-generate placements from all players' current selections
                placements: [
                    ...state.placements.filter(p => p.playerId !== playerId), // Remove old for this player
                    ...newSelections.map(cid => ({ playerId, countryId: cid, timestamp: Date.now() }))
                ]
            };
        }

        // TODO: Implement other cases as we build logic
        default:
            return state;
    }
}
