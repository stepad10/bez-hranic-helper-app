import { describe, it, expect } from "vitest";
import { findShortestPath, calculateJourneyCost, findMultiStagePath } from "./pathfinding";
import { EUROPE_GRAPH, GraphNode } from "../data/europeGraph";

describe("Pathfinding", () => {
    it("should find direct neighbors", () => {
        const path = findShortestPath("FR", "DE", EUROPE_GRAPH);
        expect(path).toEqual(["FR", "DE"]);
    });

    it("should find path with one hop", () => {
        const path = findShortestPath("PT", "FR", EUROPE_GRAPH);
        expect(path).toEqual(["PT", "ES", "FR"]);
    });

    it("should find path across Europe (PT -> PL)", () => {
        const path = findShortestPath("PT", "PL", EUROPE_GRAPH);
        // PT -> ES -> FR -> DE -> PL is valid
        expect(path).toEqual(["PT", "ES", "FR", "DE", "PL"]);
        expect(path.length).toBe(5);
    });

    it("should handle sea connections (IT -> GR)", () => {
        const path = findShortestPath("IT", "GR", EUROPE_GRAPH);
        expect(path).toEqual(["IT", "MT", "GR"]);
    });

    it("should calculate cost correctly for direct neighbors", () => {
        // FR -> IT is direct.
        // 1 border crossing = 10.
        // Direct neighbor penalty = 30.
        // Total = 40.
        const path = ["FR", "IT"];
        const cost = calculateJourneyCost(path, EUROPE_GRAPH);
        expect(cost.total).toBe(40);
        expect(cost.breakdown.borders).toBe(10);
        expect(cost.breakdown.neighbors).toBe(30);
    });

    it("should calculate cost properly for non-neighbors", () => {
        // PT -> FR (PT-ES-FR)
        // 2 crossings (PT-ES, ES-FR) = 20.
        // Not direct neighbors = 0.
        // Total = 20.
        const path = ["PT", "ES", "FR"];
        const cost = calculateJourneyCost(path, EUROPE_GRAPH);
        expect(cost.total).toBe(20);
        expect(cost.breakdown.neighbors).toBe(0);
    });
});

describe("Multi-Stage Pathfinding", () => {
    it("should connect multiple waypoints", () => {
        // PT -> FR -> IT
        // PT->ES->FR (3 nodes) + FR->IT (2 nodes) -> join at FR
        // Expected: PT, ES, FR, IT
        const path = findMultiStagePath(["PT", "FR", "IT"], EUROPE_GRAPH);
        expect(path).toEqual(["PT", "ES", "FR", "IT"]);
    });

    it("should handle start=end segments", () => {
        // PT -> PT -> ES
        // Should just be PT -> ES
        const path = findMultiStagePath(["PT", "PT", "ES"], EUROPE_GRAPH);
        expect(path).toEqual(["PT", "ES"]);
    });

    it("should return empty if any segment is unreachable", () => {
        // Mock Graph with isolated node
        // Mock Graph with isolated node
        // Mock Graph with isolated node
        const MOCK_GRAPH: Record<string, GraphNode> = {
            A: { id: "A", name: "Mock A", neighbors: [{ target: "B", type: "LAND" }] } as GraphNode,
            B: { id: "B", name: "Mock B", neighbors: [{ target: "A", type: "LAND" }] } as GraphNode,
            C: { id: "C", name: "Mock C", neighbors: [] } as GraphNode, // Isolated
        };

        // A -> C (Unreachable)
        const path = findMultiStagePath(["A", "C"], MOCK_GRAPH);
        expect(path).toEqual([]);
    });
});
