import { findShortestPath } from "./shared/tools.ts";
import { europe_countries_adj_list, EuropeCountry } from "./shared/europe-variables.ts";
import { ChangeEvent, useState } from "react";
import "./app.scss";
import Map from "./map/Map.tsx";

function App() {
    const [path, setPath] = useState<EuropeCountry[]>([]);
    const [from, setFrom] = useState<EuropeCountry | undefined>(undefined);
    const [visited, setVisited] = useState<EuropeCountry[]>([]);

    const handleCalculate = (): void => {
        if (!from || !visited.length) {
            return;
        }
        setPath(findShortestPath([from, ...visited], europe_countries_adj_list));
    };

    const handleCountrySelect = (event: ChangeEvent<HTMLSelectElement>): void => {
        setFrom(event.currentTarget.value as EuropeCountry);
    };

    const handleCountryMultiSelect = (event: ChangeEvent<HTMLSelectElement>): void => {
        const value = event.currentTarget.value as EuropeCountry;

        if (visited.includes(value)) {
            setVisited(visited.slice(visited.indexOf(value)));
        } else {
            setVisited([...visited, value]);
        }
    };

    return (
        <div className="main">
            <div style={{ marginBottom: "2rem" }}>
                <button type="button" className="button button-primary" onClick={handleCalculate}>
                    Calculate
                </button>
                <div>Total visited countries: {path.length}</div>
                <div>Path: {path.join(" - ")}</div>

                <div>
                    <label htmlFor="select-from">Select from country: </label>
                    <select id="select-from" value={from} onChange={handleCountrySelect}>
                        <option value={undefined}></option>
                        {Object.keys(europe_countries_adj_list).map((opt) => (
                            <option key={opt} value={opt}>
                                {opt}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="select-from">Select countries to visit: </label>
                    <select id="select-from" value={visited} multiple={true} onChange={handleCountryMultiSelect}>
                        <option value={undefined}></option>
                        {Object.keys(europe_countries_adj_list).map((opt) => (
                            <option key={opt} value={opt}>
                                {opt}
                            </option>
                        ))}
                    </select>
                    <br />
                    {visited.join(", ")}
                </div>
            </div>
            <Map />
        </div>
    );
}

export default App;
