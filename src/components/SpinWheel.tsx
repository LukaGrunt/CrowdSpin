import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { motion } from 'framer-motion';
import { Pause, Play, RotateCcw } from 'lucide-react';
import { WheelCustomization } from './CustomizationPanel';
import { getContrastTextColor } from '../utils/colorUtils';

interface SpinWheelProps {
  entries: string[];
  customization: WheelCustomization;
  onSpin: () => void;
  onComplete: (winner: string) => void;
  isSpinning: boolean;
  setIsSpinning: React.Dispatch<React.SetStateAction<boolean>>;
  spinDuration?: number;
  selectedWinner?: string | null;
}

const createWheel = (canvasRef: React.RefObject<HTMLCanvasElement>, entries: string[], customization: WheelCustomization) => {
  const canvas = canvasRef.current;
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = Math.min(centerX, centerY) - 10;
  
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw background image if provided
  if (customization.backgroundImage) {
    const bgImg = new Image();
    bgImg.onload = () => {
      // Create a pattern or draw the image to fit the circle
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      
      // Draw the background image with reduced opacity
      ctx.globalAlpha = 0.15; // Make it subtle
      
      // Calculate dimensions to maintain aspect ratio but fill the circle
      const aspectRatio = bgImg.width / bgImg.height;
      let drawWidth = radius * 2;
      let drawHeight = drawWidth / aspectRatio;
      
      if (drawHeight < radius * 2) {
        drawHeight = radius * 2;
        drawWidth = drawHeight * aspectRatio;
      }
      
      // Draw the image centered
      ctx.drawImage(
        bgImg, 
        centerX - drawWidth / 2, 
        centerY - drawHeight / 2,
        drawWidth,
        drawHeight
      );
      
      ctx.globalAlpha = 1;
      ctx.restore();
      
      // Redraw the wheel segments on top of the background
      drawWheelSegments(ctx, centerX, centerY, radius, entries, customization);
      
      // Draw logo after wheel segments if provided
      if (customization.logoUrl) {
        drawLogo(ctx, centerX, centerY, radius * 0.2, customization.logoUrl);
      }
    };
    bgImg.src = customization.backgroundImage;
  } else {
    // No background image, just draw the wheel segments
    drawWheelSegments(ctx, centerX, centerY, radius, entries, customization);
    
    // Draw logo if provided
    if (customization.logoUrl) {
      drawLogo(ctx, centerX, centerY, radius * 0.2, customization.logoUrl);
    }
  }
};

const drawWheelSegments = (
  ctx: CanvasRenderingContext2D, 
  centerX: number, 
  centerY: number, 
  radius: number, 
  entries: string[], 
  customization: WheelCustomization
) => {
  const segmentAngle = (2 * Math.PI) / entries.length;
  
  // Draw wheel segments
  entries.forEach((entry, i) => {
    const startAngle = i * segmentAngle;
    const endAngle = (i + 1) * segmentAngle;
    
    // Alternate colors
    ctx.fillStyle = i % 2 === 0 ? customization.primaryColor : customization.secondaryColor;
    
    // Draw segment
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.closePath();
    ctx.fill();
    
    // Draw segment outline
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Draw text
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(startAngle + segmentAngle / 2);
    
    const textRadius = radius * 0.75;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    
    // Improved text rendering
    ctx.font = '14px Arial, sans-serif';
    ctx.fillStyle = customization.textColor || '#FFFFFF';
    
    // Truncate long entries
    const maxTextWidth = radius * 0.6; // Maximum width for text
    let displayText = entry;
    
    // Measure text width
    let textWidth = ctx.measureText(displayText).width;
    
    // Truncate text if too long
    if (textWidth > maxTextWidth) {
      const ratio = maxTextWidth / textWidth;
      const charactersToShow = Math.floor(displayText.length * ratio) - 3; // -3 for the ellipsis
      displayText = displayText.substring(0, charactersToShow) + '...';
    }
    
    // Draw shadow for better readability
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 2;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    
    ctx.fillText(displayText, textRadius, 0);
    ctx.restore();
  });
  
  // Draw center circle
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius * 0.1, 0, Math.PI * 2);
  ctx.fillStyle = 'white';
  ctx.fill();
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
  ctx.lineWidth = 2;
  ctx.stroke();
};

const drawLogo = (
  ctx: CanvasRenderingContext2D, 
  centerX: number, 
  centerY: number, 
  logoRadius: number, 
  logoUrl: string
) => {
  const logoImg = new Image();
  logoImg.onload = () => {
    // Calculate logo dimensions while maintaining aspect ratio
    const aspectRatio = logoImg.width / logoImg.height;
    let drawWidth = logoRadius * 2;
    let drawHeight = drawWidth / aspectRatio;
    
    if (drawHeight > logoRadius * 2) {
      drawHeight = logoRadius * 2;
      drawWidth = drawHeight * aspectRatio;
    }
    
    // Create clipping path for circular logo
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, logoRadius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    
    // Draw logo
    ctx.drawImage(
      logoImg, 
      centerX - drawWidth / 2, 
      centerY - drawHeight / 2,
      drawWidth,
      drawHeight
    );
    
    // Add a white outline
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    ctx.restore();
  };
  logoImg.src = logoUrl;
};

