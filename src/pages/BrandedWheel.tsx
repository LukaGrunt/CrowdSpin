import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import SpinWheel from '../components/SpinWheel';
import WinnerDisplay from '../components/WinnerDisplay';
import Header from '../components/Header';
import { Button } from '../components/ui/button';
import { ArrowLeft, Clipboard, Maximize, Minimize, Video, Square } from 'lucide-react';
import { toast } from 'sonner';
import { createConfetti } from '../utils/wheelUtils';
import { getContrastTextColor } from '../utils/colorUtils';
import { WheelCustomization } from '../components/CustomizationPanel';

const BrandedWheel = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [winner, setWinner] = useState<string | null>(null);
  const [winners, setWinners] = useState<string[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [remainingSpins, setRemainingSpins] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const wheelRef = useRef<any>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<BlobPart[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  
  const state = location.state as {
    entries: string[];
    customization: WheelCustomization;
  };
  
  useEffect(() => {
    if (!state || !state.entries || !state.customization) {
      toast.error('Missing wheel configuration. Redirecting to home page.');
      navigate('/');
    } else {
      const numWinners = state.customization.numberOfWinners || 1;
      setRemainingSpins(numWinners);
    }
  }, [state, navigate]);
  
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        toast.error(`Error entering fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };
  
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);
  
  const handleWinnerSelected = (selected: string) => {
    setWinner(selected);
    setWinners(prev => [...prev, selected]);
    setRemainingSpins(prev => prev - 1);
    
    if (state?.customization?.winnerEffect === 'confetti') {
      createConfetti(200);
    } else if (state?.customization?.winnerEffect === 'sparkles') {
      const sparkleCount = 30;
      for (let i = 0; i < sparkleCount; i++) {
        setTimeout(() => {
          createSparkle();
        }, i * 100);
      }
    }
    
    toast.success(`Winner selected: ${selected}`, {
      duration: 5000,
    });
    
    if (remainingSpins <= 1 && isRecording) {
      stopRecording();
    }
  };
  
  const createSparkle = () => {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    
    sparkle.style.left = `${Math.random() * 100}vw`;
    sparkle.style.top = `${Math.random() * 100}vh`;
    
    const size = Math.random() * 15 + 5;
    sparkle.style.width = `${size}px`;
    sparkle.style.height = `${size}px`;
    
    sparkle.style.animationDuration = `${Math.random() * 2 + 1}s`;
    
    document.body.appendChild(sparkle);
    
    setTimeout(() => {
      sparkle.remove();
    }, 3000);
  };
  
  const clearWinner = () => {
    setWinner(null);
    
    if (remainingSpins > 0 && wheelRef.current) {
      setTimeout(() => {
        wheelRef.current.handleSpin();
      }, 500);
    }
  };
  
  const goBack = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    
    if (isRecording) {
      stopRecording();
    }
    
    navigate('/');
  };
  
  const copyWinner = () => {
    if (winner) {
      navigator.clipboard.writeText(winner);
      toast.success('Winner copied to clipboard!');
    }
  };
  
  const copyAllWinners = () => {
    if (winners.length > 0) {
      navigator.clipboard.writeText(winners.join('\n'));
      toast.success('All winners copied to clipboard!');
    }
  };
  
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          displaySurface: 'browser',
        },
        audio: false
      });
      
      streamRef.current = stream;
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      recordedChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        if (recordedChunksRef.current.length > 0) {
          const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
          const url = URL.createObjectURL(blob);
          
          const a = document.createElement('a');
          a.href = url;
          a.download = 'wheel-spin-recording.webm';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          
          URL.revokeObjectURL(url);
          toast.success('Recording saved and downloaded');
        }
        
        setIsRecording(false);
        
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      toast.success('Recording started');
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('Failed to start recording');
      setIsRecording(false);
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };
  
  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };
  
  const handleSpin = () => {
    if (wheelRef.current) {
      wheelRef.current.handleSpin();
    }
  };

  const handleReset = () => {
    if (wheelRef.current) {
      wheelRef.current.handleReset();
    }
  };
  
  if (!state || !state.entries || !state.customization) {
    return (
      <div className="min-h-screen overflow-x-hidden px-4 pb-12 flex items-center justify-center">
        <div className="fixed inset-0 -z-10" style={{
          background: `linear-gradient(to bottom, #AB5303, #DD925B)`
        }}></div>
        <div className="text-white text-xl">Loading wheel configuration...</div>
      </div>
    );
  }
  
  const primaryColor = state.customization.primaryColor;
  const secondaryColor = state.customization.secondaryColor;
  const textColor = state.customization.textColor || 'white';
  
  return (
    <div className="min-h-screen overflow-x-hidden px-4 pb-12">
      <div 
        className="fixed inset-0 -z-10" 
        style={{
          background: state.customization.backgroundImage 
            ? `url(${state.customization.backgroundImage}) center/cover no-repeat` 
            : `linear-gradient(to bottom, ${primaryColor}, ${secondaryColor})`,
          opacity: 1, 
        }}
      >
        {state.customization.backgroundImage && (
          <div className="absolute inset-0 bg-black/30"></div>
        )}
      </div>
      
      {isRecording && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 bg-black/70 text-white px-4 py-2 rounded-full flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          <span>Recording...</span>
        </div>
      )}
      
      <div className="max-w-7xl mx-auto relative">
        <Header 
          customTitle={state.customization.title}
          hideSubtitle={true}
          largeTitleSize={true}
          logoUrl={state.customization.logoUrl}
          showWheeledHeader={true}
          textColor={textColor === 'white' ? 'white' : 'black'}
          additionalText={state.customization.additionalText}
        />
        
        <div className="flex justify-between mb-6">
          <Button 
            variant="outline" 
            onClick={goBack}
            className="flex items-center gap-2 bg-white/10 backdrop-blur-md text-white border-white/20 hover:bg-white/20"
          >
            <ArrowLeft size={18} />
            Back
          </Button>
          
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={toggleRecording}
              className={`flex items-center gap-2 bg-white/10 backdrop-blur-md text-white border-white/20 hover:bg-white/20 ${isRecording ? 'bg-red-500/30' : ''}`}
            >
              {isRecording ? <Square size={18} /> : <Video size={18} />}
              {isRecording ? 'Stop Recording' : 'Record'}
            </Button>
            
            <Button 
              variant="outline"
              onClick={toggleFullscreen}
              className="flex items-center gap-2 bg-white/10 backdrop-blur-md text-white border-white/20 hover:bg-white/20"
            >
              {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
              {isFullscreen ? 'Exit' : 'Fullscreen'}
            </Button>
          </div>
        </div>
        
        {winners.length > 0 && state.customization.numberOfWinners && state.customization.numberOfWinners > 1 && (
          <div className="fixed left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-md p-3 rounded-lg z-10 max-w-[200px] shadow-lg">
            <h3 className="font-bold text-white text-sm mb-2">Winners ({winners.length}/{state.customization.numberOfWinners})</h3>
            <ul className="space-y-1 max-h-[300px] overflow-y-auto">
              {winners.map((w, idx) => (
                <li key={idx} className="text-white text-xs truncate">
                  {idx + 1}. {w}
                </li>
              ))}
            </ul>
            {winners.length > 1 && (
              <Button 
                size="sm" 
                className="mt-2 w-full bg-white/20 text-white hover:bg-white/30"
                onClick={copyAllWinners}
              >
                <Clipboard size={12} className="mr-1" />
                Copy All
              </Button>
            )}
          </div>
        )}
        
        <section className="pt-2 wheel-container">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl mx-auto max-w-md">
            <SpinWheel 
              ref={wheelRef}
              entries={state.entries.filter(entry => !winners.includes(entry))} 
              onComplete={handleWinnerSelected} 
              customization={state.customization}
              spinDuration={5000}
              isSpinning={isSpinning}
              setIsSpinning={setIsSpinning}
              onSpin={() => {}}
              selectedWinner={null}
            />
          </div>
        </section>
        
        <WinnerDisplay 
          winner={winner} 
          onClose={clearWinner} 
          remainingSpins={remainingSpins}
          onCopy={copyWinner}
          isLastWinner={remainingSpins === 0}
          allWinners={winners.length > 1 ? winners : undefined}
          onCopyAll={copyAllWinners}
        />
      </div>
      
      <style>
        {`
          .sparkle {
            position: fixed;
            width: 10px;
            height: 10px;
            background: radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 70%);
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
            animation: sparkle-animation 2s forwards;
          }
          
          @keyframes sparkle-animation {
            0% {
              transform: scale(0);
              opacity: 0;
            }
            50% {
              transform: scale(1);
              opacity: 1;
            }
            100% {
              transform: scale(0);
              opacity: 0;
            }
          }
        `}
      </style>
    </div>
  );
};

export default BrandedWheel;
