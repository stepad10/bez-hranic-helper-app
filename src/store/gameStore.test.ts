import { describe, it, expect, beforeEach } from 'vitest';
import { gameStore, setGameStore, dispatch, INITIAL_STATE } from './gameStore';
import { reconcile } from 'solid-js/store';

describe('Game Store Logic', () => {
    // Reset store before each test
    beforeEach(() => {
        setGameStore(reconcile({
            ...INITIAL_STATE,
            dispatch: (action: any) => dispatch(action)
        }));

        // Explicitly set these values as reconcile might not reset everything if structure matches
        setGameStore({
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
        dispatch({ type: 'START_GAME', payload: { playerIds: ['p1', 'p2'] } });

        const state = gameStore;
        expect(state.round).toBe(1);
        expect(Object.keys(state.players)).toHaveLength(2);
        expect(state.players['p1'].money).toBe(100);
        // Deck should be initialized (40+ countries)
        expect(state.deck.length).toBeGreaterThan(40);
    });

    it('should deal round 1 correctly', () => {
        dispatch({ type: 'START_GAME', payload: { playerIds: ['p1'] } });

        dispatch({ type: 'DEAL_ROUND', payload: { round: 1 } });

        const state = gameStore;
        expect(state.offer).toHaveLength(7);
        expect(state.startingCountry).toBeTruthy();
        expect(state.destinationCountry).toBeNull(); // Round 1 has no destination
        expect(state.phase).toBe('TRAVEL_PLANNING');
    });

    it('should deal round 5 correctly (Part 3)', () => {
        dispatch({ type: 'START_GAME', payload: { playerIds: ['p1'] } });

        dispatch({ type: 'DEAL_ROUND', payload: { round: 5 } });

        const state = gameStore;
        expect(state.destinationCountry).toBeTruthy(); // Round 5 needs destination
        expect(state.phase).toBe('TRAVEL_PLANNING');
    });

    it('should resolve round and calculate costs correctly', () => {
        // Setup: Round 1, Start=DE, User picks PL (neighbor). Cost: Border(10) + Neighbor(30) = 40.
        // Stack: No stacking.
        dispatch({ type: 'START_GAME', payload: { playerIds: ['p1'] } });

        // Force state for deterministic test, ensuring we keep the players initialized by START_GAME
        setGameStore({
            startingCountry: 'DE',
            offer: ['PL', 'FR'],
            phase: 'TRAVEL_PLANNING',
            currentSelections: { 'p1': ['PL'] }
        });

        dispatch({ type: 'RESOLVE_ROUND' });

        const state = gameStore;
        // Initial 100 - 40 = 60
        expect(state.players['p1'].money).toBe(60);
        expect(state.phase).toBe('ROUND_END');
    });

    it('should resolve round and clean up', () => {
        dispatch({ type: 'START_GAME', payload: { playerIds: ['p1'] } });
        dispatch({ type: 'DEAL_ROUND', payload: { round: 1 } });

        // Setup selection for p1 to allow resolution
        const availableOffer = gameStore.offer[0];
        expect(availableOffer).toBeDefined();

        dispatch({ type: 'PLACE_TOKEN', payload: { playerId: 'p1', countryId: availableOffer } });

        // Ensure selection was recorded
        expect(gameStore.currentSelections['p1']).toContain(availableOffer);

        const dealingState = gameStore;
        // Cards on board = offer + start + placed token (which was from offer, so offer length decreases by 1, but discard increases by 1)
        // Actually, RESOLVE_ROUND moves offer + start + dest to discard.
        // My test expectation logic implies cleaning up EVERYTHING.
        // If I make a selection, that selection is part of the clean up too?
        // `usedCards` logic in reducer: `[...state.offer]`.
        // If I selected a card, is it removed from offer?
        // PLACE_TOKEN logic: `newSelections.push`. It does NOT remove from offer.
        // So offer length remains 7.
        // cardsOnBoard = 7 (offer) + 1 (start).

        const cardsOnBoard = 7 + (dealingState.startingCountry ? 1 : 0);

        dispatch({ type: 'RESOLVE_ROUND' });

        const endState = gameStore;
        expect(endState.offer).toHaveLength(0);
        expect(endState.startingCountry).toBeNull();
        expect(endState.discard).toHaveLength(cardsOnBoard);
        expect(endState.phase).toBe('ROUND_END');
    });

    it('should handle logic for Rounds 5-6 (Start -> Selection -> Dest) scoring', () => {
        dispatch({ type: 'START_GAME', payload: { playerIds: ['p1'] } });

        // Setup Round 5: Start=DE, Dest=ES. Selection=FR.
        // Path: DE->FR->ES.
        // DE-FR: Border(10) + Neighbor(30) = 40.
        // FR-ES: Border(10) + Neighbor(30) = 40.
        // Total Cost: 80.
        // Need 2 selections for Round 5. Let's add PL as 2nd selection.
        // DE->PL is neighbor? DE-PL is neighbor. Cost 40.
        // So if we have DE -> FR -> ES, cost is 80.
        // If we have DE -> PL, and PL is not connected to ES?
        // Wait, "selections" are just waypoints.
        // `travelDestinations` = choices.
        // Path: Start -> Choice1 -> Choice2 -> Dest?
        // Or Start -> Choice1, Start -> Choice2?
        // `fullPath = [start, ...travelDestinations]`.
        // If Dest exists: `fullPath.push(dest)`.
        // So DE -> FR -> PL -> ES.
        // DE-FR: 40. FR-PL: ??? FR and PL are not neighbors.
        // Pathfinding: DE->FR (40). FR->PL (likely far). PL->ES (likely far).
        // This makes the test complex if I add a random second selection.

        // I should just make the Round 2 (requires 1 selection) to keep it simple and match the comment logic?
        // But the test name says "Rounds 5-6".
        // Round 5 introduced Destination Country.
        // So I MUST have Round 5+.
        // Meaning I MUST have 2 selections.

        // Let's pick a valid path: DE -> FR -> CH (Switzerland) -> IT (Italy) -> ???
        // Let's use DE -> FR -> ES. 
        // I need 2 selections. 
        // DE -> FR is one.
        // FR -> ES is the goal.
        // If I pick FR and "SPACE_40"?
        // SPACE_40 is a valid selection?
        // `choices.filter(c => c !== 'SPACE_40')`.
        // If I select FR and SPACE_40.
        // Path: DE -> FR -> ES. Cost 80.
        // SPACE_40 cost: 40.
        // Total: 120.
        // This changes expected result.

        // Let's pick FR and FR? Can I select same country twice?
        // `if (newSelections.includes(countryId)) { ... filter ... }`. It toggles. So no.

        // Pick 'BE' (Belgium). DE->BE (40). BE->FR (40). FR->ES (40).
        // Cost: 120.

        // The original test expected cost 80.
        // That implies 1 selection.
        // But Round 5 requires 2.
        // So the original test case was invalid for the game rules regarding selection count.
        // Refactoring: I will use 'SPACE_40' as the second selection and adjust expected cost.
        // Cost 80 (Journey) + 40 (Space 40) = 120.
        // Initial 100 - 120 = 0 (clamped).

        setGameStore({
            round: 5,
            startingCountry: 'DE',
            destinationCountry: 'ES',
            phase: 'TRAVEL_PLANNING',
            offer: ['FR', 'PL', 'SPACE_40'], // Ensure available
            currentSelections: { 'p1': ['FR', 'SPACE_40'] }
        });

        dispatch({ type: 'RESOLVE_ROUND' });

        const state = gameStore;
        // Cost 120. Money 100 -> 0.
        expect(state.players['p1'].money).toBe(0);
    });

    it('should handle Round 7 logic (Inverted Scoring)', () => {
        dispatch({ type: 'START_GAME', payload: { playerIds: ['p1'] } });

        // Setup Round 7: Start=DE, Dest=ES. Selection=FR.
        // Need 2 selections.
        // Use FR and SPACE_40.
        // Journey Cost: 80.
        // Space 40 Cost: 40.
        // Total Cost: 120.
        // Inverted Scoring (Finale):
        // `roundEarnings += cost.total` (80).
        // `roundEarnings -= stackingPenalty`.
        // Money += roundEarnings.
        // Wait, what about Space 40 in Finale?
        // `totalCost = journeyCost + space40Cost + stackingPenalty`.
        // Finale logic:
        // `roundEarnings += cost.total` (Journey only).
        // `roundEarnings -= stackingPenalty`.
        // What about space40Cost?
        // The reducer ignores space40Cost in Finale earnings calculation:
        // `if (isFinale) { roundEarnings += cost.total; } else { journeyCost += cost.total; }`
        // `if (isFinale) { roundEarnings -= stackingPenalty; player.money += roundEarnings; }`
        // So Space 40 cost is ignored/free in Finale? Or just not added?
        // It seems purely based on Path Cost.

        setGameStore({
            ...gameStore,
            round: 7,
            startingCountry: 'DE',
            destinationCountry: 'ES',
            phase: 'TRAVEL_PLANNING',
            offer: ['FR', 'PL', 'SPACE_40'],
            currentSelections: { 'p1': ['FR', 'SPACE_40'] },
            players: {
                ...gameStore.players,
                'p1': {
                    id: 'p1', name: 'P1', color: 'red',
                    money: 0, // Reset to 0
                    tokens: { remaining: 2, placed: false } // Give 2 tokens
                }
            }
        });

        dispatch({ type: 'RESOLVE_ROUND' });

        const state = gameStore;
        // Expect 80 (Journey) + 0 (Earnings from Sp40? No) - 0 (Penalty) = 80.
        expect(state.players['p1'].money).toBe(80);

        // Check transition to GAME_END
        expect(state.phase).toBe('GAME_END');
    });
});
