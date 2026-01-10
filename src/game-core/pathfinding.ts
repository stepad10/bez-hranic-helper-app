import { CountryId } from '../types/game';
import { GraphNode } from '../data/europeGraph';

export function findShortestPath(
    startId: CountryId,
    endId: CountryId,
    graph: Record<CountryId, GraphNode>
): CountryId[] {
    if (startId === endId) return [startId];

    const queue: CountryId[][] = [[startId]];
    const visited = new Set<CountryId>([startId]);

    while (queue.length > 0) {
        const path = queue.shift()!;
        const currentId = path[path.length - 1];

        if (currentId === endId) {
            return path;
        }

        const neighbors = graph[currentId]?.neighbors || [];
        for (const neighbor of neighbors) {
            if (!visited.has(neighbor.target)) {
                visited.add(neighbor.target);
                queue.push([...path, neighbor.target]);
            }
        }
    }

    return []; // No path found
}

/**
 * Finds the shortest path visiting valid waypoints in order.
 * Useful for calculating complex journey costs.
 */
export function findMultiStagePath(
    stops: CountryId[],
    graph: Record<CountryId, GraphNode>
): CountryId[] {
    if (stops.length < 2) return stops;

    let fullPath: CountryId[] = [];

    for (let i = 0; i < stops.length - 1; i++) {
        const start = stops[i];
        const end = stops[i + 1];
        const segment = findShortestPath(start, end, graph);

        if (segment.length === 0) return []; // Broken path

        // Avoid duplicating the joining node (end of segment k is start of segment k+1)
        if (i === 0) {
            fullPath = fullPath.concat(segment);
        } else {
            fullPath = fullPath.concat(segment.slice(1));
        }
    }

    return fullPath;
}

export interface JourneyCost {
    total: number;
    breakdown: {
        borders: number;
        neighbors: number;
    };
}

export function calculateJourneyCost(
    path: CountryId[],
    graph: Record<CountryId, GraphNode>
): JourneyCost {
    if (path.length === 0) return { total: 0, breakdown: { borders: 0, neighbors: 0 } };

    const startId = path[0];
    const endId = path[path.length - 1];

    // Rule 1: 10 euros per border crossing.
    // Path length of N countries means N-1 border crossings.
    const borderCrossings = Math.max(0, path.length - 1);
    const borderCost = borderCrossings * 10;

    // Rule 2: Neighbor penalty.
    // If the destination directly borders the start, +30 surcharge.
    // "Countries connected by a sea line are also considered neighbors."
    const startNode = graph[startId];
    const isDirectNeighbor = startNode?.neighbors.some(n => n.target === endId);

    const neighborCost = isDirectNeighbor ? 30 : 0;

    return {
        total: borderCost + neighborCost,
        breakdown: {
            borders: borderCost,
            neighbors: neighborCost,
        }
    };
}
