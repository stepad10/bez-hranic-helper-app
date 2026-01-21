import { CountryId } from '../types/game';

interface Connection {
    target: CountryId;
    type: 'LAND' | 'SEA';
}

export interface GraphNode {
    id: CountryId;
    name: string;
    neighbors: Connection[];
    isIsland?: boolean;
}

export const EUROPE_GRAPH: Record<CountryId, GraphNode> = {
    AL: { id: "AL", name: "Albania", neighbors: [{ target: "ME", type: "LAND" }, { target: "XK", type: "LAND" }, { target: "MK", type: "LAND" }, { target: "GR", type: "LAND" }] },
    AD: { id: "AD", name: "Andorra", neighbors: [{ target: "FR", type: "LAND" }, { target: "ES", type: "LAND" }] },
    AM: { id: "AM", name: "Armenia", neighbors: [{ target: "GE", type: "LAND" }, { target: "AZ", type: "LAND" }, { target: "TR", type: "LAND" }] },
    AT: { id: "AT", name: "Austria", neighbors: [{ target: "DE", type: "LAND" }, { target: "CZ", type: "LAND" }, { target: "SK", type: "LAND" }, { target: "HU", type: "LAND" }, { target: "SI", type: "LAND" }, { target: "IT", type: "LAND" }, { target: "CH", type: "LAND" }, { target: "LI", type: "LAND" }] },
    AZ: { id: "AZ", name: "Azerbaijan", neighbors: [{ target: "RU", type: "LAND" }, { target: "GE", type: "LAND" }, { target: "AM", type: "LAND" }] },
    BY: { id: "BY", name: "Belarus", neighbors: [{ target: "LV", type: "LAND" }, { target: "LT", type: "LAND" }, { target: "PL", type: "LAND" }, { target: "UA", type: "LAND" }, { target: "RU", type: "LAND" }] },
    BE: { id: "BE", name: "Belgium", neighbors: [{ target: "FR", type: "LAND" }, { target: "LU", type: "LAND" }, { target: "DE", type: "LAND" }, { target: "NL", type: "LAND" }, { target: "GB", type: "SEA" }] },
    BA: { id: "BA", name: "Bosnia and Herzegovina", neighbors: [{ target: "HR", type: "LAND" }, { target: "RS", type: "LAND" }, { target: "ME", type: "LAND" }] },
    BG: { id: "BG", name: "Bulgaria", neighbors: [{ target: "RO", type: "LAND" }, { target: "RS", type: "LAND" }, { target: "MK", type: "LAND" }, { target: "GR", type: "LAND" }, { target: "TR", type: "LAND" }] },
    HR: { id: "HR", name: "Croatia", neighbors: [{ target: "SI", type: "LAND" }, { target: "HU", type: "LAND" }, { target: "RS", type: "LAND" }, { target: "BA", type: "LAND" }, { target: "ME", type: "LAND" }] },
    CY: { id: "CY", name: "Cyprus", neighbors: [{ target: "TR", type: "SEA" }], isIsland: true },
    CZ: { id: "CZ", name: "Czech Republic", neighbors: [{ target: "DE", type: "LAND" }, { target: "PL", type: "LAND" }, { target: "SK", type: "LAND" }, { target: "AT", type: "LAND" }] },
    DK: { id: "DK", name: "Denmark", neighbors: [{ target: "DE", type: "LAND" }, { target: "SE", type: "SEA" }] },
    EE: { id: "EE", name: "Estonia", neighbors: [{ target: "LV", type: "LAND" }, { target: "RU", type: "LAND" }] },
    FI: { id: "FI", name: "Finland", neighbors: [{ target: "SE", type: "LAND" }, { target: "NO", type: "LAND" }, { target: "RU", type: "LAND" }] },
    FR: { id: "FR", name: "France", neighbors: [{ target: "BE", type: "LAND" }, { target: "LU", type: "LAND" }, { target: "DE", type: "LAND" }, { target: "CH", type: "LAND" }, { target: "IT", type: "LAND" }, { target: "MC", type: "LAND" }, { target: "ES", type: "LAND" }, { target: "AD", type: "LAND" }, { target: "GB", type: "SEA" }] },
    GE: { id: "GE", name: "Georgia", neighbors: [{ target: "RU", type: "LAND" }, { target: "AZ", type: "LAND" }, { target: "AM", type: "LAND" }, { target: "TR", type: "LAND" }] },
    DE: { id: "DE", name: "Germany", neighbors: [{ target: "DK", type: "LAND" }, { target: "PL", type: "LAND" }, { target: "CZ", type: "LAND" }, { target: "AT", type: "LAND" }, { target: "CH", type: "LAND" }, { target: "FR", type: "LAND" }, { target: "LU", type: "LAND" }, { target: "BE", type: "LAND" }, { target: "NL", type: "LAND" }] },
    GR: { id: "GR", name: "Greece", neighbors: [{ target: "AL", type: "LAND" }, { target: "MK", type: "LAND" }, { target: "BG", type: "LAND" }, { target: "TR", type: "LAND" }, { target: "MT", type: "SEA" }] },
    HU: { id: "HU", name: "Hungary", neighbors: [{ target: "AT", type: "LAND" }, { target: "SK", type: "LAND" }, { target: "UA", type: "LAND" }, { target: "RO", type: "LAND" }, { target: "RS", type: "LAND" }, { target: "HR", type: "LAND" }, { target: "SI", type: "LAND" }] },
    IS: { id: "IS", name: "Iceland", neighbors: [{ target: "IE", type: "SEA" }, { target: "GB", type: "SEA" }, { target: "NO", type: "SEA" }], isIsland: true },
    IE: { id: "IE", name: "Ireland", neighbors: [{ target: "GB", type: "LAND" }, { target: "IS", type: "SEA" }] },
    IT: { id: "IT", name: "Italy", neighbors: [{ target: "FR", type: "LAND" }, { target: "CH", type: "LAND" }, { target: "AT", type: "LAND" }, { target: "SI", type: "LAND" }, { target: "SM", type: "LAND" }, { target: "VA", type: "LAND" }, { target: "MT", type: "SEA" }] },
    XK: { id: "XK", name: "Kosovo", neighbors: [{ target: "ME", type: "LAND" }, { target: "RS", type: "LAND" }, { target: "MK", type: "LAND" }, { target: "AL", type: "LAND" }] },
    LV: { id: "LV", name: "Latvia", neighbors: [{ target: "EE", type: "LAND" }, { target: "LT", type: "LAND" }, { target: "BY", type: "LAND" }, { target: "RU", type: "LAND" }] },
    LI: { id: "LI", name: "Liechtenstein", neighbors: [{ target: "CH", type: "LAND" }, { target: "AT", type: "LAND" }] },
    LT: { id: "LT", name: "Lithuania", neighbors: [{ target: "LV", type: "LAND" }, { target: "BY", type: "LAND" }, { target: "PL", type: "LAND" }, { target: "RU", type: "LAND" }] },
    LU: { id: "LU", name: "Luxembourg", neighbors: [{ target: "BE", type: "LAND" }, { target: "DE", type: "LAND" }, { target: "FR", type: "LAND" }] },
    MT: { id: "MT", name: "Malta", neighbors: [{ target: "IT", type: "SEA" }, { target: "GR", type: "SEA" }], isIsland: true },
    MD: { id: "MD", name: "Moldova", neighbors: [{ target: "RO", type: "LAND" }, { target: "UA", type: "LAND" }] },
    MC: { id: "MC", name: "Monaco", neighbors: [{ target: "FR", type: "LAND" }] },
    ME: { id: "ME", name: "Montenegro", neighbors: [{ target: "HR", type: "LAND" }, { target: "BA", type: "LAND" }, { target: "RS", type: "LAND" }, { target: "XK", type: "LAND" }, { target: "AL", type: "LAND" }] },
    NL: { id: "NL", name: "Netherlands", neighbors: [{ target: "BE", type: "LAND" }, { target: "DE", type: "LAND" }, { target: "GB", type: "SEA" }] },
    MK: { id: "MK", name: "North Macedonia", neighbors: [{ target: "XK", type: "LAND" }, { target: "RS", type: "LAND" }, { target: "BG", type: "LAND" }, { target: "GR", type: "LAND" }, { target: "AL", type: "LAND" }] },
    NO: { id: "NO", name: "Norway", neighbors: [{ target: "SE", type: "LAND" }, { target: "FI", type: "LAND" }, { target: "RU", type: "LAND" }, { target: "IS", type: "SEA" }] },
    PL: { id: "PL", name: "Poland", neighbors: [{ target: "DE", type: "LAND" }, { target: "CZ", type: "LAND" }, { target: "SK", type: "LAND" }, { target: "UA", type: "LAND" }, { target: "BY", type: "LAND" }, { target: "LT", type: "LAND" }, { target: "RU", type: "LAND" }] },
    PT: { id: "PT", name: "Portugal", neighbors: [{ target: "ES", type: "LAND" }] },
    RO: { id: "RO", name: "Romania", neighbors: [{ target: "UA", type: "LAND" }, { target: "MD", type: "LAND" }, { target: "BG", type: "LAND" }, { target: "RS", type: "LAND" }, { target: "HU", type: "LAND" }] },
    RU: { id: "RU", name: "Russia", neighbors: [{ target: "NO", type: "LAND" }, { target: "FI", type: "LAND" }, { target: "EE", type: "LAND" }, { target: "LV", type: "LAND" }, { target: "LT", type: "LAND" }, { target: "PL", type: "LAND" }, { target: "BY", type: "LAND" }, { target: "UA", type: "LAND" }, { target: "GE", type: "LAND" }, { target: "AZ", type: "LAND" }] },
    SM: { id: "SM", name: "San Marino", neighbors: [{ target: "IT", type: "LAND" }] },
    RS: { id: "RS", name: "Serbia", neighbors: [{ target: "HU", type: "LAND" }, { target: "RO", type: "LAND" }, { target: "BG", type: "LAND" }, { target: "MK", type: "LAND" }, { target: "XK", type: "LAND" }, { target: "ME", type: "LAND" }, { target: "BA", type: "LAND" }, { target: "HR", type: "LAND" }] },
    SK: { id: "SK", name: "Slovakia", neighbors: [{ target: "CZ", type: "LAND" }, { target: "PL", type: "LAND" }, { target: "UA", type: "LAND" }, { target: "HU", type: "LAND" }, { target: "AT", type: "LAND" }] },
    SI: { id: "SI", name: "Slovenia", neighbors: [{ target: "IT", type: "LAND" }, { target: "AT", type: "LAND" }, { target: "HU", type: "LAND" }, { target: "HR", type: "LAND" }] },
    ES: { id: "ES", name: "Spain", neighbors: [{ target: "PT", type: "LAND" }, { target: "FR", type: "LAND" }, { target: "AD", type: "LAND" }] },
    SE: { id: "SE", name: "Sweden", neighbors: [{ target: "NO", type: "LAND" }, { target: "FI", type: "LAND" }, { target: "DK", type: "SEA" }] },
    CH: { id: "CH", name: "Switzerland", neighbors: [{ target: "FR", type: "LAND" }, { target: "DE", type: "LAND" }, { target: "AT", type: "LAND" }, { target: "LI", type: "LAND" }, { target: "IT", type: "LAND" }] },
    TR: { id: "TR", name: "Turkey", neighbors: [{ target: "GR", type: "LAND" }, { target: "BG", type: "LAND" }, { target: "GE", type: "LAND" }, { target: "AM", type: "LAND" }, { target: "CY", type: "SEA" }] },
    UA: { id: "UA", name: "Ukraine", neighbors: [{ target: "PL", type: "LAND" }, { target: "SK", type: "LAND" }, { target: "HU", type: "LAND" }, { target: "RO", type: "LAND" }, { target: "MD", type: "LAND" }, { target: "BY", type: "LAND" }, { target: "RU", type: "LAND" }] },
    GB: { id: "GB", name: "United Kingdom", neighbors: [{ target: "IE", type: "LAND" }, { target: "FR", type: "SEA" }, { target: "BE", type: "SEA" }, { target: "NL", type: "SEA" }, { target: "IS", type: "SEA" }], isIsland: true },
    VA: { id: "VA", name: "Vatican City", neighbors: [{ target: "IT", type: "LAND" }] },
};
