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
    "Piston moves upward, compressing the air-fuel mixture.",
    "Spark plug ignites the compressed mixture, forcing the piston down.",
    "Piston moves up, pushing exhaust gases out of the cylinder."
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

  return (
    <div className="flex flex-col items-center p-4 bg-gray-100 rounded-lg shadow-md max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Otto Engine Simulator</h1>
      
      <div className="bg-white p-4 rounded-lg shadow mb-4 w-full">
        <canvas 
          ref={canvasRef} 
          width="200" 
          height="320" 
          className="mx-auto border border-gray-300"
        />
      </div>
      
      <div className="flex flex-col md:flex-row justify-center w-full gap-4 mb-4">
        <div className="bg-white p-4 rounded-lg shadow flex-1">
          <h2 className="text-xl font-semibold mb-2">{cycleNames[cycle]}</h2>
          <p className="text-gray-700">{cycleDescriptions[cycle]}</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow flex-1">
          <h2 className="text-xl font-semibold mb-2">Engine Controls</h2>
          <div className="flex flex-col gap-2">
            <button 
              onClick={toggleEngine}
              className={`px-4 py-2 rounded-md font-medium ${isRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white`}
            >
              {isRunning ? 'Stop Engine' : 'Start Engine'}
            </button>
            
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm font-medium">Speed:</span>
              <input 
                type="range" 
                min="1" 
                max="5" 
                value={speed} 
                onChange={(e) => setSpeed(parseInt(e.target.value))}
                className="w-full"
                disabled={!isRunning}
              />
              <span className="text-sm font-medium">{speed}x</span>
            </div>
            
            <div className="flex justify-between mt-2">
              <button 
                onClick={() => rotateManually(-15)}
                className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                disabled={isRunning}
              >
                -15°
              </button>
              <button 
                onClick={() => rotateManually(-90)}
                className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                disabled={isRunning}
              >
                -90°
              </button>
              <button 
                onClick={() => rotateManually(90)}
                className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                disabled={isRunning}
              >
                +90°
              </button>
              <button 
                onClick={() => rotateManually(15)}
                className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                disabled={isRunning}
              >
                +15°
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow w-full">
        <h2 className="text-xl font-semibold mb-2">Otto Cycle Explanation</h2>
        <p className="text-gray-700 mb-2">
          The Otto cycle is a four-stroke cycle that powers most car engines:
        </p>
        <ol className="list-decimal pl-5 text-gray-700">
          <li><strong>Intake Stroke:</strong> Piston moves down, drawing in air-fuel mixture</li>
          <li><strong>Compression Stroke:</strong> Piston moves up, compressing the mixture</li>
          <li><strong>Power Stroke:</strong> Spark ignites the mixture, forcing the piston down</li>
          <li><strong>Exhaust Stroke:</strong> Piston moves up, expelling exhaust gases</li>
        </ol>
      </div>
    </div>
  );
};

export default OttoEngineSimulator;
