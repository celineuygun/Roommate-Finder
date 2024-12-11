import React, { useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from '../ui/Button';

interface ImageUploadProps {
  onImagesSelected: (files: File[]) => void;
  maxImages?: number;
  previewUrls?: string[];
  onRemoveImage?: (index: number) => void;
}

export function ImageUpload({ 
  onImagesSelected, 
  maxImages = 5,
  previewUrls = [],
  onRemoveImage
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<string[]>(previewUrls);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    if (files.length + previews.length > maxImages) {
      setError(`You can only upload up to ${maxImages} images`);
      return;
    }

    const invalidFiles = files.filter(file => !file.type.startsWith('image/'));
    if (invalidFiles.length > 0) {
      setError('Only image files are allowed');
      return;
    }

    const oversizedFiles = files.filter(file => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setError('Images must be less than 5MB');
      return;
    }

    setError(null);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews([...previews, ...newPreviews]);
    onImagesSelected(files);
  };

  const handleRemove = (index: number) => {
    const newPreviews = [...previews];
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);
    onRemoveImage?.(index);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Images</h3>
          <p className="text-sm text-gray-500">
            Add up to {maxImages} images of your space
          </p>
        </div>
        {previews.length < maxImages && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Images
          </Button>
        )}
      </div>

      {error && (
        <div className="text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        multiple
        className="hidden"
      />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {previews.map((preview, index) => (
          <div key={preview} className="relative aspect-video">
            <img
              src={preview}
              alt={`Preview ${index + 1}`}
              className="w-full h-full object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="absolute top-2 right-2 p-1 bg-white dark:bg-slate-950  rounded-full shadow-md hover:bg-gray-100"
            >
              <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}