import { describe, it, expect, beforeEach } from 'vitest';
import { gameStore, setGameStore, dispatch, INITIAL_STATE } from '../store/gameStore';
import { reconcile } from 'solid-js/store';

// We access the SolidJS store directly for testing

describe('Game Rules: Stacking Penalty', () => {
    beforeEach(() => {
        // Reset to initial state
        setGameStore(reconcile({
            ...INITIAL_STATE,
            dispatch: (action: any) => dispatch(action)
        }));

        setGameStore({
            round: 1,
            phase: 'TRAVEL_PLANNING',
            players: {
                p1: { id: 'p1', name: 'P1', money: 100, color: 'red', tokens: { remaining: 1, placed: false } },
                p2: { id: 'p2', name: 'P2', money: 100, color: 'blue', tokens: { remaining: 1, placed: false } }
            },
            offer: ['AUT', 'CZE'],
            startingCountry: 'DE',
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
        // P1 selects AUT first
        dispatch({ type: 'PLACE_TOKEN', payload: { playerId: 'p1', countryId: 'AUT' } });

        // Advance time slightly to ensure diff timestamps (though usually not needed if seq)
        // Manual override for test stability:
        let newPlacements1 = [...gameStore.placements];
        // Ensure first placement has earlier timestamp if it was updated too fast
        newPlacements1[0] = { ...newPlacements1[0], timestamp: 1000 };
        setGameStore({ placements: newPlacements1 });

        // P2 selects AUT later
        dispatch({ type: 'PLACE_TOKEN', payload: { playerId: 'p2', countryId: 'AUT' } });

        let newPlacements2 = [...gameStore.placements];
        newPlacements2[1] = { ...newPlacements2[1], timestamp: 2000 };
        setGameStore({ placements: newPlacements2 });

        // Resolve Round
        dispatch({ type: 'RESOLVE_ROUND' });

        const history = gameStore.roundHistory[0];
        const p1Res = history.players.p1;
        const p2Res = history.players.p2;

        expect(p1Res.stackingPenalty).toBe(0);
        expect(p2Res.stackingPenalty).toBe(10);
    });

    it('Addon Rule (None): Both players pay 0', () => {
        setGameStore('settings', (s) => ({ ...s, stackingRule: 'none' }));

        // P1 selects AUT
        dispatch({ type: 'PLACE_TOKEN', payload: { playerId: 'p1', countryId: 'AUT' } });
        // P2 selects AUT
        dispatch({ type: 'PLACE_TOKEN', payload: { playerId: 'p2', countryId: 'AUT' } });

        // Resolve Round
        dispatch({ type: 'RESOLVE_ROUND' });

        const history = gameStore.roundHistory[0];

        expect(history.players.p1.stackingPenalty).toBe(0);
        expect(history.players.p2.stackingPenalty).toBe(0);
    });
});
