import React from "react";
import { Play, Loader2, X } from "lucide-react";
import type { GenerationState } from "../types";

interface GenerateButtonProps {
  generationState: GenerationState;
  isDisabled: boolean;
  onGenerate: () => void;
  onAbort: () => void;
  retryCount: number;
}

export const GenerateButton: React.FC<GenerateButtonProps> = ({
  generationState,
  isDisabled,
  onGenerate,
  onAbort,
  retryCount,
}) => {
  if (generationState.isGenerating) {
    return (
      <div className="space-y-3">
        <button
          onClick={onAbort}
          className="bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-gray-800 font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-lg sm:rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 w-full flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          aria-label="Abort generation"
        >
          <X size={16} />
          <span>Abort Generation</span>
        </button>

        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
            <span className="text-sm text-gray-600">
              Generating your image...
            </span>
          </div>

          {retryCount > 0 && (
            <p className="text-xs text-gray-500">
              Retry attempt {retryCount} of 3
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={onGenerate}
      disabled={isDisabled}
      className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-lg sm:rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${
        isDisabled
          ? "opacity-50 cursor-not-allowed hover:from-blue-600 hover:to-purple-600"
          : ""
      }`}
      aria-describedby={generationState.error ? "generation-error" : undefined}
    >
      <Play className="w-4 h-4 inline mr-2" />
      Generate Image
    </button>
  );
};
