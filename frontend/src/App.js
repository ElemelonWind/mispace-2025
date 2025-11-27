import React, { useState } from "react";
import IceMap from "./IceMap";
import "./index.css";

function App() {
  const [day, setDay] = useState(0);

  return (
    <div className="container">
      <div className="mapPanel">
        <IceMap day={day} />
      </div>

      <div className="controlPanel">
        <h2>Great Lakes Ice Forecast</h2>

        <label>Forecast Day: {day}</label>
        <input
          type="range"
          min="0"
          max="3"
          value={day}
          onChange={(e) => setDay(Number(e.target.value))}
        />

        <h3>Narrative</h3>
        <p>
          This visualization shows ice concentration forecasts generated using
          satellite SAR imagery, weather predictions, and a heuristic
          thermodynamic-drift model.  
          Ice is shown in blue, with deeper colors indicating higher
          concentration. Shipping lanes are marked in red.
        </p>

        <p>
          Day {day}:  
          {day === 0 && "Observed ice concentration from most recent SAR pass."}
          {day === 1 && "Light growth expected due to sub-freezing temperatures."}
          {day === 2 && "Westward drift increases due to stronger NW winds."}
          {day === 3 && "Some melting observed where temps exceed freezing."}
        </p>
      </div>
    </div>
  );
}

export default App;
