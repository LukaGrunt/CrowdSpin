
/**
 * Utility functions for the spinning wheel
 */

// Function to generate random colors with a certain brightness
export const generateRandomColor = (brightness: number = 50) => {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 70%, ${brightness}%)`;
};

// Function to create wheel segments
export const createWheelSegments = (entries: string[]) => {
  if (!entries.length) return [];
  
  const segmentAngle = 360 / entries.length;
  return entries.map((entry, index) => {
    const angle = index * segmentAngle;
    // Use a deterministic color based on the index for better visual consistency
    const hue = (index * 137.5) % 360; // Golden angle approximation for nice distribution
    const color = `hsl(${hue}, 70%, 50%)`;
    
    return {
      id: index,
      label: entry,
      color,
      startAngle: angle,
      endAngle: angle + segmentAngle,
    };
  });
};

// Function to determine winning segment based on final rotation angle
export const determineWinner = (segments: any[], finalAngle: number) => {
  // Normalize finalAngle to be between 0 and 360
  const normalizedAngle = ((finalAngle % 360) + 360) % 360;
  
  // Find the segment that contains the normalized angle
  return segments.find(segment => {
    return normalizedAngle >= segment.startAngle && normalizedAngle < segment.endAngle;
  });
};

// Function to chunk large arrays for better performance
export const chunkArray = <T>(array: T[], chunkSize: number = 1000): T[][] => {
  const result = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
};

// Function to parse CSV or text file content
export const parseFileContent = (content: string): string[] => {
  // Split by newline, filter out empty lines, and trim whitespace
  return content
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line.length > 0);
};

// Function to generate a random spin result (angle in degrees)
export const getRandomSpinResult = (minSpins: number = 5): number => {
  // Spin between minSpins and minSpins + 3 full rotations, plus a random angle
  const fullRotations = minSpins + Math.random() * 5;
  return fullRotations * 360 + Math.random() * 360;
};

// Create a more impressive confetti burst
export const createConfetti = (count: number = 150) => {
  const shapes = ['polygon(50% 0%, 0% 100%, 100% 100%)', 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)', 'circle(50% at 50% 50%)', 'inset(0 0 0 0)'];
  const colors = ['#FFD700', '#FF6347', '#7FFFD4', '#DDA0DD', '#20B2AA', '#FF4500', '#2E8B57', '#DAA520', '#FF1493', '#00FFFF'];
  
  // Remove any existing confetti
  const existingConfetti = document.querySelectorAll('.confetti');
  existingConfetti.forEach(c => c.remove());
  
  const fragment = document.createDocumentFragment();
  
  for (let i = 0; i < count; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.setProperty('--color', colors[Math.floor(Math.random() * colors.length)]);
    confetti.style.setProperty('--shape', shapes[Math.floor(Math.random() * shapes.length)]);
    
    // Random position
    confetti.style.left = `${Math.random() * 100}%`;
    confetti.style.top = `-20px`;
    
    // Random size
    const size = Math.random() * 15 + 5;
    confetti.style.width = `${size}px`;
    confetti.style.height = `${size}px`;
    
    // Random animation duration and delay
    confetti.style.setProperty('--duration', `${Math.random() * 3 + 1}s`);
    confetti.style.setProperty('--delay', `${Math.random() * 0.5}s`);
    
    // Add to fragment for better performance
    fragment.appendChild(confetti);
  }
  
  document.body.appendChild(fragment);
  
  // Add some CSS for more impressive confetti
  const style = document.createElement('style');
  style.textContent = `
    .confetti {
      position: fixed;
      z-index: 1000;
      pointer-events: none;
      background-color: var(--color);
      clip-path: var(--shape);
      animation: confetti-fall var(--duration) ease-in forwards var(--delay);
    }
    
    @keyframes confetti-fall {
      0% {
        transform: translateY(0) rotate(0deg) scale(0);
        opacity: 1;
      }
      25% {
        opacity: 1;
        transform: translateY(25vh) rotate(180deg) scale(1);
      }
      100% {
        transform: translateY(100vh) rotate(720deg) scale(0.5);
        opacity: 0;
      }
    }
  `;
  
  document.head.appendChild(style);
  
  // Clean up confetti and style after all animations are done
  setTimeout(() => {
    const allConfetti = document.querySelectorAll('.confetti');
    allConfetti.forEach(c => c.remove());
    style.remove();
  }, 5000);
};
