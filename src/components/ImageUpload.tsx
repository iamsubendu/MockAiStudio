import React, { useCallback, useState } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { imageProcessor } from "../utils/imageProcessor";
import type { UploadState } from "../types";

interface ImageUploadProps {
  uploadState: UploadState;
  onUploadStateChange: (state: UploadState) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  uploadState,
  onUploadStateChange,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileSelect = useCallback(
    async (file: File) => {
      const validation = imageProcessor.validateFile(file);

      if (!validation.isValid) {
        onUploadStateChange({
          ...uploadState,
          error: validation.error!,
        });
        return;
      }

      onUploadStateChange({
        ...uploadState,
        file,
        isProcessing: true,
        error: null,
      });

      try {
        const preview = await imageProcessor.downscaleImage(file);
        onUploadStateChange({
          ...uploadState,
          file,
          preview,
          isProcessing: false,
          error: null,
        });
      } catch (error) {
        onUploadStateChange({
          ...uploadState,
          file: null,
          preview: null,
          isProcessing: false,
          error: "Failed to process image",
        });
      }
    },
    [uploadState, onUploadStateChange]
  );

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFileSelect(file);
      }
    },
    []
  );

  const clearUpload = useCallback(() => {
    onUploadStateChange({
      file: null,
      preview: null,
      isProcessing: false,
      error: null,
    });
  }, []);

  if (uploadState.preview) {
    return (
      <div className="relative group">
        <img
          src={uploadState.preview}
          alt="Upload preview"
          className="w-full h-64 object-cover rounded-lg"
        />
        <button
          onClick={clearUpload}
          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 focus:opacity-100"
          aria-label="Remove image"
        >
          <X size={16} />
        </button>
      </div>
    );
  }

  return (
    <div
      className={`border-2 border-dashed rounded-xl lg:rounded-2xl p-6 sm:p-8 lg:p-12 text-center transition-all duration-300 ${
        isDragOver
          ? "border-blue-500 bg-blue-50/80 scale-105"
          : "border-gray-300 hover:border-blue-400 hover:bg-blue-50/30 hover:scale-[1.02]"
      }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <input
        type="file"
        accept="image/png,image/jpeg,image/jpg"
        onChange={handleFileInput}
        className="hidden"
        id="image-upload"
        aria-describedby="upload-error"
      />

      <div className="space-y-4">
        <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center shadow-lg">
          {uploadState.isProcessing ? (
            <div className="animate-spin-slow w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full" />
          ) : (
            <ImageIcon className="w-8 h-8 text-gray-400" />
          )}
        </div>

        <div>
          <label
            htmlFor="image-upload"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-lg sm:rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer inline-block shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                document.getElementById("image-upload")?.click();
              }
            }}
          >
            <Upload className="w-4 h-4 inline mr-2" />
            Choose Image
          </label>

          <p className="text-sm text-gray-500 mt-2">or drag and drop here</p>
          <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB</p>
        </div>
      </div>

      {uploadState.error && (
        <p id="upload-error" className="text-red-500 text-sm mt-4" role="alert">
          {uploadState.error}
        </p>
      )}
    </div>
  );
};
