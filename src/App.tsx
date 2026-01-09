import "./app.scss";
import GeoMap from "./map/GeoMap.tsx";

const europeMapSrc = "src/assets/europe.topojson";

function App() {
    return (
        <div className="main">
            <GeoMap mapSrc={europeMapSrc} />
        </div>
    );
}

export default App;
