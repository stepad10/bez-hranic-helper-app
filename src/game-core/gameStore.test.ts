import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from '../store/gameStore';

// We need to bypass Zustand's hook rules for direct verification in tests
// For pure logic testing, we can check the reducer logic or integration via store methods
// Since useGameStore is a hook, we access the vanilla store via .getState()

describe('Game Rules: Stacking Penalty', () => {
    beforeEach(() => {
        useGameStore.setState({
            round: 1,
            phase: 'TRAVEL_PLANNING',
            players: {
                p1: { id: 'p1', name: 'P1', money: 100, color: 'red', tokens: { remaining: 1, placed: false } },
                p2: { id: 'p2', name: 'P2', money: 100, color: 'blue', tokens: { remaining: 1, placed: false } }
            },
            offer: ['AUT', 'CZE'],
            placements: [],
            currentSelections: {},
            settings: {
                showTravelCosts: true,
                mapStyle: 'blank',
                map: 'europe',
                stackingRule: 'ordered'
            },
            roundHistory: [] // Reset history
        });
    });

    it('Standard Rule: First player pays 0, Second player pays 10', () => {
        const store = useGameStore.getState();

        // P1 selects AUT first
        store.dispatch({ type: 'PLACE_TOKEN', payload: { playerId: 'p1', countryId: 'AUT' } });

        // Advance time slightly to ensure diff timestamps (though usually not needed if seq)
        // Manual override for test stability:
        let s = useGameStore.getState();
        const newPlacements1 = [...s.placements];
        newPlacements1[0] = { ...newPlacements1[0], timestamp: 1000 };
        useGameStore.setState({ ...s, placements: newPlacements1 });

        // P2 selects AUT later
        store.dispatch({ type: 'PLACE_TOKEN', payload: { playerId: 'p2', countryId: 'AUT' } });

        s = useGameStore.getState();
        const newPlacements2 = [...s.placements];
        newPlacements2[1] = { ...newPlacements2[1], timestamp: 2000 };
        useGameStore.setState({ ...s, placements: newPlacements2 });

        // Resolve Round
        store.dispatch({ type: 'RESOLVE_ROUND' });

        const history = useGameStore.getState().roundHistory[0];
        const p1Res = history.players.p1;
        const p2Res = history.players.p2;

        expect(p1Res.stackingPenalty).toBe(0);
        expect(p2Res.stackingPenalty).toBe(10);
    });

    it('Addon Rule (None): Both players pay 0', () => {
        useGameStore.setState({
            settings: { ...useGameStore.getState().settings, stackingRule: 'none' }
        });

        const store = useGameStore.getState();

        // P1 selects AUT
        store.dispatch({ type: 'PLACE_TOKEN', payload: { playerId: 'p1', countryId: 'AUT' } });
        // P2 selects AUT
        store.dispatch({ type: 'PLACE_TOKEN', payload: { playerId: 'p2', countryId: 'AUT' } });

        // Resolve Round
        store.dispatch({ type: 'RESOLVE_ROUND' });

        const history = useGameStore.getState().roundHistory[0];

        expect(history.players.p1.stackingPenalty).toBe(0);
        expect(history.players.p2.stackingPenalty).toBe(0);
    });
});
