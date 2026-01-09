import { useState } from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup, Marker } from "react-simple-maps";
import { geoCentroid } from "d3-geo";

interface GeoMapProps {
    mapSrc: string;
}

function GeoMap({ mapSrc }: GeoMapProps) {
    const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

    // Calculate initial position to fit Europe in the view
    const initialPosition = {
        coordinates: [15, 50] as [number, number], // Center on Europe
        zoom: 1, // Initial zoom level to fit Europe
    };

    return (
        <div style={{ width: "80rem", height: "60rem", border: "1px solid black" }}>
            <ComposableMap projection="geoMercator" projectionConfig={{ scale: 550 }}>
                <ZoomableGroup center={initialPosition.coordinates} zoom={initialPosition.zoom}>
                    <Geographies geography={mapSrc}>
                        {({ geographies }) => (
                            <>
                                {geographies.map((geo) => {
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
                                })}

                                {/* Add ISO code labels */}
                                {geographies.map((geo) => {
                                    // Skip very small countries or territories that would make the map too cluttered
                                    const smallCountries = ["SM", "VA", "MC", "LI", "AD", "MT", "LU", "CY"];
                                    if (smallCountries.includes(geo.id)) return null;

                                    const centroid = geoCentroid(geo);
                                    // Use a fixed font size that scales with the map
                                    const fontSize = 0.65;

                                    return (
                                        <g key={`${geo.rsmKey}-label`}>
                                            <Marker coordinates={centroid}>
                                                <text
                                                    textAnchor="middle"
                                                    style={{
                                                        fontFamily: "Arial",
                                                        fontSize: `${fontSize}em`,
                                                        fontWeight: "bold",
                                                        fill: "#555",
                                                        pointerEvents: "none",
                                                        textShadow: "0px 0px 2px white",
                                                    }}
                                                >
                                                    {geo.id}
                                                </text>
                                            </Marker>
                                        </g>
                                    );
                                })}
                            </>
                        )}
                    </Geographies>
                </ZoomableGroup>
            </ComposableMap>
        </div>
    );
}

export default GeoMap;
