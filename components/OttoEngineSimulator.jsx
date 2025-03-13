import React, { useState, useEffect, useRef } from 'react';

const OttoEngineSimulator = () => {
  const [cycle, setCycle] = useState(0); // 0: Intake, 1: Compression, 2: Power, 3: Exhaust
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(1); // 1-5 speed multiplier
  const [crankAngle, setCrankAngle] = useState(0);
  const [activeTab, setActiveTab] = useState('engine-view');
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
    ctx.fillStyle = intakeValveOpen ? "#3498db" : "#2980b9";
    ctx.fill();
    ctx.stroke();
    
    // Exhaust valve (right)
    ctx.beginPath();
    ctx.arc(125, 60, 8, 0, Math.PI * 2);
    ctx.fillStyle = exhaustValveOpen ? "#e74c3c" : "#c0392b";
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
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-800 p-4 text-gray-800">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center text-white mb-8 pt-6">
          <div className="flex items-center justify-center mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M14.31 8l5.74 9.94M9.69 8h11.48M7.38 12l5.74-9.94M9.69 16L3.95 6.06M14.31 16H2.83M16.62 12l-5.74 9.94" />
            </svg>
            <h1 className="text-4xl font-bold">Otto Engine Simulator</h1>
          </div>
          <p className="text-xl opacity-80">
            Interactive simulation of the four-stroke internal combustion engine cycle
          </p>
        </header>

        {/* Main Container */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          {/* Tab Navigation */}
          <div className="flex border-b bg-gray-50">
            <button 
              className={`px-6 py-3 font-medium text-sm flex items-center ${activeTab === 'engine-view' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
              onClick={() => setActiveTab('engine-view')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
              Engine View
            </button>
            <button 
              className={`px-6 py-3 font-medium text-sm flex items-center ${activeTab === 'cycle-details' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
              onClick={() => setActiveTab('cycle-details')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              Cycle Details
            </button>
          </div>

          {/* Content Area */}
          <div className="p-6">
            <div className="flex flex-wrap -mx-4">
              {/* Left Column: Canvas */}
              <div className="w-full md:w-1/2 px-4 mb-6">
                <div className="bg-gray-50 border border-gray-200 rounded-md p-4 text-center">
                  <canvas 
                    ref={canvasRef} 
                    width="200" 
                    height="320" 
                    className="mx-auto border border-gray-300 rounded bg-white"
                  />
                </div>
              </div>

              {/* Right Column: Controls and Info */}
              <div className="w-full md:w-1/2 px-4">
                {/* Current Cycle Info Card */}
                <div className="bg-blue-50 border border-blue-100 rounded-md p-5 mb-6">
                  <h2 className="text-xl font-bold text-blue-800 mb-2">{cycleNames[cycle]}</h2>
                  <p className="text-blue-700">{cycleDescriptions[cycle]}</p>
                </div>

                {/* Engine Controls Card */}
                <div className="bg-white border border-gray-200 rounded-md p-5 mb-6">
                  <h2 className="text-lg font-bold mb-4 flex items-center text-gray-800">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="3" />
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51
