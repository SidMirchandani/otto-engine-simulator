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
  
  // Animation frame control
  useEffect(() => {
    let animationFrameId;
    let lastTimestamp = 0;
    const fps = 60;
    const interval = 1000 / fps;
    
    const animate = (timestamp) => {
      if (timestamp - lastTimestamp >= interval) {
        lastTimestamp = timestamp;
        
        if (isRunning) {
          // Update crank angle
          setCrankAngle((prev) => {
            const newAngle = (prev + 2 * speed) % 720;
            
            // Update cycle based on crank angle
            // Each cycle is 180 degrees
            const newCycle = Math.floor(newAngle / 180) % 4;
            if (newCycle !== cycle) {
              setCycle(newCycle);
            }
            
            return newAngle;
          });
        }
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isRunning, speed, cycle]);
  
  // Draw engine components
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Calculate piston position based on crank angle
    const crankRadius = 40;
    const conRodLength = 100;
    const pistonY = 150 - crankRadius * Math.cos(crankAngle * Math.PI / 180) - 
                   Math.sqrt(conRodLength ** 2 - (crankRadius * Math.sin(crankAngle * Math.PI / 180)) ** 2);
    
    // Draw cylinder
    ctx.fillStyle = "#ddd";
    ctx.fillRect(75, 50, 50, 150);
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 2;
    ctx.strokeRect(75, 50, 50, 150);
    
    // Draw cylinder interior
    ctx.fillStyle = "#eee";
    ctx.fillRect(80, 55, 40, 140);
    
    // Draw valves
    const intakeValveOpen = cycle === 0;
    const exhaustValveOpen = cycle === 3;
    
    // Intake valve (left)
    ctx.beginPath();
    ctx.arc(75, 60, 8, 0, Math.PI * 2);
    ctx.fillStyle = intakeValveOpen ? "#66f" : "#66a";
    ctx.fill();
    ctx.stroke();
    
    // Exhaust valve (right)
    ctx.beginPath();
    ctx.arc(125, 60, 8, 0, Math.PI * 2);
    ctx.fillStyle = exhaustValveOpen ? "#f66" : "#a66";
    ctx.fill();
    ctx.stroke();
    
    // Spark plug
    ctx.beginPath();
    ctx.arc(100, 55, 5, 0, Math.PI * 2);
    ctx.fillStyle = cycle === 2 && crankAngle % 180 < 20 ? "#ff0" : "#aaa";
    ctx.fill();
    ctx.stroke();
    
    // Draw piston
    ctx.fillStyle = "#888";
    ctx.fillRect(85, pistonY, 30, 20);
    ctx.strokeRect(85, pistonY, 30, 20);
    
    // Draw connecting rod
    ctx.beginPath();
    const crankX = 100 + crankRadius * Math.sin(crankAngle * Math.PI / 180);
    const crankY = 240 - crankRadius * Math.cos(crankAngle * Math.PI / 180);
    ctx.moveTo(100, pistonY + 20);
    ctx.lineTo(crankX, crankY);
    ctx.lineWidth = 4;
    ctx.stroke();
    
    // Draw crankshaft
    ctx.beginPath();
    ctx.arc(100, 240, crankRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#555";
    ctx.fill();
    ctx.stroke();
    
    // Draw crank
    ctx.beginPath();
    ctx.arc(crankX, crankY, 8, 0, Math.PI * 2);
    ctx.fillStyle = "#777";
    ctx.fill();
    ctx.stroke();
    
    // Draw air-fuel mixture or exhaust gas
    if (cycle === 0 || cycle === 1) {
      // Draw fuel mixture dots
      ctx.fillStyle = cycle === 0 ? "#adf" : "#89c";
      for (let i = 0; i < 20; i++) {
        const dotX = 85 + Math.random() * 30;
        const dotY = 55 + Math.random() * (pistonY - 55);
        const size = 1 + Math.random() * 2;
        ctx.beginPath();
        ctx.arc(dotX, dotY, size, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (cycle === 2) {
      // Draw combustion
      const gradient = ctx.createRadialGradient(100, 100, 0, 100, 100, 40);
      gradient.addColorStop(0, "rgba(255, 200, 0, 0.7)");
      gradient.addColorStop(1, "rgba(255, 0, 0, 0.1)");
      ctx.fillStyle = gradient;
      ctx.fillRect(80, 55, 40, pistonY - 55);
    } else if (cycle === 3) {
      // Draw exhaust smoke
      ctx.fillStyle = "#9995";
      for (let i = 0; i < 15; i++) {
        const dotX = 85 + Math.random() * 30;
        const dotY = 55 + Math.random() * (pistonY - 55);
        const size = 2 + Math.random() * 3;
        ctx.beginPath();
        ctx.arc(dotX, dotY, size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    // Draw crank angle text
    ctx.fillStyle = "#000";
    ctx.font = "12px Arial";
    ctx.fillText(`Crank Angle: ${Math.round(crankAngle)}°`, 20, 300);
  }, [crankAngle, cycle]);

  const toggleEngine = () => {
    setIsRunning(!isRunning);
  };

  // Manual control when not running
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
    fontFamily: 'Arial, sans-serif'
  };

  const titleStyle = {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '20px'
  };

  const flexContainerStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px'
  };

  const canvasContainerStyle = {
    flex: '1',
    minWidth: '250px',
    padding: '15px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
  };

  const infoContainerStyle = {
    flex: '1',
    minWidth: '250px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  };

  const sectionStyle = {
    padding: '15px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
  };

  const sectionTitleStyle = {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '10px'
  };

  const buttonStyle = {
    padding: '10px',
    backgroundColor: isRunning ? '#dc3545' : '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    width: '100%',
    marginBottom: '10px'
  };

  const speedContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    margin: '10px 0'
  };

  const rotationButtonsStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    margin: '10px 0'
  };

  const smallButtonStyle = {
    padding: '5px 10px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: isRunning ? 'not-allowed' : 'pointer',
    opacity: isRunning ? 0.6 : 1
  };

  const explanationStyle = {
    marginTop: '20px',
    padding: '15px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Otto Engine Simulator</h1>
      
      <div style={flexContainerStyle}>
        <div style={canvasContainerStyle}>
          <canvas 
            ref={canvasRef} 
            width="200" 
            height="320" 
            style={{border: '1px solid #ddd', display: 'block', margin: '0 auto'}}
          />
        </div>
        
        <div style={infoContainerStyle}>
          <div style={sectionStyle}>
            <h2 style={sectionTitleStyle}>{cycleNames[cycle]}</h2>
            <p style={{color: '#333'}}>{cycleDescriptions[cycle]}</p>
          </div>
          
          <div style={sectionStyle}>
            <h2 style={sectionTitleStyle}>Engine Controls</h2>
            <button 
              onClick={toggleEngine}
              style={buttonStyle}
            >
              {isRunning ? 'Stop Engine' : 'Start Engine'}
            </button>
            
            <div style={speedContainerStyle}>
              <span style={{fontWeight: 'bold'}}>Speed:</span>
              <input 
                type="range" 
                min="1" 
                max="5" 
                value={speed} 
                onChange={(e) => setSpeed(parseInt(e.target.value))}
                style={{flex: '1'}}
                disabled={!isRunning}
              />
              <span style={{backgroundColor: '#e9f5ff', padding: '3px 8px', borderRadius: '3px'}}>{speed}x</span>
            </div>
            
            <div style={rotationButtonsStyle}>
              <button 
                onClick={() => rotateManually(-15)}
                style={smallButtonStyle}
                disabled={isRunning}
              >
                -15°
              </button>
              <button 
                onClick={() => rotateManually(-90)}
                style={smallButtonStyle}
                disabled={isRunning}
              >
                -90°
              </button>
              <button 
                onClick={() => rotateManually(90)}
                style={smallButtonStyle}
                disabled={isRunning}
              >
                +90°
              </button>
              <button 
                onClick={() => rotateManually(15)}
                style={smallButtonStyle}
                disabled={isRunning}
              >
                +15°
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div style={explanationStyle}>
        <h2 style={sectionTitleStyle}>Otto Cycle Explanation</h2>
        <p style={{marginBottom: '10px'}}>
          The Otto cycle is a four-stroke cycle that powers most car engines:
        </p>
        <ol style={{paddingLeft: '20px'}}>
          <li style={{margin: '5px 0'}}><strong>Intake Stroke:</strong> The Piston moves down, drawing in air-fuel mixture</li>
          <li style={{margin: '5px 0'}}><strong>Compression Stroke:</strong> The Piston moves up, compressing the air-fuel mixture</li>
          <li style={{margin: '5px 0'}}><strong>Power Stroke:</strong> The Spark ignites the mixture, forcing the piston down</li>
          <li style={{margin: '5px 0'}}><strong>Exhaust Stroke:</strong> The Piston moves up, expelling exhaust gases</li>
        </ol>
      </div>
    </div>
  );
};

export default OttoEngineSimulator;
