import React, { useState, useEffect, useRef } from 'react';

const OttoEngineSimulator = () => {
  const [cycle, setCycle] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [crankAngle, setCrankAngle] = useState(0);
  const canvasRef = useRef(null);
  
  const cycleNames = ["Intake Stroke", "Compression Stroke", "Power Stroke", "Exhaust Stroke"];
  const cycleDescriptions = [
    "Air-fuel mixture enters the cylinder as the piston moves down.",
    "Piston moves upward, compressing the air-fuel mixture.",
    "Spark plug ignites the compressed mixture, forcing the piston down.",
    "Piston moves up, pushing exhaust gases out of the cylinder."
  ];
  
  // Same animation and drawing logic...
  // (keeping your existing canvas drawing code)
  
  return (
    <div style={{maxWidth: "800px", margin: "0 auto", padding: "20px", fontFamily: "Arial, sans-serif"}}>
      <h1 style={{fontSize: "24px", fontWeight: "bold", marginBottom: "20px"}}>Otto Engine Simulator</h1>
      
      <div style={{display: "flex", flexWrap: "wrap", gap: "20px"}}>
        <div style={{flex: "1", minWidth: "300px", padding: "15px", backgroundColor: "white", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)"}}>
          <canvas 
            ref={canvasRef} 
            width="200" 
            height="320" 
            style={{border: "1px solid #ccc", display: "block", margin: "0 auto"}}
          />
        </div>
        
        <div style={{flex: "1", minWidth: "300px"}}>
          <div style={{padding: "15px", backgroundColor: "white", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", marginBottom: "20px"}}>
            <h2 style={{fontSize: "20px", fontWeight: "bold", marginBottom: "10px"}}>{cycleNames[cycle]}</h2>
            <p>{cycleDescriptions[cycle]}</p>
          </div>
          
          <div style={{padding: "15px", backgroundColor: "white", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)"}}>
            <h2 style={{fontSize: "20px", fontWeight: "bold", marginBottom: "10px"}}>Engine Controls</h2>
            <button 
              onClick={() => setIsRunning(!isRunning)}
              style={{
                padding: "8px 16px", 
                backgroundColor: isRunning ? "#dc2626" : "#16a34a", 
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                width: "100%",
                marginBottom: "10px"
              }}
            >
              {isRunning ? 'Stop Engine' : 'Start Engine'}
            </button>
            
            {/* Add the rest of your controls with inline styles */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OttoEngineSimulator;
