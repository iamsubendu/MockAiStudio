import type {
  GenerationRequest,
  GenerationResponse,
  GenerationError,
} from "../types";

const MOCK_API_DELAY = 1500;
const MAX_RETRIES = 3;
const ERROR_RATE = 0.2;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const generateMockResponse = (
  request: GenerationRequest
): GenerationResponse => ({
  id: crypto.randomUUID(),
  imageUrl: `https://picsum.photos/200/200?random=${Date.now()}`,
  prompt: request.prompt,
  style: request.style,
  createdAt: new Date().toISOString(),
});

const simulateApiCall = async (
  request: GenerationRequest
): Promise<GenerationResponse | GenerationError> => {
  await delay(MOCK_API_DELAY);

  if (Math.random() < ERROR_RATE) {
    return { message: "Model overloaded" };
  }

  return generateMockResponse(request);
};

export const generateImage = async (
  request: GenerationRequest,
  signal: AbortSignal
): Promise<GenerationResponse> => {
  const response = await simulateApiCall(request);

  if (signal.aborted) {
    throw new Error("Request aborted");
  }

  if ("message" in response) {
    throw new Error(response.message);
  }

  return response;
};

export const generateImageWithRetry = async (
  request: GenerationRequest,
  signal: AbortSignal,
  onRetry?: (attempt: number) => void
): Promise<GenerationResponse> => {
  let lastError: Error;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await generateImage(request, signal);
    } catch (error) {
      lastError = error as Error;

      if (signal.aborted) {
        throw lastError;
      }

      if (attempt < MAX_RETRIES) {
        onRetry?.(attempt);
        const backoffDelay = Math.pow(2, attempt) * 1000;
        await delay(backoffDelay);
      }
    }
  }

  throw lastError!;
};
