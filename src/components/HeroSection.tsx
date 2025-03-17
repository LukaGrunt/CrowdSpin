
import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  // Animation variants for the hero title
  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.1
      }
    }
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.8 },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { duration: 0.5 }
    }
  };

  // Animation for the spinning wheel effect
  const wheelVariants = {
    initial: { rotate: 0 },
    animate: { 
      rotate: 360,
      transition: {
        duration: 20,
        ease: "linear",
        repeat: Infinity
      }
    }
  };

  // Split title for letter animation
  const title = "Crowd Spin";
  const letters = Array.from(title);

  return (
    <div className="relative w-full flex flex-col items-center justify-center py-16 md:py-24 overflow-hidden">
      {/* Brand gradient background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-[#AB5303] to-[#DD925B]"></div>
        <div className="absolute inset-0 backdrop-blur-[50px]"></div>
      </div>

      {/* Contact creator button */}
      <div className="absolute top-4 right-4 md:top-8 md:right-8 z-20">
        <Button 
          variant="outline" 
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border-white/30 text-white"
          onClick={() => window.open('https://x.com/LukaGrunt', '_blank')}
        >
          <ExternalLink size={16} />
          Contact Creator
        </Button>
      </div>

      {/* Decorative animated elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-[#AB5303]/20 blur-3xl"
          variants={wheelVariants}
          initial="initial"
          animate="animate"
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-[#DD925B]/20 blur-3xl"
          animate={{ 
            scale: [1, 1.3, 1],
            x: [0, 40, 0],
            y: [0, -30, 0],
          }}
          transition={{ 
            duration: 18, 
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      </div>

      <motion.div
        className="container relative z-10 px-4 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Main animated title */}
        <motion.h1 
          className="relative text-7xl md:text-9xl font-extrabold text-white mb-8"
          variants={titleVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex justify-center flex-wrap">
            {letters.map((letter, index) => (
              <motion.span
                key={index}
                variants={letterVariants}
                className="inline-block mx-1 bg-clip-text text-transparent bg-gradient-to-r from-white to-amber-100"
              >
                {letter === " " ? "\u00A0" : letter}
              </motion.span>
            ))}
          </div>
        </motion.h1>
        
        <motion.p 
          className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Create custom wheels for giveaways, decision making, or simply to add some fun to your events. Fair, transparent, and endlessly customizable!
        </motion.p>

        {/* Before/After Wheels Comparison */}
        <motion.div
          className="flex flex-col md:flex-row gap-8 mt-12 justify-center items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          {/* "Before" basic wheel */}
          <div className="relative">
            <div className="text-white/80 font-bold mb-3">Traditional</div>
            <motion.div 
              className="w-40 h-40 md:w-52 md:h-52 rounded-full border-4 border-gray-400 bg-gray-200/20 backdrop-blur-sm flex items-center justify-center relative overflow-hidden"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              {/* Basic wheel segments */}
              {[...Array(6)].map((_, i) => (
                <div 
                  key={i} 
                  className="absolute w-1/2 h-[2px] bg-gray-400/60"
                  style={{ 
                    transformOrigin: 'left center',
                    transform: `rotate(${i * 60}deg)`,
                    left: '50%',
                    top: '50%'
                  }}
                />
              ))}
              <div className="text-xs text-gray-300/80">Basic Wheel</div>
            </motion.div>
          </div>

          {/* "After" customized wheel */}
          <div className="relative">
            <div className="text-white/80 font-bold mb-3">Crowd Spin</div>
            <motion.div 
              className="w-40 h-40 md:w-52 md:h-52 rounded-full shadow-xl relative overflow-hidden"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              {/* Colorful wheel segments with gradient */}
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(8)].map((_, i) => (
                  <div 
                    key={i} 
                    className="absolute w-full h-full origin-center"
                    style={{ 
                      transform: `rotate(${i * 45}deg)`,
                      clipPath: 'polygon(50% 50%, 50% 0, 100% 0, 100% 50%)',
                      background: i % 2 === 0 
                        ? 'linear-gradient(45deg, #ff7e5f, #feb47b)' 
                        : 'linear-gradient(45deg, #7367f0, #ce9ffc)'
                    }}
                  />
                ))}
                {/* Center circle */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#AB5303] to-[#DD925B]"></div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HeroSection;
