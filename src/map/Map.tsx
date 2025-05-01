import { useState } from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";

const geoSrc = "src/assets/europe.topojson";

function Map(): JSX.Element {
    const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

    return (
        <div style={{ width: "50rem", height: "37.5rem", border: "1px solid black" }}>
            <ComposableMap>
                <ZoomableGroup>
                    <Geographies geography={geoSrc}>
                        {({ geographies }) =>
                            geographies.map((geo) => {
                                const isSelected = geo.id === selectedCountry;
                                return (
                                    <Geography
                                        key={geo.rsmKey}
                                        geography={geo}
                                        onClick={() => setSelectedCountry(geo.id)} // Update selected country on click
                                        style={{
                                            default: {
                                                fill: isSelected ? "#a8a8a8" : "#d6d6d6",
                                                outline: "none",
                                                stroke: "#7d7d7d", // Add black outline
                                                strokeWidth: 0.1, // Set outline width
                                            },
                                            hover: { fill: isSelected ? "#a8a8a8a8" : "#d6d6d6d6", outline: "none", stroke: "#7d7d7d", strokeWidth: 0.1 },
                                            pressed: { fill: "#E42", outline: "none", stroke: "#7d7d7d", strokeWidth: 0.1 },
                                        }}
                                    />
                                );
                            })
                        }
                    </Geographies>
                </ZoomableGroup>
            </ComposableMap>
        </div>
    );
}

export default Map;
