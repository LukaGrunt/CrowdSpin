
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sliders, AlertTriangle, Download, Edit3, Palette, Monitor, Type } from 'lucide-react';
import { generateRandomColor } from '../utils/colorUtils';
import { toast } from '@/components/ui/use-toast';

export type WheelCustomization = {
  primaryColor: string;
  secondaryColor: string;
  title: string;
  logoUrl: string | null;
  backgroundImage: string | null;
  winnerEffect: "none" | "confetti" | "sparkles";
  additionalText: string;
  numberOfWinners: number;
  textColor: 'white' | 'black';
}

interface CustomizationPanelProps {
  customization: WheelCustomization;
  setCustomization: React.Dispatch<React.SetStateAction<WheelCustomization>>;
  onSaveImage: () => void;
}

const CustomizationPanel: React.FC<CustomizationPanelProps> = ({ 
  customization, 
  setCustomization,
  onSaveImage
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  
  const handleColorChange = (colorType: 'primaryColor' | 'secondaryColor' | 'textColor', value: string) => {
    setCustomization(prev => ({
      ...prev,
      [colorType]: value
    }));
  };
  
  const handleInputChange = (field: keyof WheelCustomization, value: any) => {
    setCustomization(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const generateRandomColors = () => {
    const newPrimary = generateRandomColor();
    let newSecondary = generateRandomColor();
    
    // Make sure secondary color is different enough from primary
    while (Math.abs(parseInt(newPrimary.slice(1, 3), 16) - parseInt(newSecondary.slice(1, 3), 16)) < 50) {
      newSecondary = generateRandomColor();
    }
    
    setCustomization(prev => ({
      ...prev,
      primaryColor: newPrimary,
      secondaryColor: newSecondary
    }));
    
    toast({
      title: "Colors Updated",
      description: "New random colors have been applied to your wheel",
    });
  };
  
  return (
    <motion.div 
      className="glass-panel w-full max-w-xl mx-auto overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div 
        className="p-4 flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <Sliders size={20} className="text-white/90" />
          <h2 className="text-xl font-bold text-white">Customize Your Wheel</h2>
        </div>
        <div className="w-6 h-6 flex items-center justify-center rounded-full bg-white/10">
          <motion.span 
            className="block text-white font-bold text-lg leading-none"
            animate={{ rotate: isExpanded ? 180 : 0 }}
          >
            ↑
          </motion.span>
        </div>
      </div>
      
      {isExpanded && (
        <div className="p-6 border-t border-white/10 space-y-5">
          <div>
            <label className="flex items-center gap-2 text-white font-medium mb-2">
              <Edit3 size={18} className="text-white/80" />
              Wheel Title
            </label>
            <input
              type="text"
              className="input-field w-full"
              placeholder="Crowd Spin"
              value={customization.title}
              onClick={(e) => {
                // Clear the field when user clicks on it if it's the default value
                if (customization.title === "Crowd Spin") {
                  handleInputChange("title", "");
                }
              }}
              onChange={(e) => handleInputChange("title", e.target.value)}
            />
          </div>
          
          <div>
            <label className="flex items-center gap-2 text-white font-medium mb-2">
              <Type size={18} className="text-white/80" />
              Additional Text
            </label>
            <input
              type="text"
              className="input-field w-full"
              placeholder="Good luck everyone!"
              value={customization.additionalText}
              onChange={(e) => handleInputChange("additionalText", e.target.value)}
            />
          </div>
          
          <div>
            <label className="flex items-center gap-2 text-white font-medium mb-2">
              <Palette size={18} className="text-white/80" />
              Colors
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-white/80">Primary</span>
                  <span className="text-xs font-mono text-white/60">{customization.primaryColor}</span>
                </div>
                <input
                  type="color"
                  className="w-full h-12 rounded-lg cursor-pointer"
                  value={customization.primaryColor}
                  onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-white/80">Secondary</span>
                  <span className="text-xs font-mono text-white/60">{customization.secondaryColor}</span>
                </div>
                <input
                  type="color"
                  className="w-full h-12 rounded-lg cursor-pointer"
                  value={customization.secondaryColor}
                  onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                />
              </div>
            </div>
            <div className="mt-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-white/80">Text Color</span>
                <span className="text-xs font-mono text-white/60">{customization.textColor}</span>
              </div>
              <select
                className="input-field w-full"
                value={customization.textColor}
                onChange={(e) => handleColorChange('textColor', e.target.value as 'white' | 'black')}
              >
                <option value="white">White</option>
                <option value="black">Black</option>
              </select>
            </div>
            <button
              className="btn-secondary w-full mt-3 text-sm py-2"
              onClick={generateRandomColors}
            >
              Generate Random Colors
            </button>
          </div>
          
          <div>
            <label className="flex items-center gap-2 text-white font-medium mb-2">
              <Monitor size={18} className="text-white/80" />
              Winner Effect
            </label>
            <select
              className="input-field w-full"
              value={customization.winnerEffect}
              onChange={(e) => handleInputChange("winnerEffect", e.target.value as "none" | "confetti" | "sparkles")}
            >
              <option value="none">None</option>
              <option value="confetti">Confetti</option>
              <option value="sparkles">Sparkles</option>
            </select>
          </div>
          
          <div>
            <label className="flex items-center gap-2 text-white font-medium mb-2">
              <AlertTriangle size={18} className="text-white/80" />
              Number of Winners
            </label>
            <input
              type="number"
              min="1"
              max="10"
              className="input-field w-full"
              value={customization.numberOfWinners}
              onChange={(e) => handleInputChange("numberOfWinners", Math.min(10, Math.max(1, parseInt(e.target.value) || 1)))}
            />
            <p className="text-xs text-white/70 mt-1">Maximum: 10 winners</p>
          </div>
          
          <button
            onClick={onSaveImage}
            className="btn-primary w-full flex items-center justify-center gap-2 mt-6"
          >
            <Download size={18} />
            <span>Save Wheel as Image</span>
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default CustomizationPanel;