const SpinWheel = forwardRef<
  { handleSpin: () => void; handleReset: () => void; }, 
  SpinWheelProps
>((props, ref) => {
  const {
    entries,
    customization,
    onSpin,
    onComplete,
    isSpinning,
    setIsSpinning,
    spinDuration = 5000,
    selectedWinner,
  } = props;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wheelRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState(0);
  const [isResetting, setIsResetting] = useState(false);

  // Initialize wheel
  useEffect(() => {
    if (entries.length > 0) {
      // Use the customization.logoUrl and customization.backgroundImage directly
      createWheel(canvasRef, entries, customization);
    }
  }, [entries, customization]);

  // Handle spinning
  const handleSpin = () => {
    if (isSpinning || isResetting || entries.length === 0) return;
    
    onSpin();
    setIsSpinning(true);
    
    // Calculate rotation: full rotations + winner position
    const totalRotations = 5; // Number of full rotations
    const baseRotation = totalRotations * 360;
    
    // Determine final angle based on selected winner
    let winnerIndex = 0;
    if (selectedWinner && entries.includes(selectedWinner)) {
      winnerIndex = entries.indexOf(selectedWinner);
    } else {
      winnerIndex = Math.floor(Math.random() * entries.length);
    }
    
    // Calculate segment angle based on number of entries
    const segmentAngle = 360 / entries.length;
    
    // Calculate the angle to the middle of the segment for the winner
    const winnerAngle = 360 - (winnerIndex * segmentAngle + segmentAngle / 2);
    
    // Set new rotation: current + base + winner position adjustment
    const newRotation = rotation + baseRotation + winnerAngle;
    setRotation(newRotation);
    
    // Call onComplete when done spinning
    setTimeout(() => {
      setIsSpinning(false);
      onComplete(entries[winnerIndex]);
    }, spinDuration);
  };
  
  // Handle reset
  const handleReset = () => {
    if (isSpinning) return;
    
    setIsResetting(true);
    setRotation(0);
    
    setTimeout(() => {
      setIsResetting(false);
    }, 300);
  };

  // Expose methods to parent using ref
  useImperativeHandle(ref, () => ({
    handleSpin,
    handleReset
  }));
  
  // Get text color based on button background color
  const primaryTextColor = getContrastTextColor(customization.primaryColor);
  const secondaryTextColor = getContrastTextColor(customization.secondaryColor);
  
  // Button styles using customization colors
  const primaryButtonStyle = {
    backgroundColor: customization.primaryColor,
    color: primaryTextColor === 'black' ? '#000000' : '#FFFFFF',
    textShadow: primaryTextColor === 'white' ? '0px 1px 2px rgba(0,0,0,0.5)' : 'none',
  };
  
  const secondaryButtonStyle = {
    backgroundColor: customization.secondaryColor,
    color: secondaryTextColor === 'black' ? '#000000' : '#FFFFFF',
    textShadow: secondaryTextColor === 'white' ? '0px 1px 2px rgba(0,0,0,0.5)' : 'none',
  };
  
  return (
    <div className="relative flex flex-col items-center">
      <motion.div 
        ref={wheelRef}
        className="relative w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] md:w-[380px] md:h-[380px] shadow-wheel rounded-full"
        style={{
          boxShadow: '0 0 30px rgba(0, 0, 0, 0.15), inset 0 0 40px rgba(0, 0, 0, 0.1)'
        }}
        animate={{ 
          rotate: rotation,
        }}
        transition={{ 
          duration: isResetting ? 0.3 : spinDuration / 1000, 
          ease: isResetting ? "easeOut" : [0.2, 0.1, 0.1, 0.1],
        }}
      >
        <canvas 
          ref={canvasRef} 
          width={380} 
          height={380} 
          className="w-full h-full rounded-full"
        />
      </motion.div>

      {/* Pointer */}
      <div className="absolute right-[-5px] top-1/2 transform -translate-y-1/2 z-20">
        <div className="w-8 h-8 bg-white shadow-lg clip-path-triangle" />
      </div>
      
      {/* Title Above Wheel */}
      {customization.title && (
        <div className="absolute top-[-40px] left-0 right-0 text-center">
          <h2 className="text-xl font-bold text-white drop-shadow-md">
            {customization.title}
          </h2>
        </div>
      )}
      
      {/* Controls */}
      <div className="mt-16 mb-2 flex items-center gap-4">
        <motion.button
          onClick={handleSpin}
          className="flex items-center gap-2 px-8 py-2 rounded-md font-medium"
          style={primaryButtonStyle}
          whileTap={{ scale: 0.95 }}
          disabled={isSpinning || isResetting || entries.length === 0}
        >
          {isSpinning ? <Pause size={18} /> : <Play size={18} />}
          <span>{isSpinning ? 'Spinning...' : 'Spin'}</span>
        </motion.button>
        
        <motion.button
          onClick={handleReset}
          className="flex items-center gap-2 px-6 py-2 rounded-md font-medium"
          style={secondaryButtonStyle}
          whileTap={{ scale: 0.95 }}
          disabled={isSpinning || rotation === 0}
        >
          <RotateCcw size={18} />
          <span>Reset</span>
        </motion.button>
      </div>
    </div>
  );
});

SpinWheel.displayName = 'SpinWheel';

export default SpinWheel;
