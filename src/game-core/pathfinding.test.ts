import { describe, it, expect } from 'vitest';
import { findShortestPath, calculateJourneyCost } from './pathfinding';
import { EUROPE_GRAPH } from '../data/europeGraph';

describe('Pathfinding Logic', () => {

    describe('findShortestPath', () => {
        it('should find direct path between neighbors', () => {
            const path = findShortestPath('FR', 'GB', EUROPE_GRAPH);
            expect(path).toEqual(['FR', 'GB']);
        });

        it('should find path with 1 hop', () => {
            // BE -> FR -> GB (if BE-GB direct is not shortest? They are neighbors though.
            // Let's try Monaco to Spain (MC -> FR -> ES)
            const path = findShortestPath('MC', 'ES', EUROPE_GRAPH);
            expect(path).toEqual(['MC', 'FR', 'ES']);
        });

        it('should respect "Surrounded" rule (Monaco)', () => {
            // Monaco -> Italy: Must go through France
            // MC -> FR -> IT
            const path = findShortestPath('MC', 'IT', EUROPE_GRAPH);
            expect(path).toEqual(['MC', 'FR', 'IT']);
        });
    });

    describe('calculateJourneyCost', () => {
        // Rules: 
        // 10 per border crossing (path length - 1 * 10)
        // +30 if destination borders start (Neighbor penalty)

        it('calculates cost for neighbors (France -> GB)', () => {
            // Path: FR -> GB
            // Borders: 1 (10 eur)
            // Neighbors? Yes (FR borders GB). Penalty: 30
            // Total: 40
            const path = ['FR', 'GB'];
            const cost = calculateJourneyCost(path, EUROPE_GRAPH);
            expect(cost.total).toBe(40);
            expect(cost.breakdown.borders).toBe(10);
            expect(cost.breakdown.neighbors).toBe(30);
        });

        it('calculates cost for 2 hops (Monaco -> Spain)', () => {
            // Path: MC -> FR -> ES
            // Borders: 2 (20 eur)
            // Neighbors? MC does NOT border ES. No penalty.
            // Total: 20
            const path = ['MC', 'FR', 'ES'];
            const cost = calculateJourneyCost(path, EUROPE_GRAPH);
            expect(cost.total).toBe(20);
        });

        it('calculates cost for neighbors via indirect route is NOT allowed logic (Graph is shortest path)', () => {
            // The function calculateJourneyCost assumes the path is VALID.
            // If FR and GB are neighbors, even if I took a longer route, I pay the penalty.
            // But findShortestPath should return the shortest.

            // Let's test just the cost calculation logic:
            // Path: FR -> DE -> NL -> GB (3 hops = 30)
            // But FR and GB are neighbors directly. The rule says "If the player chose a country that directly borders... pay surcharge regardless of route".
            // So cost should be 30 + 30 = 60.
            const path = ['FR', 'DE', 'NL', 'GB'];
            const cost = calculateJourneyCost(path, EUROPE_GRAPH);
            expect(cost.total).toBe(60); // 30 borders + 30 neighbor penalty
            expect(cost.breakdown.neighbors).toBe(30);
        });
    });
});
