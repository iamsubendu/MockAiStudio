export interface GenerationRequest {
  imageDataUrl: string;
  prompt: string;
  style: Style;
}

export interface GenerationResponse {
  id: string;
  imageUrl: string;
  prompt: string;
  style: Style;
  createdAt: string;
}

export interface GenerationError {
  message: string;
}

export type Style =
  | "Editorial"
  | "Streetwear"
  | "Vintage"
  | "Minimalist"
  | "Artistic";

export interface HistoryItem {
  id: string;
  imageUrl: string;
  prompt: string;
  style: Style;
  createdAt: string;
}

export interface UploadState {
  file: File | null;
  preview: string | null;
  isProcessing: boolean;
  error: string | null;
}

export interface GenerationState {
  isGenerating: boolean;
  currentRequest: AbortController | null;
  retryCount: number;
  error: string | null;
}

