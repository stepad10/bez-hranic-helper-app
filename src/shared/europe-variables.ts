export type EuropeCountry =
    | "albania"
    | "andorra"
    | "armenia"
    | "austria"
    | "azerbaijan"
    | "belarus"
    | "belgium"
    | "bosnia_and_herzegovina"
    | "bulgaria"
    | "croatia"
    | "cyprus"
    | "czech_republic"
    | "denmark"
    | "estonia"
    | "finland"
    | "france"
    | "georgia"
    | "germany"
    | "greece"
    | "hungary"
    | "iceland"
    | "ireland"
    | "italy"
    | "kazakhstan"
    | "kosovo"
    | "latvia"
    | "liechtenstein"
    | "lithuania"
    | "luxembourg"
    | "malta"
    | "moldova"
    | "monaco"
    | "montenegro"
    | "netherlands"
    | "north_macedonia"
    | "norway"
    | "poland"
    | "portugal"
    | "romania"
    | "russia"
    | "san_marino"
    | "serbia"
    | "slovakia"
    | "slovenia"
    | "spain"
    | "sweden"
    | "switzerland"
    | "turkey"
    | "ukraine"
    | "united_kingdom"
    | "vatican_city";

interface CountryType {
    id: EuropeCountry;
    name: string;
}

export type AdjacencyList = Record<EuropeCountry, EuropeCountry[]>;

export const europe_countries: CountryType[] = [
    { id: "albania", name: "Albania" },
    { id: "andorra", name: "Andorra" },
    { id: "armenia", name: "Armenia" },
    { id: "austria", name: "Austria" },
    { id: "azerbaijan", name: "Azerbaijan" },
    { id: "belarus", name: "Belarus" },
    { id: "belgium", name: "Belgium" },
    { id: "bosnia_and_herzegovina", name: "Bosnia and Herzegovina" },
    { id: "bulgaria", name: "Bulgaria" },
    { id: "croatia", name: "Croatia" },
    { id: "cyprus", name: "Cyprus" },
    { id: "czech_republic", name: "Czech Republic" },
    { id: "denmark", name: "Denmark" },
    { id: "estonia", name: "Estonia" },
    { id: "finland", name: "Finland" },
    { id: "france", name: "France" },
    { id: "georgia", name: "Georgia" },
    { id: "germany", name: "Germany" },
    { id: "greece", name: "Greece" },
    { id: "hungary", name: "Hungary" },
    { id: "iceland", name: "Iceland" },
    { id: "ireland", name: "Ireland" },
    { id: "italy", name: "Italy" },
    { id: "kazakhstan", name: "Kazakhstan" },
    { id: "kosovo", name: "Kosovo" },
    { id: "latvia", name: "Latvia" },
    { id: "liechtenstein", name: "Liechtenstein" },
    { id: "lithuania", name: "Lithuania" },
    { id: "luxembourg", name: "Luxembourg" },
    { id: "malta", name: "Malta" },
    { id: "moldova", name: "Moldova" },
    { id: "monaco", name: "Monaco" },
    { id: "montenegro", name: "Montenegro" },
    { id: "netherlands", name: "Netherlands" },
    { id: "north_macedonia", name: "North Macedonia" },
    { id: "norway", name: "Norway" },
    { id: "poland", name: "Poland" },
    { id: "portugal", name: "Portugal" },
    { id: "romania", name: "Romania" },
    { id: "russia", name: "Russia" },
    { id: "san_marino", name: "San Marino" },
    { id: "serbia", name: "Serbia" },
    { id: "slovakia", name: "Slovakia" },
    { id: "slovenia", name: "Slovenia" },
    { id: "spain", name: "Spain" },
    { id: "sweden", name: "Sweden" },
    { id: "switzerland", name: "Switzerland" },
    { id: "turkey", name: "Turkey" },
    { id: "ukraine", name: "Ukraine" },
    { id: "united_kingdom", name: "United Kingdom" },
    { id: "vatican_city", name: "Vatican City" },
];

export const europe_countries_adj_list: AdjacencyList = {
    albania: ["montenegro", "kosovo", "north_macedonia", "greece"],
    andorra: ["france", "spain"],
    armenia: ["georgia", "azerbaijan", "turkey"],
    austria: ["germany", "czech_republic", "slovakia", "hungary", "slovenia", "italy", "switzerland", "liechtenstein"],
    azerbaijan: ["russia", "georgia", "armenia"],
    belarus: ["latvia", "lithuania", "poland", "ukraine", "russia"],
    belgium: ["france", "luxembourg", "germany", "netherlands"],
    bosnia_and_herzegovina: ["croatia", "serbia", "montenegro"],
    bulgaria: ["romania", "serbia", "north_macedonia", "greece", "turkey"],
    croatia: ["slovenia", "hungary", "serbia", "bosnia_and_herzegovina", "montenegro"],
    cyprus: [],
    czech_republic: ["germany", "poland", "slovakia", "austria"],
    denmark: ["germany"],
    estonia: ["latvia"],
    finland: ["sweden", "norway", "russia"],
    france: ["belgium", "luxembourg", "germany", "switzerland", "italy", "monaco", "spain", "andorra"],
    georgia: ["russia", "azerbaijan", "armenia", "turkey"],
    germany: ["denmark", "poland", "czech_republic", "austria", "switzerland", "france", "luxembourg", "belgium", "netherlands"],
    greece: ["albania", "north_macedonia", "bulgaria", "turkey"],
    hungary: ["austria", "slovakia", "ukraine", "romania", "serbia", "croatia", "slovenia"],
    iceland: [],
    ireland: ["united_kingdom"],
    italy: ["france", "switzerland", "austria", "slovenia", "san_marino", "vatican_city"],
    kazakhstan: [],
    kosovo: ["montenegro", "serbia", "north_macedonia", "albania"],
    latvia: ["estonia", "lithuania", "belarus"],
    liechtenstein: ["switzerland", "austria"],
    lithuania: ["latvia", "belarus", "poland"],
    luxembourg: ["belgium", "germany", "france"],
    malta: [],
    moldova: ["romania", "ukraine"],
    monaco: ["france"],
    montenegro: ["croatia", "bosnia_and_herzegovina", "serbia", "kosovo", "albania"],
    netherlands: ["belgium", "germany"],
    north_macedonia: ["kosovo", "serbia", "bulgaria", "greece", "albania"],
    norway: ["sweden", "finland", "russia"],
    poland: ["germany", "czech_republic", "slovakia", "ukraine", "belarus", "lithuania"],
    portugal: ["spain"],
    romania: ["ukraine", "moldova", "bulgaria", "serbia", "hungary"],
    russia: ["norway", "finland", "estonia", "latvia", "lithuania", "poland", "belarus", "ukraine", "georgia", "azerbaijan"],
    san_marino: ["italy"],
    serbia: ["hungary", "romania", "bulgaria", "north_macedonia", "kosovo", "montenegro", "bosnia_and_herzegovina", "croatia"],
    slovakia: ["czech_republic", "poland", "ukraine", "hungary", "austria"],
    slovenia: ["italy", "austria", "hungary", "croatia"],
    spain: ["portugal", "france", "andorra"],
    sweden: ["norway", "finland"],
    switzerland: ["france", "germany", "austria", "liechtenstein", "italy"],
    turkey: ["greece", "bulgaria", "georgia", "armenia"],
    ukraine: ["poland", "slovakia", "hungary", "romania", "moldova", "belarus", "russia"],
    united_kingdom: ["ireland"],
    vatican_city: ["italy"],
};
