import React from "react";
import { ChevronDown } from "lucide-react";
import type { Style } from "../types";

interface PromptInputProps {
  prompt: string;
  style: Style;
  onPromptChange: (prompt: string) => void;
  onStyleChange: (style: Style) => void;
}

const STYLE_OPTIONS: Style[] = [
  "Editorial",
  "Streetwear",
  "Vintage",
  "Minimalist",
  "Artistic",
];

export const PromptInput: React.FC<PromptInputProps> = ({
  prompt,
  style,
  onPromptChange,
  onStyleChange,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label
          htmlFor="prompt-input"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Describe your vision
        </label>
        <textarea
          id="prompt-input"
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          placeholder="A futuristic cityscape with neon lights and flying cars..."
          className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px] sm:min-h-[120px] resize-none transition-all duration-200 bg-gray-50/50 hover:bg-gray-50"
          rows={4}
          aria-describedby="prompt-help"
        />
        <p id="prompt-help" className="text-xs text-gray-500 mt-1">
          Be specific about what you want to see in the generated image
        </p>
      </div>

      <div>
        <label
          htmlFor="style-select"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Choose a style
        </label>
        <div className="relative">
          <select
            id="style-select"
            value={style}
            onChange={(e) => onStyleChange(e.target.value as Style)}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none pr-10 cursor-pointer transition-all duration-200 bg-gray-50/50 hover:bg-gray-50"
            aria-describedby="style-help"
          >
            {STYLE_OPTIONS.map((styleOption) => (
              <option key={styleOption} value={styleOption}>
                {styleOption}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        </div>
        <p id="style-help" className="text-xs text-gray-500 mt-1">
          Select the visual style for your generated image
        </p>
      </div>
    </div>
  );
};
