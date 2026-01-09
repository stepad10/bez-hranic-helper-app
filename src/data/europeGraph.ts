import { CountryId } from '../types/game';

interface Connection {
    target: CountryId;
    type: 'LAND' | 'SEA'; // Sea connections count as 1 border but might be visualized differently
}

export interface GraphNode {
    id: CountryId;
    name: string;
    neighbors: Connection[];
    // Metadata
    isIsland?: boolean;
}

export const EUROPE_GRAPH: Record<CountryId, GraphNode> = {
    // Initial partial data based on rules examples & common sense for testing
    // Will need to be populated fully from the map/rulebook
    'FR': {
        id: 'FR',
        name: 'France',
        neighbors: [
            { target: 'GB', type: 'SEA' }, // Rule: Neighbors despite sea
            { target: 'BE', type: 'LAND' },
            { target: 'DE', type: 'LAND' },
            { target: 'CH', type: 'LAND' },
            { target: 'IT', type: 'LAND' },
            { target: 'ES', type: 'LAND' },
            { target: 'MC', type: 'LAND' }, // Monaco check
        ]
    },
    'GB': {
        id: 'GB',
        name: 'Great Britain',
        neighbors: [
            { target: 'FR', type: 'SEA' },
            { target: 'IE', type: 'LAND' }, // Northern Ireland
            { target: 'NL', type: 'SEA' }, // Direct sea connection implied by rules examples? 
            // example in rules says: "Great Britain borders both France and the Netherlands" (blue player example)
            // So yes, GB-NL is a neighbor relation.
            { target: 'BE', type: 'SEA' }, // Usually sea neighbors in these games
        ]
    },
    'NL': {
        id: 'NL',
        name: 'Netherlands',
        neighbors: [
            { target: 'DE', type: 'LAND' },
            { target: 'BE', type: 'LAND' },
            { target: 'GB', type: 'SEA' },
        ]
    },
    'BE': {
        id: 'BE',
        name: 'Belgium',
        neighbors: [
            { target: 'FR', type: 'LAND' },
            { target: 'NL', type: 'LAND' },
            { target: 'DE', type: 'LAND' },
            { target: 'LU', type: 'LAND' },
            { target: 'GB', type: 'SEA' },
        ]
    },
    'MC': { // Monaco
        id: 'MC',
        name: 'Monaco',
        neighbors: [
            { target: 'FR', type: 'LAND' }
            // Completely surrounded by France, does NOT border Italy per rules
        ]
    },
    'IT': {
        id: 'IT',
        name: 'Italy',
        neighbors: [
            { target: 'FR', type: 'LAND' },
            { target: 'CH', type: 'LAND' },
            { target: 'AT', type: 'LAND' },
            { target: 'SI', type: 'LAND' },
            // Sea connections
            { target: 'MT', type: 'SEA' }, // Malta
            { target: 'GR', type: 'SEA' }, // Greece (via sea)
        ]
    },
    'MT': {
        id: 'MT',
        name: 'Malta',
        neighbors: [
            { target: 'IT', type: 'SEA' },
            { target: 'GR', type: 'SEA' }, // Rule: Greece borders Malta
        ]
    },
    'GR': {
        id: 'GR',
        name: 'Greece',
        neighbors: [
            { target: 'IT', type: 'SEA' },
            { target: 'MT', type: 'SEA' },
            { target: 'TR', type: 'LAND' }, // Turkey
            { target: 'BG', type: 'LAND' },
            { target: 'MK', type: 'LAND' },
            { target: 'AL', type: 'LAND' },
        ]
    }
    // TODO: Fill rest of Europe
};

export const getNeighbors = (id: CountryId): Connection[] => {
    return EUROPE_GRAPH[id]?.neighbors || [];
};
