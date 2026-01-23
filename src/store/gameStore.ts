import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { GameState, GameAction, CountryId } from '../types/game';
import { EUROPE_GRAPH } from '../data/europeGraph';
import { findMultiStagePath, calculateJourneyCost } from '../game-core/pathfinding';

interface GameStore extends GameState {
    settings: {
        showTravelCosts: boolean;
        mapStyle: 'blank' | 'codes';
        map: 'europe';
        stackingRule: 'ordered' | 'none';
    };
    activePlayerId: string | null;
    highlightedPlayerId: string | null; // For visualization
    roundHistory: RoundSummary[];
    dispatch: (action: GameAction |
    { type: 'UPDATE_SETTINGS', payload: Partial<GameStore['settings']> } |
    { type: 'SET_ACTIVE_PLAYER', payload: string } |
    { type: 'SET_HIGHLIGHTED_PLAYER', payload: string | null }
    ) => void;
}

export interface RoundSummary {
    round: number;
    players: Record<string, {
        journeyCost: number;
        stackingPenalty: number;
        space40Cost: number;
        totalCost: number;
        totalEarnings?: number; // For Round 7
        path: CountryId[] | null; // The actual path taken
    }>;
}

const INITIAL_STATE: Omit<GameStore, 'dispatch'> = {
    round: 1,
    phase: 'MENU',
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
        mapStyle: 'blank',
        map: 'europe',
        stackingRule: 'none' // Default: No stacking penalties (Pass 'n Play friendly)
    },
    activePlayerId: null,
    highlightedPlayerId: null,
    roundHistory: []
};

