import { describe, it, expect, beforeEach } from "vitest";
import { gameStore, setGameStore, dispatch, INITIAL_STATE } from "../store/gameStore";
import { GameAction } from "../types/game";
import { reconcile } from "solid-js/store";

// We access the SolidJS store directly for testing

describe("Game Rules: Stacking Penalty", () => {
    beforeEach(() => {
        // Reset to initial state
        setGameStore(
            reconcile({
                ...INITIAL_STATE,
                dispatch: (action: GameAction) => dispatch(action),
            }),
        );

        setGameStore({
            round: 1,
            phase: "TRAVEL_PLANNING",
            players: {
                p1: { id: "p1", name: "P1", money: 100, color: "red", tokens: { remaining: 1, placed: false } },
                p2: { id: "p2", name: "P2", money: 100, color: "blue", tokens: { remaining: 1, placed: false } },
            },
            offer: ["AUT", "CZE"],
            startingCountry: "DE",
            placements: [],
            currentSelections: {},
            settings: {
                showTravelCosts: true,
                mapStyle: "blank",
                map: "europe",
                stackingRule: "ordered",
            },
            roundHistory: [], // Reset history
        });
    });

    it("Standard Rule: First player pays 0, Second player pays 10", () => {
        // P1 selects AUT first
        dispatch({ type: "PLACE_TOKEN", payload: { playerId: "p1", countryId: "AUT" } });

        // Advance time slightly to ensure diff timestamps (though usually not needed if seq)
        // Manual override for test stability:
        const newPlacements1 = [...gameStore.placements];
        // Ensure first placement has earlier timestamp if it was updated too fast
        newPlacements1[0] = { ...newPlacements1[0], timestamp: 1000 };
        setGameStore({ placements: newPlacements1 });

        // P2 selects AUT later
        dispatch({ type: "PLACE_TOKEN", payload: { playerId: "p2", countryId: "AUT" } });

        const newPlacements2 = [...gameStore.placements];
        newPlacements2[1] = { ...newPlacements2[1], timestamp: 2000 };
        setGameStore({ placements: newPlacements2 });

        // Resolve Round
        dispatch({ type: "RESOLVE_ROUND" });

        const history = gameStore.roundHistory[0];
        const p1Res = history.players.p1;
        const p2Res = history.players.p2;

        expect(p1Res.stackingPenalty).toBe(0);
        expect(p2Res.stackingPenalty).toBe(10);
    });

    it("Addon Rule (None): Both players pay 0", () => {
        setGameStore("settings", (s) => ({ ...s, stackingRule: "none" }));

        // P1 selects AUT
        dispatch({ type: "PLACE_TOKEN", payload: { playerId: "p1", countryId: "AUT" } });
        // P2 selects AUT
        dispatch({ type: "PLACE_TOKEN", payload: { playerId: "p2", countryId: "AUT" } });

        // Resolve Round
        dispatch({ type: "RESOLVE_ROUND" });

        const history = gameStore.roundHistory[0];

        expect(history.players.p1.stackingPenalty).toBe(0);
        expect(history.players.p2.stackingPenalty).toBe(0);
    });
});

