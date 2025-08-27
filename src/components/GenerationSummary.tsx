import React, { useState } from "react";
import { ImageIcon } from "lucide-react";
import type { Style } from "../types";

interface GenerationSummaryProps {
  imagePreview: string | null;
  prompt: string;
  style: Style;
}

export const GenerationSummary: React.FC<GenerationSummaryProps> = ({
  imagePreview,
  prompt,
  style,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  if (!imagePreview) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-xl lg:rounded-2xl shadow-lg border-2 border-dashed border-gray-300 p-6 lg:p-8">
        <div className="text-center text-gray-500">
          <ImageIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-sm">Upload an image to see a preview</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl lg:rounded-2xl shadow-xl border border-white/20 p-6 lg:p-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Generation Summary
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image Preview
          </label>
          <div className="relative w-full h-48 rounded-lg border border-gray-200 overflow-hidden">
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse">
                <div className="w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer"></div>
              </div>
            )}

            <img
              src={imagePreview}
              alt="Upload preview"
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setImageLoaded(true)}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Prompt
          </label>
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <p className="text-gray-800 text-sm">
              {prompt || (
                <span className="text-gray-400 italic">
                  No prompt entered yet
                </span>
              )}
            </p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Style
          </label>
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {style}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
