import { ChangeEvent, useState, useRef } from 'react';
import { Camera, X } from 'lucide-react';
import Button from './Button';

interface ImageUploadProps {
  onChange: (file: File | null) => void;
  value: File | null;
  existingImageUrl?: string;
  error?: string;
}

const ImageUpload = ({ onChange, value, existingImageUrl, error }: ImageUploadProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    if (file) {
      // Create preview URL
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      onChange(file);
    } else {
      clearImage();
    }
  };

  const clearImage = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  // Determine what to display
  const showPreview = preview;
  const showExisting = !preview && existingImageUrl;

  return (
    <div className="w-full">
      <div className="mt-1 flex flex-col items-center">
        <div 
          className={`w-full h-48 border-2 border-dashed rounded-lg flex flex-col items-center justify-center overflow-hidden 
            ${error ? 'border-error-300' : 'border-gray-300'} 
            ${(showPreview || showExisting) ? 'border-solid bg-gray-100' : 'bg-gray-50 hover:bg-gray-100'}`}
        >
          {showPreview || showExisting ? (
            <div className="relative w-full h-full">
              <img 
                src={showPreview ? preview : existingImageUrl} 
                alt="Preview" 
                className="w-full h-full object-contain"
              />
              <button 
                type="button"
                onClick={clearImage}
                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                aria-label="Remove image"
              >
                <X size={16} className="text-gray-700" />
              </button>
            </div>
          ) : (
            <div className="text-center p-6 cursor-pointer" onClick={handleClick}>
              <Camera className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-2 text-sm text-gray-600">
                <span>Click to upload an image</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                PNG, JPG, JPEG up to 5MB
              </p>
            </div>
          )}
        </div>
        
        {!showPreview && !showExisting && (
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            className="mt-3"
            onClick={handleClick}
          >
            Choose Image
          </Button>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-error-600">{error}</p>
      )}
    </div>
  );
};

export default ImageUpload;