describe("Game Store Logic", () => {
    // Reset store before each test
    beforeEach(() => {
        setGameStore(
            reconcile({
                ...INITIAL_STATE,
                dispatch: (action: GameAction) => dispatch(action),
            }),
        );

        // Explicitly set these values as reconcile might not reset everything if structure matches
        setGameStore({
            round: 1,
            phase: "DEALING",
            players: {},
            offer: [],
            startingCountry: null,
            destinationCountry: null,
            placements: [],
            deck: [],
            discard: [],
        });
    });

    it("should start game correctly", () => {
        dispatch({ type: "START_GAME", payload: { playerIds: ["p1", "p2"] } });

        const state = gameStore;
        expect(state.round).toBe(1);
        expect(Object.keys(state.players)).toHaveLength(2);
        expect(state.players["p1"].money).toBe(100);
        // Deck should be initialized (40+ countries)
        expect(state.deck.length).toBeGreaterThan(40);
    });

    it("should deal round 1 correctly", () => {
        dispatch({ type: "START_GAME", payload: { playerIds: ["p1"] } });

        dispatch({ type: "DEAL_ROUND", payload: { round: 1 } });

        const state = gameStore;
        expect(state.offer).toHaveLength(7);
        expect(state.startingCountry).toBeTruthy();
        expect(state.destinationCountry).toBeNull(); // Round 1 has no destination
        expect(state.phase).toBe("TRAVEL_PLANNING");
    });

    it("should deal round 5 correctly (Part 3)", () => {
        dispatch({ type: "START_GAME", payload: { playerIds: ["p1"] } });

        dispatch({ type: "DEAL_ROUND", payload: { round: 5 } });

        const state = gameStore;
        expect(state.destinationCountry).toBeTruthy(); // Round 5 needs destination
        expect(state.phase).toBe("TRAVEL_PLANNING");
    });

    it("should resolve round and calculate costs correctly", () => {
        // Setup: Round 1, Start=DE, User picks PL (neighbor). Cost: Border(10) + Neighbor(30) = 40.
        // Stack: No stacking.
        dispatch({ type: "START_GAME", payload: { playerIds: ["p1"] } });

        // Force state for deterministic test, ensuring we keep the players initialized by START_GAME
        setGameStore({
            startingCountry: "DE",
            offer: ["PL", "FR"],
            phase: "TRAVEL_PLANNING",
            currentSelections: { p1: ["PL"] },
        });

        dispatch({ type: "RESOLVE_ROUND" });

        const state = gameStore;
        // Initial 100 - 40 = 60
        expect(state.players["p1"].money).toBe(60);
        expect(state.phase).toBe("ROUND_END");
    });

    it("should resolve round and clean up", () => {
        dispatch({ type: "START_GAME", payload: { playerIds: ["p1"] } });
        dispatch({ type: "DEAL_ROUND", payload: { round: 1 } });

        // Setup selection for p1 to allow resolution
        const availableOffer = gameStore.offer[0];
        expect(availableOffer).toBeDefined();

        dispatch({ type: "PLACE_TOKEN", payload: { playerId: "p1", countryId: availableOffer } });

        // Ensure selection was recorded
        expect(gameStore.currentSelections["p1"]).toContain(availableOffer);

        const dealingState = gameStore;
        const cardsOnBoard = 7 + (dealingState.startingCountry ? 1 : 0);

        dispatch({ type: "RESOLVE_ROUND" });

        const endState = gameStore;
        expect(endState.offer).toHaveLength(0);
        expect(endState.startingCountry).toBeNull();
        expect(endState.discard).toHaveLength(cardsOnBoard);
        expect(endState.phase).toBe("ROUND_END");
    });

    it("should handle logic for Rounds 5-6 (Start -> Selection -> Dest) scoring", () => {
        dispatch({ type: "START_GAME", payload: { playerIds: ["p1"] } });

        setGameStore({
            round: 5,
            startingCountry: "DE",
            destinationCountry: "ES",
            phase: "TRAVEL_PLANNING",
            offer: ["FR", "PL", "SPACE_40"], // Ensure available
            currentSelections: { p1: ["FR", "SPACE_40"] },
        });

        dispatch({ type: "RESOLVE_ROUND" });

        const state = gameStore;
        // Cost 120. Money 100 -> 0.
        expect(state.players["p1"].money).toBe(0);
    });

    it("should handle Round 7 logic (Inverted Scoring)", () => {
        dispatch({ type: "START_GAME", payload: { playerIds: ["p1"] } });

        setGameStore({
            ...gameStore,
            round: 7,
            startingCountry: "DE",
            destinationCountry: "ES",
            phase: "TRAVEL_PLANNING",
            offer: ["FR", "PL", "SPACE_40"],
            currentSelections: { p1: ["FR", "SPACE_40"] },
            players: {
                ...gameStore.players,
                p1: {
                    id: "p1",
                    name: "P1",
                    color: "red",
                    money: 0, // Reset to 0
                    tokens: { remaining: 2, placed: false }, // Give 2 tokens
                },
            },
        });

        dispatch({ type: "RESOLVE_ROUND" });

        const state = gameStore;
        // Expect 80 (Journey) + 0 (Earnings from Sp40? No) - 0 (Penalty) = 80.
        expect(state.players["p1"].money).toBe(80);

        // Check transition to GAME_END
        expect(state.phase).toBe("GAME_END");
    });
});
