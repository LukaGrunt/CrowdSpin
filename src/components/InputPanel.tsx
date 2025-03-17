
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, AlertCircle, Image } from 'lucide-react';
import { parseFileContent } from '../utils/wheelUtils';
import { toast } from 'sonner';

interface InputPanelProps {
  entries: string[];
  setEntries: React.Dispatch<React.SetStateAction<string[]>>;
  onImport: (importedEntries: string[]) => void;
  onLogoUpload?: (logoUrl: string | null) => void;
  onBackgroundUpload?: (backgroundUrl: string | null) => void;
}

const InputPanel: React.FC<InputPanelProps> = ({ 
  entries,
  setEntries,
  onImport,
  onLogoUpload,
  onBackgroundUpload 
}) => {
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingBackground, setIsUploadingBackground] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [backgroundPreview, setBackgroundPreview] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const backgroundInputRef = useRef<HTMLInputElement>(null);
  
  const handleManualInput = () => {
    if (!inputText.trim()) {
      toast.error('Please enter at least one name or item');
      return;
    }
    
    const newEntries = parseFileContent(inputText);
    if (newEntries.length === 0) {
      toast.error('No valid entries found');
      return;
    }
    
    setEntries(newEntries);
    toast.success(`Added ${newEntries.length} entries to the wheel`);
  };
  
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check if file is too large (>50MB)
    if (file.size > 50 * 1024 * 1024) {
      toast.error('File is too large. Maximum size is 50MB');
      return;
    }
    
    try {
      setIsProcessing(true);
      const content = await file.text();
      const parsedEntries = parseFileContent(content);
      
      if (parsedEntries.length === 0) {
        toast.error('No valid entries found in the file');
        return;
      }
      
      if (parsedEntries.length > 200000) {
        toast.warning(`Large dataset detected: ${parsedEntries.length.toLocaleString()} entries. Performance may be affected.`);
      }
      
      onImport(parsedEntries);
      toast.success(`Successfully loaded ${parsedEntries.length.toLocaleString()} entries from ${file.name}`);
      
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      toast.error('Error reading file: ' + (error as Error).message);
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Handle logo upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.match('image.*')) {
      toast.error('Please upload an image file');
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image is too large. Maximum size is 5MB');
      return;
    }
    
    setIsUploading(true);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const logoUrl = event.target.result as string;
        setLogoPreview(logoUrl);
        if (onLogoUpload) {
          onLogoUpload(logoUrl);
        }
        toast.success('Logo uploaded successfully');
      }
      setIsUploading(false);
    };
    
    reader.onerror = () => {
      toast.error('Error reading file');
      setIsUploading(false);
    };
    
    reader.readAsDataURL(file);
  };

  // Handle background image upload
  const handleBackgroundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.match('image.*')) {
      toast.error('Please upload an image file');
      return;
    }
    
    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image is too large. Maximum size is 10MB');
      return;
    }
    
    setIsUploadingBackground(true);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const backgroundUrl = event.target.result as string;
        setBackgroundPreview(backgroundUrl);
        if (onBackgroundUpload) {
          onBackgroundUpload(backgroundUrl);
        }
        toast.success('Background image uploaded successfully');
      }
      setIsUploadingBackground(false);
    };
    
    reader.onerror = () => {
      toast.error('Error reading file');
      setIsUploadingBackground(false);
    };
    
    reader.readAsDataURL(file);
  };
  
  return (
    <motion.div 
      className="glass-panel p-6 md:p-8 w-full max-w-xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <h2 className="text-xl font-bold text-white mb-4">Add Your Entries</h2>
      
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <FileText size={18} className="text-white/80" />
          <label htmlFor="manual-entries" className="text-white font-medium">
            Manual Entry
          </label>
        </div>
        <textarea
          id="manual-entries"
          className="input-field w-full h-32 resize-none"
          placeholder="Enter names or items (one per line)..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <p className="text-xs text-white/70 mt-1">Enter one name or item per line</p>
      </div>
      
      <div className="flex gap-4 mb-6">
        <motion.button
          className="btn-primary flex-1 flex items-center justify-center gap-2"
          onClick={handleManualInput}
          whileTap={{ scale: 0.97 }}
        >
          <span>Add Entries</span>
        </motion.button>
        
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,.csv,.json"
          className="hidden"
          onChange={handleFileUpload}
          id="file-upload"
        />
        
        <motion.button
          className="btn-secondary flex-1 flex items-center justify-center gap-2"
          onClick={() => fileInputRef.current?.click()}
          disabled={isProcessing}
          whileTap={{ scale: 0.97 }}
        >
          {isProcessing ? 'Processing...' : (
            <>
              <Upload size={18} />
              <span>Upload File</span>
            </>
          )}
        </motion.button>
      </div>
      
      <div className="bg-white/10 p-3 rounded-lg flex items-start gap-2 mb-6">
        <AlertCircle size={20} className="text-white shrink-0 mt-0.5" />
        <p className="text-sm text-white/90">
          Supports TXT or CSV files with one entry per line. 
          Optimized for large datasets (200,000+ entries).
        </p>
      </div>
      
      {/* Logo upload section */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Image size={18} className="text-white/80" />
          <label htmlFor="logo-upload" className="text-white font-medium">
            Upload Logo (Optional)
          </label>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <input
              ref={logoInputRef}
              type="file"
              id="logo-upload"
              accept="image/*"
              className="hidden"
              onChange={handleLogoUpload}
            />
            <motion.button
              className="btn-primary w-full flex items-center justify-center gap-2"
              onClick={() => logoInputRef.current?.click()}
              disabled={isUploading}
              whileTap={{ scale: 0.97 }}
            >
              {isUploading ? 'Uploading...' : (
                <>
                  <Upload size={18} />
                  <span>Choose Image</span>
                </>
              )}
            </motion.button>
          </div>
          
          {logoPreview && (
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-white/20 flex items-center justify-center p-1">
              <img 
                src={logoPreview} 
                alt="Logo Preview" 
                className="max-w-full max-h-full object-contain"
              />
            </div>
          )}
        </div>
        <p className="text-xs text-white/70 mt-1">Recommended size: 200x200px, Max 5MB</p>
      </div>

      {/* Background image upload */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Image size={18} className="text-white/80" />
          <label htmlFor="background-upload" className="text-white font-medium">
            Background Image (Optional)
          </label>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <input
              ref={backgroundInputRef}
              type="file"
              id="background-upload"
              accept="image/*"
              className="hidden"
              onChange={handleBackgroundUpload}
            />
            <motion.button
              className="btn-primary w-full flex items-center justify-center gap-2"
              onClick={() => backgroundInputRef.current?.click()}
              disabled={isUploadingBackground}
              whileTap={{ scale: 0.97 }}
            >
              {isUploadingBackground ? 'Uploading...' : (
                <>
                  <Upload size={18} />
                  <span>Choose Background</span>
                </>
              )}
            </motion.button>
          </div>
          
          {backgroundPreview && (
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-white/20 flex items-center justify-center p-1">
              <img 
                src={backgroundPreview} 
                alt="Background Preview" 
                className="max-w-full max-h-full object-cover"
              />
            </div>
          )}
        </div>
        <p className="text-xs text-white/70 mt-1">Max 10MB</p>
      </div>
    </motion.div>
  );
};

export default InputPanel;
