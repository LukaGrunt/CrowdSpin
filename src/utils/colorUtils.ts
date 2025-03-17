
/**
 * Utility functions for handling colors
 */

/**
 * Generate a random hex color
 * @returns Random hex color string (e.g. #FF5733)
 */
export const generateRandomColor = (): string => {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
};

/**
 * Helper function to parse RGB values from CSS rgb/rgba string
 */
const parseRgb = (rgbString: string): { r: number; g: number; b: number } => {
  const matches = rgbString.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
  if (!matches) {
    return { r: 0, g: 0, b: 0 };
  }
  return {
    r: parseInt(matches[1], 10),
    g: parseInt(matches[2], 10),
    b: parseInt(matches[3], 10)
  };
};

/**
 * Determines whether to use white or black text on a given background color
 * Using the WCAG contrast ratio formula
 * @param backgroundColor - The background color (hex, rgb, or rgba)
 * @returns 'white' or 'black' based on which has better contrast
 */
export const getContrastTextColor = (backgroundColor: string): 'white' | 'black' => {
  // Handle hex colors
  if (backgroundColor.startsWith('#')) {
    const r = parseInt(backgroundColor.slice(1, 3), 16);
    const g = parseInt(backgroundColor.slice(3, 5), 16);
    const b = parseInt(backgroundColor.slice(5, 7), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 140 ? 'black' : 'white';
  }
  
  // Handle rgb/rgba colors
  if (backgroundColor.startsWith('rgb')) {
    const { r, g, b } = parseRgb(backgroundColor);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 140 ? 'black' : 'white';
  }
  
  // Default fallback
  return 'white';
};

/**
 * Extracts the dominant color from an image
 * @param imageUrl - URL of the image to analyze
 * @returns Promise containing the dominant color as hex string
 */
export const getDominantColor = (imageUrl: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    
    img.onload = () => {
      try {
        // Create canvas and context
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        // Set canvas dimensions
        const size = Math.min(img.width, img.height);
        canvas.width = size;
        canvas.height = size;
        
        // Draw image on canvas (centered if not square)
        if (img.width !== img.height) {
          const offsetX = img.width > img.height ? (img.width - img.height) / 2 : 0;
          const offsetY = img.height > img.width ? (img.height - img.width) / 2 : 0;
          ctx.drawImage(img, offsetX, offsetY, size, size, 0, 0, size, size);
        } else {
          ctx.drawImage(img, 0, 0, size, size);
        }
        
        // Sample the outer edges to find background color
        const edgeSamples = [];
        
        // Top edge
        for (let x = 0; x < size; x += Math.max(1, Math.floor(size / 20))) {
          edgeSamples.push(ctx.getImageData(x, 0, 1, 1).data);
        }
        
        // Right edge
        for (let y = 0; y < size; y += Math.max(1, Math.floor(size / 20))) {
          edgeSamples.push(ctx.getImageData(size - 1, y, 1, 1).data);
        }
        
        // Bottom edge
        for (let x = size - 1; x >= 0; x -= Math.max(1, Math.floor(size / 20))) {
          edgeSamples.push(ctx.getImageData(x, size - 1, 1, 1).data);
        }
        
        // Left edge
        for (let y = size - 1; y >= 0; y -= Math.max(1, Math.floor(size / 20))) {
          edgeSamples.push(ctx.getImageData(0, y, 1, 1).data);
        }
        
        // Calculate average color from samples
        let r = 0, g = 0, b = 0;
        
        for (const sample of edgeSamples) {
          r += sample[0];
          g += sample[1];
          b += sample[2];
        }
        
        r = Math.floor(r / edgeSamples.length);
        g = Math.floor(g / edgeSamples.length);
        b = Math.floor(b / edgeSamples.length);
        
        // Convert to hex
        const hex = '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        resolve(hex);
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = (error) => {
      reject(error);
    };
    
    img.src = imageUrl;
  });
};

/**
 * Convert hex color to rgba string
 * @param hex - Hex color code
 * @param alpha - Alpha value (0-1)
 * @returns rgba color string
 */
export const hexToRgba = (hex: string, alpha: number = 1): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
