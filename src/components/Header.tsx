
import React from 'react';
import { motion } from 'framer-motion';

interface HeaderProps {
  customTitle?: string;
  brandColors?: {
    textColor?: string;
    subtitleColor?: string;
  };
  additionalText?: string;
  hideSubtitle?: boolean;
  largeTitleSize?: boolean;
  logoUrl?: string;
  showWheeledHeader?: boolean;
  textColor?: 'white' | 'black';
}

const Header: React.FC<HeaderProps> = ({ 
  customTitle, 
  brandColors = { 
    textColor: 'text-white',
    subtitleColor: 'text-white/90'
  },
  additionalText,
  hideSubtitle = false,
  largeTitleSize = false,
  logoUrl,
  showWheeledHeader = false,
  textColor = 'white'
}) => {
  // Determine text colors based on the textColor prop
  const titleColorClass = textColor === 'white' ? 'text-white' : 'text-black';
  const subtitleColorClass = textColor === 'white' ? 'text-white/90' : 'text-black/90';
  
  return (
    <motion.header 
      className="w-full py-6 flex flex-col items-center justify-center mb-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.div 
        className={`${showWheeledHeader ? 'glass-panel px-8 py-5' : ''} flex items-center justify-center gap-4 rounded-[15px]`}
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5, type: "spring", stiffness: 200 }}
      >
        {logoUrl && (
          <div className={`h-14 w-14 md:h-16 md:w-16 flex-shrink-0 rounded-full overflow-hidden ${showWheeledHeader ? 'border-2 border-white/30' : ''}`}>
            <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
          </div>
        )}
        
        <motion.h1 
          className={`${largeTitleSize ? 'text-6xl md:text-7xl' : 'text-5xl md:text-6xl'} font-bold drop-shadow-lg ${brandColors.textColor || titleColorClass}`}
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5, type: "spring", stiffness: 200 }}
        >
          {customTitle || 'Crowd Spin'}
        </motion.h1>
      </motion.div>
      
      {!hideSubtitle && (
        <motion.p 
          className={`text-sm md:text-base font-normal mt-2 tracking-wider ${brandColors.subtitleColor || subtitleColorClass}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          TOOLS FOR THE CROWD, BROUGHT TO LIFE!
        </motion.p>
      )}
      
      {additionalText && (
        <motion.p
          className={`mt-4 max-w-xl text-center text-base md:text-lg ${brandColors.subtitleColor || subtitleColorClass}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          {additionalText}
        </motion.p>
      )}
    </motion.header>
  );
};

export default Header;
