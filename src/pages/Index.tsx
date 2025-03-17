
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputPanel from '../components/InputPanel';
import CustomizationPanel, { WheelCustomization } from '../components/CustomizationPanel';
import BackgroundWheel from '../components/BackgroundWheel';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import { Button } from '../components/ui/button';
import { ArrowRight, Info, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const Index = () => {
  const [entries, setEntries] = useState<string[]>([]);
  const [customization, setCustomization] = useState<WheelCustomization>({
    primaryColor: '#7c3aed',
    secondaryColor: '#bae6fd',
    title: 'Crowd Spin',
    logoUrl: null,
    backgroundImage: null,
    winnerEffect: 'confetti',
    additionalText: '',
    numberOfWinners: 1,
    textColor: 'white'
  });
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();

  const handleImport = (importedEntries: string[]) => {
    setEntries(importedEntries);
  };

  const handleCreate = async () => {
    if (!entries.length) {
      toast.error('Please add at least one entry to create a wheel.');
      return;
    }

    setIsCreating(true);
    try {
      const validatedEntries = entries.filter(entry => entry.trim() !== '');
      if (validatedEntries.length === 0) {
        toast.error('Entries cannot be empty. Please provide valid entries.');
        setIsCreating(false);
        return;
      }

      navigate('/branded-wheel', { state: { entries: validatedEntries, customization } });
    } catch (error) {
      console.error("Error during wheel creation:", error);
      toast.error('Failed to create wheel. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleSaveImage = () => {
    // Fixed toast usage to match the sonner API
    toast.info("Feature Coming Soon", {
      description: "The save image functionality will be available in the next update."
    });
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden px-4 pb-12">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <BackgroundWheel />
      </div>

      <HeroSection />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <InputPanel 
              entries={entries} 
              setEntries={setEntries} 
              onImport={handleImport} 
              onLogoUpload={(logoUrl) => {
                setCustomization(prev => ({ ...prev, logoUrl }));
              }}
              onBackgroundUpload={(backgroundUrl) => {
                setCustomization(prev => ({ ...prev, backgroundImage: backgroundUrl }));
              }}
            />
          </div>
          
          <div>
            <CustomizationPanel 
              customization={customization}
              setCustomization={setCustomization}
              onSaveImage={handleSaveImage}
            />
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <Button 
            onClick={handleCreate}
            disabled={isCreating || !entries.length}
            size="lg"
            className="text-lg px-8 py-6 relative group overflow-hidden shadow-lg"
          >
            {isCreating ? (
              <>
                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                Create Wheel
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </>
            )}
            <span className="absolute inset-0 bg-white/20 transform -translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </Button>
          
          <p className="mt-4 text-white/70 flex items-center justify-center gap-2">
            <Info size={14} />
            <span className="text-sm">Add at least one entry to create a wheel</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
