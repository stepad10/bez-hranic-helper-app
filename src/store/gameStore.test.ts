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
});
