
import React from 'react';
import { motion } from 'framer-motion';

const BackgroundWheel: React.FC = () => {
  const segmentCount = 12;
  const segments = Array.from({ length: segmentCount }).map((_, index) => {
    // Calculate the angle for this segment
    const angle = 360 / segmentCount;
    const rotation = index * angle;
    
    return (
      <motion.div
        key={index}
        className="absolute w-full h-full origin-center"
        style={{
          transform: `rotate(${rotation}deg)`,
        }}
      >
        <div
          className="absolute top-0 left-1/2 h-1/2 w-1 bg-white/5"
          style={{
            transformOrigin: 'bottom center',
          }}
        />
      </motion.div>
    );
  });

  return (
    <div className="relative w-[800px] h-[800px] opacity-20 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      {/* Wheel container */}
      <motion.div
        className="absolute inset-0 rounded-full border-[30px] border-white/5"
        animate={{ rotate: 360 }}
        transition={{
          duration: 120,
          ease: "linear",
          repeat: Infinity,
        }}
      >
        {segments}
      </motion.div>
      
      {/* Inner circle */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white/5"></div>
    </div>
  );
};

export default BackgroundWheel;
