import { ImageUpload } from "./ImageUpload";
import { PromptInput } from "./PromptInput";
import { GenerationSummary } from "./GenerationSummary";
import { GenerateButton } from "./GenerateButton";
import { History } from "./History";
import type { UploadState, GenerationState, HistoryItem } from "../types";

interface MainContentProps {
  uploadState: UploadState;
  setUploadState: (state: UploadState) => void;
  prompt: string;
  setPrompt: (prompt: string) => void;
  style: "Editorial" | "Streetwear" | "Vintage" | "Minimalist" | "Artistic";
  setStyle: (
    style: "Editorial" | "Streetwear" | "Vintage" | "Minimalist" | "Artistic"
  ) => void;
  generationState: GenerationState;
  history: HistoryItem[];
  retryCount: number;
  onGenerate: () => void;
  onAbort: () => void;
  onRestoreHistory: (item: HistoryItem) => void;
  onClearHistory: () => void;
}

export const MainContent = ({
  uploadState,
  setUploadState,
  prompt,
  setPrompt,
  style,
  setStyle,
  generationState,
  history,
  retryCount,
  onGenerate,
  onAbort,
  onRestoreHistory,
  onClearHistory,
}: MainContentProps) => {
  return (
    <main className="flex-1 py-4 sm:py-6 lg:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 space-y-6 lg:space-y-8">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl lg:rounded-2xl shadow-lg lg:shadow-xl border border-white/20 p-6 lg:p-8 hover:shadow-xl lg:hover:shadow-2xl transition-all duration-300">
              <h2 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4 lg:mb-6">
                Upload & Configure
              </h2>

              <div className="space-y-6 lg:space-y-8">
                <ImageUpload
                  uploadState={uploadState}
                  onUploadStateChange={setUploadState}
                />

                <PromptInput
                  prompt={prompt}
                  style={style}
                  onPromptChange={setPrompt}
                  onStyleChange={setStyle}
                />
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-xl lg:rounded-2xl shadow-lg lg:shadow-xl border border-white/20 p-6 lg:p-8 hover:shadow-xl lg:hover:shadow-2xl transition-all duration-300">
              <GenerateButton
                generationState={generationState}
                isDisabled={!uploadState.preview || !prompt.trim()}
                onGenerate={onGenerate}
                onAbort={onAbort}
                retryCount={retryCount}
              />

              {generationState.error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p
                    className="text-red-800 text-sm"
                    id="generation-error"
                    role="alert"
                  >
                    {generationState.error}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6 lg:space-y-8">
            <GenerationSummary
              imagePreview={uploadState.preview}
              prompt={prompt}
              style={style}
            />

            <History
              history={history}
              onRestore={onRestoreHistory}
              onClearHistory={onClearHistory}
            />
          </div>
        </div>
      </div>
    </main>
  );
};
