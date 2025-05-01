import { AdjacencyList, EuropeCountry } from "./europe-variables.ts";

function dijkstraShortestPath(start: EuropeCountry, end: EuropeCountry, adjList: AdjacencyList): EuropeCountry[] {
    const distances: Record<EuropeCountry, number> = {} as Record<EuropeCountry, number>;
    const previous: Record<EuropeCountry, EuropeCountry | null> = {} as Record<EuropeCountry, EuropeCountry | null>;
    const queue: EuropeCountry[] = [];

    for (const country in adjList) {
        distances[country as EuropeCountry] = Infinity;
        previous[country as EuropeCountry] = null;
        queue.push(country as EuropeCountry);
    }

    distances[start] = 0;

    while (queue.length > 0) {
        queue.sort((a, b) => distances[a] - distances[b]);
        const current = queue.shift()!;

        if (current === end) {
            const path: EuropeCountry[] = [];
            let step: EuropeCountry | null = end;
            while (step) {
                path.unshift(step);
                step = previous[step];
            }
            return path;
        }

        for (const neighbor of adjList[current]) {
            const alt = distances[current] + 1;
            if (alt < distances[neighbor]) {
                distances[neighbor] = alt;
                previous[neighbor] = current;
            }
        }
    }

    return [];
}

export function findShortestPath(countriesToVisit: EuropeCountry[], adjList: AdjacencyList): EuropeCountry[] {
    if (countriesToVisit.length < 2) return countriesToVisit;

    let shortestPath: EuropeCountry[] = [];
    for (let i = 0; i < countriesToVisit.length - 1; i++) {
        const pathSegment = dijkstraShortestPath(countriesToVisit[i], countriesToVisit[i + 1], adjList);
        if (pathSegment.length === 0) return [];
        shortestPath = shortestPath.concat(pathSegment.slice(0, -1));
    }
    shortestPath.push(countriesToVisit[countriesToVisit.length - 1]);

    return shortestPath;
}
