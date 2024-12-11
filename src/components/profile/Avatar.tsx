import React, { useRef } from 'react';
import { Camera } from 'lucide-react';
import { Button } from '../ui/Button';

interface AvatarProps {
  src?: string | null;
  alt: string;
  size?: 'sm' | 'md' | 'lg';
  onUpload?: (file: File) => Promise<void>;
  isEditing?: boolean;
}

const DEFAULT_AVATAR = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23CBD5E1'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E`;

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-16 h-16',
  lg: 'w-24 h-24'
};

export function Avatar({ src, alt, size = 'md', onUpload, isEditing = false }: AvatarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onUpload) {
      await onUpload(file);
    }
  };

  return (
    <div className="relative inline-block">
      <img
        src={src || DEFAULT_AVATAR}
        alt={alt}
        className={`${sizeClasses[size]} rounded-full object-cover bg-gray-100 dark:bg-gray-800`}
      />
      
      {isEditing && onUpload && (
        <>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 rounded-full p-1"
          >
            <Camera className="w-4 h-4" />
          </Button>
        </>
      )}
    </div>
  );
}