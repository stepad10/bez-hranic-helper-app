/**
 * ISO Alpha-2 country codes for European countries
 */
export type EuropeCountry =
    | "AL" // Albania
    | "AD" // Andorra
    | "AM" // Armenia
    | "AT" // Austria
    | "AZ" // Azerbaijan
    | "BY" // Belarus
    | "BE" // Belgium
    | "BA" // Bosnia and Herzegovina
    | "BG" // Bulgaria
    | "HR" // Croatia
    | "CY" // Cyprus
    | "CZ" // Czech Republic
    | "DK" // Denmark
    | "EE" // Estonia
    | "FI" // Finland
    | "FR" // France
    | "GE" // Georgia
    | "DE" // Germany
    | "GR" // Greece
    | "HU" // Hungary
    | "IS" // Iceland
    | "IE" // Ireland
    | "IT" // Italy
    | "KZ" // Kazakhstan
    | "XK" // Kosovo (not officially ISO, but commonly used)
    | "LV" // Latvia
    | "LI" // Liechtenstein
    | "LT" // Lithuania
    | "LU" // Luxembourg
    | "MT" // Malta
    | "MD" // Moldova
    | "MC" // Monaco
    | "ME" // Montenegro
    | "NL" // Netherlands
    | "MK" // North Macedonia
    | "NO" // Norway
    | "PL" // Poland
    | "PT" // Portugal
    | "RO" // Romania
    | "RU" // Russia
    | "SM" // San Marino
    | "RS" // Serbia
    | "SK" // Slovakia
    | "SI" // Slovenia
    | "ES" // Spain
    | "SE" // Sweden
    | "CH" // Switzerland
    | "TR" // Turkey
    | "UA" // Ukraine
    | "GB" // United Kingdom
    | "VA"; // Vatican City

/**
 * Country information with ISO code and name
 */
interface CountryType {
    id: EuropeCountry;
    name: string;
}

export type AdjacencyList = Record<EuropeCountry, EuropeCountry[]>;

/**
 * List of European countries with ISO Alpha-2 codes and names
 */
export const europe_countries: CountryType[] = [
    { id: "AL", name: "Albania" },
    { id: "AD", name: "Andorra" },
    { id: "AM", name: "Armenia" },
    { id: "AT", name: "Austria" },
    { id: "AZ", name: "Azerbaijan" },
    { id: "BY", name: "Belarus" },
    { id: "BE", name: "Belgium" },
    { id: "BA", name: "Bosnia and Herzegovina" },
    { id: "BG", name: "Bulgaria" },
    { id: "HR", name: "Croatia" },
    { id: "CY", name: "Cyprus" },
    { id: "CZ", name: "Czech Republic" },
    { id: "DK", name: "Denmark" },
    { id: "EE", name: "Estonia" },
    { id: "FI", name: "Finland" },
    { id: "FR", name: "France" },
    { id: "GE", name: "Georgia" },
    { id: "DE", name: "Germany" },
    { id: "GR", name: "Greece" },
    { id: "HU", name: "Hungary" },
    { id: "IS", name: "Iceland" },
    { id: "IE", name: "Ireland" },
    { id: "IT", name: "Italy" },
    { id: "KZ", name: "Kazakhstan" },
    { id: "XK", name: "Kosovo" },
    { id: "LV", name: "Latvia" },
    { id: "LI", name: "Liechtenstein" },
    { id: "LT", name: "Lithuania" },
    { id: "LU", name: "Luxembourg" },
    { id: "MT", name: "Malta" },
    { id: "MD", name: "Moldova" },
    { id: "MC", name: "Monaco" },
    { id: "ME", name: "Montenegro" },
    { id: "NL", name: "Netherlands" },
    { id: "MK", name: "North Macedonia" },
    { id: "NO", name: "Norway" },
    { id: "PL", name: "Poland" },
    { id: "PT", name: "Portugal" },
    { id: "RO", name: "Romania" },
    { id: "RU", name: "Russia" },
    { id: "SM", name: "San Marino" },
    { id: "RS", name: "Serbia" },
    { id: "SK", name: "Slovakia" },
    { id: "SI", name: "Slovenia" },
    { id: "ES", name: "Spain" },
    { id: "SE", name: "Sweden" },
    { id: "CH", name: "Switzerland" },
    { id: "TR", name: "Turkey" },
    { id: "UA", name: "Ukraine" },
    { id: "GB", name: "United Kingdom" },
    { id: "VA", name: "Vatican City" },
];

/**
 * Adjacency list for European countries using ISO Alpha-2 codes
 */
export const europe_countries_adj_list: AdjacencyList = {
    AL: ["ME", "XK", "MK", "GR"],
    AD: ["FR", "ES"],
    AM: ["GE", "AZ", "TR"],
    AT: ["DE", "CZ", "SK", "HU", "SI", "IT", "CH", "LI"],
    AZ: ["RU", "GE", "AM"],
    BY: ["LV", "LT", "PL", "UA", "RU"],
    BE: ["FR", "LU", "DE", "NL"],
    BA: ["HR", "RS", "ME"],
    BG: ["RO", "RS", "MK", "GR", "TR"],
    HR: ["SI", "HU", "RS", "BA", "ME"],
    CY: [],
    CZ: ["DE", "PL", "SK", "AT"],
    DK: ["DE"],
    EE: ["LV"],
    FI: ["SE", "NO", "RU"],
    FR: ["BE", "LU", "DE", "CH", "IT", "MC", "ES", "AD"],
    GE: ["RU", "AZ", "AM", "TR"],
    DE: ["DK", "PL", "CZ", "AT", "CH", "FR", "LU", "BE", "NL"],
    GR: ["AL", "MK", "BG", "TR"],
    HU: ["AT", "SK", "UA", "RO", "RS", "HR", "SI"],
    IS: [],
    IE: ["GB"],
    IT: ["FR", "CH", "AT", "SI", "SM", "VA"],
    KZ: [],
    XK: ["ME", "RS", "MK", "AL"],
    LV: ["EE", "LT", "BY"],
    LI: ["CH", "AT"],
    LT: ["LV", "BY", "PL"],
    LU: ["BE", "DE", "FR"],
    MT: [],
    MD: ["RO", "UA"],
    MC: ["FR"],
    ME: ["HR", "BA", "RS", "XK", "AL"],
    NL: ["BE", "DE"],
    MK: ["XK", "RS", "BG", "GR", "AL"],
    NO: ["SE", "FI", "RU"],
    PL: ["DE", "CZ", "SK", "UA", "BY", "LT"],
    PT: ["ES"],
    RO: ["UA", "MD", "BG", "RS", "HU"],
    RU: ["NO", "FI", "EE", "LV", "LT", "PL", "BY", "UA", "GE", "AZ"],
    SM: ["IT"],
    RS: ["HU", "RO", "BG", "MK", "XK", "ME", "BA", "HR"],
    SK: ["CZ", "PL", "UA", "HU", "AT"],
    SI: ["IT", "AT", "HU", "HR"],
    ES: ["PT", "FR", "AD"],
    SE: ["NO", "FI"],
    CH: ["FR", "DE", "AT", "LI", "IT"],
    TR: ["GR", "BG", "GE", "AM"],
    UA: ["PL", "SK", "HU", "RO", "MD", "BY", "RU"],
    GB: ["IE"],
    VA: ["IT"],
};
