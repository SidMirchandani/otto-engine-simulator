import React, { useState, useEffect, useRef } from 'react';

const OttoEngineSimulator = () => {
  const [cycle, setCycle] = useState(0); // 0: Intake, 1: Compression, 2: Power, 3: Exhaust
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(1); // 1-5 speed multiplier
  const [crankAngle, setCrankAngle] = useState(0);
  const canvasRef = useRef(null);
  
  const cycleNames = ["Intake Stroke", "Compression Stroke", "Power Stroke", "Exhaust Stroke"];
  const cycleDescriptions = [
    "Air-fuel mixture enters the cylinder as the piston moves down.",
    "The Piston moves upward, compressing the air-fuel mixture.",
    "The Spark plug ignites the compressed mixture, forcing the piston down.",
    "The Piston moves up, pushing exhaust gases out of the cylinder."
  ];

  const toggleEngine = () => {
    setIsRunning(!isRunning);
  };

  const rotateManually = (angle) => {
    if (!isRunning) {
      setCrankAngle((prev) => {
        const newAngle = (prev + angle + 720) % 720;
        setCycle(Math.floor(newAngle / 180) % 4);
        return newAngle;
      });
    }
  };

  const containerStyle = {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    background: 'linear-gradient(135deg, #2c3e50, #3498db)',
    borderRadius: '10px',
    color: '#fff'
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '24px'
  };

  const titleStyle = {
    fontSize: '32px',
    fontWeight: 'bold',
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const contentContainerStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    marginBottom: '20px'
  };

  const leftColumnStyle = {
    flex: '1',
    minWidth: '280px',
    background: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    textAlign: 'center'
  };

  const canvasStyle = {
    border: '1px solid #ddd',
    display: 'block',
    margin: '0 auto',
    borderRadius: '4px'
  };

  const rightColumnStyle = {
    flex: '1',
    minWidth: '280px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  };

  // Swapping order: Controls first, then Cycle Info
  const controlsContainerStyle = {
    background: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '8px',
    padding: '16px'
  };

  const cycleInfoStyle = {
    background: 'rgba(52, 152, 219, 0.2)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '8px',
    padding: '16px'
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>⚙️ Otto Engine Simulator</h1>
        <p>Interactive simulation of the four-stroke internal combustion engine cycle</p>
      </div>
      
      <div style={contentContainerStyle}>
        {/* Left column - Engine visualization */}
        <div style={leftColumnStyle}>
          <canvas ref={canvasRef} width="200" height="320" style={canvasStyle} />
        </div>
        
        {/* Right column - Controls and Info */}
        <div style={rightColumnStyle}>
          {/* Engine Controls (now above cycle information) */}
          <div style={controlsContainerStyle}>
            <h2>🎮 Engine Controls</h2>
            <button 
              onClick={toggleEngine}
              style={{
                padding: '10px',
                background: isRunning ? '#e74c3c' : '#2ecc71',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px',
                width: '100%',
                marginBottom: '16px',
                fontWeight: 'bold'
              }}
            >
              {isRunning ? 'Stop Engine' : 'Start Engine'}
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '16px 0' }}>
              <span style={{ fontWeight: 'bold' }}>Speed:</span>
              <input 
                type="range" 
                min="1" 
                max="5" 
                value={speed} 
                onChange={(e) => setSpeed(parseInt(e.target.value))}
                disabled={!isRunning}
              />
              <span style={{
                background: 'rgba(255, 255, 255, 0.2)',
                padding: '3px 8px',
                borderRadius: '3px'
              }}>
                {speed}x
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', margin: '16px 0' }}>
              <button onClick={() => rotateManually(-15)} disabled={isRunning}>-15°</button>
              <button onClick={() => rotateManually(-90)} disabled={isRunning}>-90°</button>
              <button onClick={() => rotateManually(90)} disabled={isRunning}>+90°</button>
              <button onClick={() => rotateManually(15)} disabled={isRunning}>+15°</button>
            </div>
          </div>

          {/* Cycle Information (moved below Engine Controls) */}
          <div style={cycleInfoStyle}>
            <h2>{cycleNames[cycle]}</h2>
            <p>{cycleDescriptions[cycle]}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OttoEngineSimulator;
