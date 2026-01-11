import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from './gameStore';

describe('Game Store Logic', () => {
    // Reset store before each test
    beforeEach(() => {
        useGameStore.setState({
            round: 1,
            phase: 'DEALING',
            players: {},
            offer: [],
            startingCountry: null,
            destinationCountry: null,
            placements: [],
            deck: [],
            discard: [],
        });
    });

    it('should start game correctly', () => {
        const store = useGameStore.getState();
        store.dispatch({ type: 'START_GAME', payload: { playerIds: ['p1', 'p2'] } });

        const state = useGameStore.getState();
        expect(state.round).toBe(1);
        expect(Object.keys(state.players)).toHaveLength(2);
        expect(state.players['p1'].money).toBe(100);
        // Deck should be initialized (40+ countries)
        expect(state.deck.length).toBeGreaterThan(40);
    });

    it('should deal round 1 correctly', () => {
        const store = useGameStore.getState();
        store.dispatch({ type: 'START_GAME', payload: { playerIds: ['p1'] } });

        store.dispatch({ type: 'DEAL_ROUND', payload: { round: 1 } });

        const state = useGameStore.getState();
        expect(state.offer).toHaveLength(7);
        expect(state.startingCountry).toBeTruthy();
        expect(state.destinationCountry).toBeNull(); // Round 1 has no destination
        expect(state.phase).toBe('TRAVEL_PLANNING');
    });

    it('should deal round 5 correctly (Part 3)', () => {
        const store = useGameStore.getState();
        store.dispatch({ type: 'START_GAME', payload: { playerIds: ['p1'] } });

        store.dispatch({ type: 'DEAL_ROUND', payload: { round: 5 } });

        const state = useGameStore.getState();
        expect(state.destinationCountry).toBeTruthy(); // Round 5 needs destination
        expect(state.phase).toBe('TRAVEL_PLANNING');
    });

    it('should resolve round and calculate costs correctly', () => {
        // Setup: Round 1, Start=DE, User picks PL (neighbor). Cost: Border(10) + Neighbor(30) = 40.
        // Stack: No stacking.
        const store = useGameStore.getState();
        store.dispatch({ type: 'START_GAME', payload: { playerIds: ['p1'] } });

        // Force state for deterministic test, ensuring we keep the players initialized by START_GAME
        useGameStore.setState({
            startingCountry: 'DE',
            offer: ['PL', 'FR'],
            phase: 'TRAVEL_PLANNING',
            currentSelections: { 'p1': ['PL'] }
        });

        store.dispatch({ type: 'RESOLVE_ROUND' });

        const state = useGameStore.getState();
        // Initial 100 - 40 = 60
        expect(state.players['p1'].money).toBe(60);
        expect(state.phase).toBe('ROUND_END');
    });

    it('should resolve round and clean up', () => {
        const store = useGameStore.getState();
        store.dispatch({ type: 'START_GAME', payload: { playerIds: ['p1'] } });
        store.dispatch({ type: 'DEAL_ROUND', payload: { round: 1 } });

        const dealingState = useGameStore.getState();
        const cardsOnBoard = dealingState.offer.length + (dealingState.startingCountry ? 1 : 0);

        store.dispatch({ type: 'RESOLVE_ROUND' });

        const endState = useGameStore.getState();
        expect(endState.offer).toHaveLength(0);
        expect(endState.startingCountry).toBeNull();
        expect(endState.discard).toHaveLength(cardsOnBoard);
        expect(endState.phase).toBe('ROUND_END');
    });

    it('should handle logic for Rounds 5-6 (Start -> Selection -> Dest) scoring', () => {
        const store = useGameStore.getState();
        store.dispatch({ type: 'START_GAME', payload: { playerIds: ['p1'] } });

        // Setup Round 5: Start=DE, Dest=ES. Selection=FR.
        // Path: DE->FR->ES.
        // DE-FR: Border(10) + Neighbor(30) = 40.
        // FR-ES: Border(10) + Neighbor(30) = 40.
        // Total Cost: 80.
        useGameStore.setState({
            ...useGameStore.getState(),
            round: 5,
            startingCountry: 'DE',
            destinationCountry: 'ES',
            phase: 'TRAVEL_PLANNING',
            offer: ['FR', 'PL'],
            currentSelections: { 'p1': ['FR'] }
        });

        store.dispatch({ type: 'RESOLVE_ROUND' });

        const state = useGameStore.getState();
        // Initial 100 - 80 = 20.
        expect(state.players['p1'].money).toBe(20);
    });

    it('should handle Round 7 logic (Inverted Scoring)', () => {
        const store = useGameStore.getState();
        store.dispatch({ type: 'START_GAME', payload: { playerIds: ['p1'] } });

        // Setup Round 7: Start=DE, Dest=ES, Selection=FR.
        // Normal Cost: 80.
        // Inverted: Earn 80.
        useGameStore.setState({
            ...useGameStore.getState(),
            round: 7,
            startingCountry: 'DE',
            destinationCountry: 'ES',
            phase: 'TRAVEL_PLANNING',
            currentSelections: { 'p1': ['FR'] },
            players: {
                'p1': {
                    id: 'p1', name: 'P1', color: 'red',
                    money: 0, // Reset to 0
                    tokens: { remaining: 1, placed: false }
                }
            }
        });

        store.dispatch({ type: 'RESOLVE_ROUND' });

        const state = useGameStore.getState();
        expect(state.players['p1'].money).toBe(80);

        // Check transition to GAME_END
        // round was 7, nextRound=8 => GAME_END
        expect(state.phase).toBe('GAME_END');
    });
});
