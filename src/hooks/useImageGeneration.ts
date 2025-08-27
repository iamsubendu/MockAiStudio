import { useState, useCallback, useEffect } from "react";
import { generateImageWithRetry } from "../services/api";
import { storageService } from "../services/storage";
import type {
  GenerationState,
  UploadState,
  HistoryItem,
  Style,
  GenerationRequest,
} from "../types";

export const useImageGeneration = () => {
  const [uploadState, setUploadState] = useState<UploadState>({
    file: null,
    preview: null,
    isProcessing: false,
    error: null,
  });

  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState<Style>("Editorial");
  const [generationState, setGenerationState] = useState<GenerationState>({
    isGenerating: false,
    currentRequest: null,
    retryCount: 0,
    error: null,
  });

  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    setHistory(storageService.getHistory());
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!uploadState.preview || !prompt.trim()) return;

    const abortController = new AbortController();
    setGenerationState((prev) => ({
      ...prev,
      isGenerating: true,
      currentRequest: abortController,
      retryCount: 0,
      error: null,
    }));

    try {
      const request: GenerationRequest = {
        imageDataUrl: uploadState.preview,
        prompt: prompt.trim(),
        style,
      };

      const response = await generateImageWithRetry(
        request,
        abortController.signal,
        (attempt) => {
          setGenerationState((prev) => ({
            ...prev,
            retryCount: attempt,
          }));
        }
      );

      const historyItem: HistoryItem = {
        id: response.id,
        imageUrl: response.imageUrl,
        prompt: response.prompt,
        style: response.style,
        createdAt: response.createdAt,
      };

      const updatedHistory = storageService.addToHistory(historyItem);
      setHistory(updatedHistory);

      setGenerationState((prev) => ({
        ...prev,
        isGenerating: false,
        currentRequest: null,
        retryCount: 0,
        error: null,
      }));
    } catch (error) {
      if (error instanceof Error && error.message !== "Request aborted") {
        setGenerationState((prev) => ({
          ...prev,
          isGenerating: false,
          currentRequest: null,
          retryCount: 0,
          error: error.message,
        }));
      }
    }
  }, [uploadState.preview, prompt, style]);

  const handleAbort = useCallback(() => {
    if (generationState.currentRequest) {
      generationState.currentRequest.abort();
      setGenerationState((prev) => ({
        ...prev,
        isGenerating: false,
        currentRequest: null,
        retryCount: 0,
        error: null,
      }));
    }
  }, [generationState.currentRequest]);

  const handleRestoreHistory = useCallback((item: HistoryItem) => {
    setPrompt(item.prompt);
    setStyle(item.style);
    setUploadState((prev) => ({
      ...prev,
      preview: item.imageUrl,
      file: null,
    }));
  }, []);

  const handleClearHistory = useCallback(() => {
    storageService.clearHistory();
    setHistory([]);
  }, []);

  return {
    uploadState,
    setUploadState,
    prompt,
    setPrompt,
    style,
    setStyle,
    generationState,
    history,
    retryCount: generationState.retryCount,
    handleGenerate,
    handleAbort,
    handleRestoreHistory,
    handleClearHistory,
  };
};
