
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Clipboard, ClipboardCheck, X, Trophy } from 'lucide-react';
import { Button } from './ui/button';

interface WinnerDisplayProps {
  winner: string | null;
  onClose: () => void;
  remainingSpins?: number;
  onCopy?: () => void;
  isLastWinner?: boolean;
  allWinners?: string[];
  onCopyAll?: () => void;
}

const WinnerDisplay: React.FC<WinnerDisplayProps> = ({ 
  winner, 
  onClose, 
  remainingSpins = 0,
  onCopy,
  isLastWinner = false,
  allWinners,
  onCopyAll
}) => {
  useEffect(() => {
    if (winner && !isLastWinner) {
      // Create an auto-dismiss timer
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [winner, onClose, isLastWinner]);
  
  return (
    <AnimatePresence>
      {winner && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop blur */}
          <motion.div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          <motion.div
            className="relative glass-panel p-8 py-10 md:p-10 max-w-md w-full flex flex-col items-center z-10"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ 
              type: "spring", 
              damping: 20, 
              stiffness: 300 
            }}
          >
            <motion.div 
              className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white/20 flex items-center justify-center mb-6"
              initial={{ scale: 0.5, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                type: "spring", 
                delay: 0.2,
                damping: 12 
              }}
            >
              <Trophy size={60} className="text-yellow-300" />
            </motion.div>
            
            <motion.div
              className="absolute top-[-30px] left-[-30px] w-20 h-20 opacity-80"
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              <Award size={60} className="text-white" />
            </motion.div>
            
            <motion.div
              className="absolute top-[-20px] right-[-20px] w-16 h-16 opacity-70"
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: [0, -10, 10, 0] }}
              transition={{ delay: 0.7, duration: 1 }}
            >
              <Award size={48} className="text-white" />
            </motion.div>
            
            <motion.h3 
              className="text-3xl md:text-4xl font-bold text-white mb-4 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {isLastWinner && allWinners && allWinners.length > 1 ? 'All Winners!' : 'Winner!'}
            </motion.h3>
            
            {isLastWinner && allWinners && allWinners.length > 1 ? (
              <motion.div 
                className="bg-white/20 backdrop-blur-md p-6 rounded-xl w-full text-center mt-2"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="max-h-[200px] overflow-y-auto mb-4">
                  {allWinners.map((w, idx) => (
                    <p key={idx} className="text-lg md:text-xl font-bold text-white break-words mb-2">
                      {idx + 1}. {w}
                    </p>
                  ))}
                </div>
                <Button 
                  className="w-full flex items-center justify-center gap-2 mt-2"
                  onClick={onCopyAll}
                >
                  <Clipboard size={18} />
                  Copy All Winners
                </Button>
              </motion.div>
            ) : (
              <>
                <motion.div 
                  className="bg-white/20 backdrop-blur-md p-6 rounded-xl w-full text-center mt-2"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <p className="text-2xl md:text-3xl font-bold text-white break-words">
                    {winner}
                  </p>
                  
                  {onCopy && (
                    <Button 
                      className="mt-4 w-full flex items-center justify-center gap-2"
                      onClick={onCopy}
                    >
                      <Clipboard size={18} />
                      Copy Winner
                    </Button>
                  )}
                </motion.div>
                
                {remainingSpins > 0 && (
                  <Button 
                    className="mt-4 px-8 py-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded"
                    onClick={onClose}
                  >
                    Spin Again ({remainingSpins} remaining)
                  </Button>
                )}
              </>
            )}
            
            <motion.button
              className="absolute top-2 right-2 p-2 text-white/80 hover:text-white"
              onClick={onClose}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <X size={24} />
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WinnerDisplay;