export const useGameStore = create<GameStore>()(
    devtools(
        (set) => ({
            ...INITIAL_STATE,

            dispatch: (action) => {
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
        case 'ENTER_SETUP': {
            return {
                ...state,
                phase: 'SETUP'
            };
        }

        case 'UPDATE_SETTINGS': {
            return {
                ...state,
                settings: {
                    ...state.settings,
                    ...action.payload
                }
            };
        }

        case 'SET_ACTIVE_PLAYER': {
            return {
                ...state,
                activePlayerId: action.payload
            };
        }

        case 'SET_HIGHLIGHTED_PLAYER': {
            return {
                ...state,
                highlightedPlayerId: action.payload
            };
        }

        case 'START_GAME': {
            // In the future, we can switch between graphs based on state.settings.map
            // For now, only EUROPE_GRAPH is available
            const mapGraph = state.settings.map === 'europe' ? EUROPE_GRAPH : EUROPE_GRAPH;
            const allCountries = Object.keys(mapGraph) as CountryId[];
            const deck = shuffle(allCountries);
            const playerIds = action.payload.playerIds;

            return {
                ...state,
                round: 1,
                phase: 'DEALING',
                players: playerIds.reduce((acc: any, id: string, idx: number) => ({
                    ...acc,
                    [id]: {
                        id,
                        name: `Player ${idx + 1}`,
                        color: ['#ef4444', '#3b82f6', '#22c55e', '#eab308'][idx % 4],
                        money: 100, // Part 1 (Rounds 1-2) Start Money
                        tokens: { remaining: 1, placed: false },
                    }
                }), {}),
                activePlayerId: playerIds[0], // Auto-select first player
                placements: [],
                offer: [],
                startingCountry: null,
                deck,
                discard: [],
                currentSelections: {},
                roundHistory: []
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

            // Money Increase Rules (Part 2 & 3)
            let updatedPlayersForDeal = { ...state.players };
            if (round === 3) {
                // Part 2: Add 200€
                Object.keys(updatedPlayersForDeal).forEach(pid => {
                    updatedPlayersForDeal[pid] = {
                        ...updatedPlayersForDeal[pid],
                        money: updatedPlayersForDeal[pid].money + 200
                    };
                });
            } else if (round === 5) {
                // Part 3: Add 300€
                Object.keys(updatedPlayersForDeal).forEach(pid => {
                    updatedPlayersForDeal[pid] = {
                        ...updatedPlayersForDeal[pid],
                        money: updatedPlayersForDeal[pid].money + 300
                    };
                });
            }

            return {
                ...state,
                round: round,
                phase: 'TRAVEL_PLANNING',
                players: updatedPlayersForDeal,
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

            const currentRoundSummary: RoundSummary = {
                round: state.round,
                players: {}
            };

            if (start) {
                Object.keys(updatedPlayers).forEach(pid => {
                    const player = { ...updatedPlayers[pid] };
                    const choices = selections[pid] || [];

                    let journeyCost = 0;
                    let stackingPenalty = 0;
                    let space40Cost = 0;
                    let roundEarnings = 0;
                    let calculatedPath: CountryId[] | null = null;

                    // Calculate Journey Cost
                    // Filter out SPACE_40 for travel path
                    const travelDestinations = choices.filter(c => c !== 'SPACE_40');

                    if (travelDestinations.length > 0) {
                        try {
                            const fullPath = [start, ...travelDestinations];
                            if (dest) fullPath.push(dest);

                            const path = findMultiStagePath(fullPath, EUROPE_GRAPH);

                            if (path) {
                                calculatedPath = path;
                                // Pass fullPath as waypoints for Neighbor Penalty calculation
                                const cost = calculateJourneyCost(path, EUROPE_GRAPH, fullPath);
                                if (isFinale) {
                                    roundEarnings += cost.total;
                                } else {
                                    journeyCost += cost.total;
                                }
                            }
                        } catch (e) {
                            console.error("Pathfinding failed", e);
                        }
                    }

                    // Base Cost for Space 40
                    if (choices.includes('SPACE_40')) {
                        space40Cost += 40;
                    }

                    // Stacking Penalty (Check ALL choices, including SPACE_40)
                    choices.forEach(cid => {
                        const tokensOnCountry = state.placements.filter(p => p.countryId === cid);

                        // Sort by timestamp (asc) to determine who was first
                        tokensOnCountry.sort((a, b) => a.timestamp - b.timestamp);

                        // If rule is 'none', no penalty ever.
                        // If rule is 'ordered' (default), first player is safe, others pay.
                        if (state.settings.stackingRule === 'ordered') {
                            const myIndex = tokensOnCountry.findIndex(p => p.playerId === pid);
                            if (myIndex > 0) {
                                stackingPenalty += 10;
                            }
                        }
                    });

                    let totalCost = journeyCost + space40Cost + stackingPenalty;

                    if (isFinale) {
                        // In finale, stacking is a deduction from earnings? Or cost?
                        // "Earnings - 10"?
                        roundEarnings -= stackingPenalty;
                        player.money += roundEarnings;
                    } else {
                        player.money = Math.max(0, player.money - totalCost);
                    }

                    // Store summary for this player
                    currentRoundSummary.players[pid] = {
                        journeyCost,
                        stackingPenalty,
                        space40Cost,
                        totalCost,
                        totalEarnings: isFinale ? roundEarnings : undefined,
                        path: calculatedPath
                    };

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
                discard: [...state.discard, ...usedCards],
                currentSelections: {},
                roundHistory: [...state.roundHistory, currentRoundSummary]
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

            // Standard toggle logic for all selections, including SPACE_40
            if (newSelections.includes(countryId)) {
                newSelections = newSelections.filter(c => c !== countryId);
            } else if (newSelections.length < maxSelections) {
                newSelections.push(countryId);
            }

            // Create new placements, preserving timestamps for existing selections
            const currentPlayerPlacements = state.placements.filter(p => p.playerId === playerId);
            const newPlacements = newSelections.map(cid => {
                const existing = currentPlayerPlacements.find(p => p.countryId === cid);
                return existing ? existing : { playerId, countryId: cid, timestamp: Date.now() };
            });

            return {
                ...state,
                currentSelections: {
                    ...state.currentSelections,
                    [playerId]: newSelections
                },
                // Update placements
                placements: [
                    ...state.placements.filter(p => p.playerId !== playerId), // Remove old for this player
                    ...newPlacements
                ]
            };
        }

        // TODO: Implement other cases as we build logic
        default:
            return state;
    }
}
