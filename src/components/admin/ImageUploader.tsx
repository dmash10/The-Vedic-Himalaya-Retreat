import { useState, useRef } from 'react';
import { Upload, Link as LinkIcon, Image as ImageIcon, Check, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useImageZones } from '@/hooks/useImageZones';
import { toast } from 'sonner';

interface ImageUploaderProps {
  currentImage: string;
  onImageChange: (newPath: string) => void;
  label?: string;
  aspectRatio?: string; // Tailwind class name like 'aspect-video', 'aspect-square', or 'h-32 w-full'
}

export default function ImageUploader({
  currentImage,
  onImageChange,
  label = 'Image',
  aspectRatio = 'aspect-video'
}: ImageUploaderProps) {
  const { uploadImageDirect, uploading } = useImageZones();
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlValue, setUrlValue] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleFileSelect = async (file: File) => {
    if (!file) return;

    // Instantly show local preview
    const objectUrl = URL.createObjectURL(file);
    setLocalPreview(objectUrl);
    setFeedback(null);

    try {
      const result = await uploadImageDirect(file);
      if (result?.success && result.url) {
        onImageChange(result.url);
        setLocalPreview(null);
        URL.revokeObjectURL(objectUrl);
        showFeedback('success', 'Uploaded successfully!');
      } else {
        setLocalPreview(null);
        URL.revokeObjectURL(objectUrl);
        showFeedback('error', 'Upload failed');
      }
    } catch (error) {
      setLocalPreview(null);
      URL.revokeObjectURL(objectUrl);
      showFeedback('error', 'Upload failed. Please try again.');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFileSelect(file);
    }
  };

  const handleUrlSubmit = () => {
    if (urlValue.trim()) {
      onImageChange(urlValue.trim());
      setShowUrlInput(false);
      setUrlValue('');
      showFeedback('success', 'Image URL updated!');
    }
  };

  const displayImage = localPreview || currentImage;

  return (
    <div className="space-y-3">
      <label className="block text-[10px] font-bold text-[#C4A665] uppercase tracking-[0.2em] mb-1">
        {label}
      </label>

      {/* Preview Container */}
      <div
        className={`relative overflow-hidden rounded-lg border-2 border-dashed transition-colors flex items-center justify-center bg-[#060B0A] ${
          dragOver ? 'border-[#C4A665] bg-[#C4A665]/10' : 'border-white/10 hover:border-white/20'
        } ${aspectRatio}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        {displayImage ? (
          <img
            key={displayImage}
            src={displayImage}
            alt="Preview"
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (!target.dataset.fallback) {
                target.dataset.fallback = 'true';
                target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect fill="%230D1412" width="400" height="300"/%3E%3Ctext fill="%238E9F96" x="50%25" y="50%25" text-anchor="middle" dy=".3em" font-family="sans-serif" font-size="12"%3EImage Not Found%3C/text%3E%3C/svg%3E';
              }
            }}
          />
        ) : (
          <div
            className="w-full h-full flex flex-col items-center justify-center gap-2 cursor-pointer py-6"
            onClick={() => fileInputRef.current?.click()}
          >
            <ImageIcon className="h-10 w-10 text-white/20" />
            <p className="text-[9px] text-[#8E9F96] uppercase tracking-widest font-bold">Click or drag to upload</p>
          </div>
        )}

        {/* Uploading indicator */}
        {uploading && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-3">
            <Loader2 className="animate-spin h-7 w-7 text-[#C4A665]" />
            <p className="text-[9px] text-[#8E9F96] uppercase tracking-widest font-bold animate-pulse">Compressing & Uploading...</p>
          </div>
        )}

        {/* Drag over state label */}
        {dragOver && (
          <div className="absolute inset-0 bg-[#C4A665]/20 flex items-center justify-center pointer-events-none">
            <p className="text-white text-xs font-bold uppercase tracking-wider">Drop to upload</p>
          </div>
        )}
      </div>

      {/* Feedback Alert */}
      {feedback && (
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider animate-in fade-in slide-in-from-top-2 duration-300 ${
          feedback.type === 'success'
            ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
            : 'bg-red-500/10 border border-red-500/20 text-red-400'
        }`}>
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          {feedback.message}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-[#1C2E2A] text-white text-xs font-bold rounded-lg border border-[#1C2E2A] hover:bg-[#253D38] transition-colors cursor-pointer disabled:opacity-50"
        >
          <Upload className="h-3.5 w-3.5" />
          UPLOAD FILE
        </button>

        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className={`flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${
            showUrlInput 
              ? 'bg-[#C4A665] text-black border-[#C4A665]' 
              : 'bg-[#1C2E2A] text-white border-[#1C2E2A] hover:bg-[#253D38]'
          }`}
        >
          <LinkIcon className="h-3.5 w-3.5" />
          URL LINK
        </button>
      </div>

      {/* URL Paste Input */}
      {showUrlInput && (
        <div className="relative group/url animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-stretch bg-white/5 border border-white/10 rounded-lg overflow-hidden focus-within:border-[#C4A665] transition-all">
            <div className="flex items-center px-3 bg-white/5 border-r border-white/10">
              <LinkIcon className="h-3.5 w-3.5 text-[#C4A665]" />
            </div>
            <input
              type="text"
              value={urlValue}
              onChange={(e) => setUrlValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
              placeholder="Paste external image link here..."
              className="flex-1 px-3 py-2 bg-transparent text-white text-xs focus:outline-none placeholder:text-white/20"
              autoFocus
            />
            <button
              type="button"
              onClick={handleUrlSubmit}
              className="px-3 flex items-center justify-center bg-[#C4A665]/10 text-[#C4A665] hover:bg-[#C4A665] hover:text-black transition-all border-l border-white/10 cursor-pointer"
            >
              <Check className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Display Current Link */}
      {currentImage && (
        <div className="px-1 text-[9px] text-[#8E9F96]/60 truncate font-mono select-all hover:text-[#8E9F96]" title={currentImage}>
          URL: {currentImage}
        </div>
      )}
    </div>
  );
}
