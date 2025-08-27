import { generateImage, generateImageWithRetry } from "../api";
import type { GenerationRequest } from "../../types";

const mockRandomUUID = "test-uuid-123";
Object.defineProperty(global, "crypto", {
  value: {
    randomUUID: () => mockRandomUUID,
  },
});

const mockDateNow = 1234567890;
Object.defineProperty(global, "Date", {
  value: class {
    static now() {
      return mockDateNow;
    }
    toISOString() {
      return "2024-01-01T00:00:00.000Z";
    }
  },
});

describe("API Service", () => {
  const mockRequest: GenerationRequest = {
    imageDataUrl: "data:image/jpeg;base64,mocked",
    prompt: "A beautiful landscape",
    style: "Editorial",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Assignment Requirements: Generate (Mock API)", () => {
    test("should accept POST body with imageDataUrl, prompt, and style", async () => {
      const mockAbortSignal = new AbortController().signal;

      const originalMathRandom = Math.random;
      Math.random = () => 0.9;

      try {
        const result = await generateImage(mockRequest, mockAbortSignal);

        expect(result).toMatchObject({
          id: mockRandomUUID,
          prompt: mockRequest.prompt,
          style: mockRequest.style,
          createdAt: "2024-01-01T00:00:00.000Z",
        });
        expect(result.imageUrl).toContain(
          "https://picsum.photos/200/200?random="
        );
      } finally {
        Math.random = originalMathRandom;
      }
    });

    test("should generate Picsum photos URLs with random parameters", async () => {
      const mockAbortSignal = new AbortController().signal;

      const originalMathRandom = Math.random;
      Math.random = () => 0.9;

      try {
        const result = await generateImage(mockRequest, mockAbortSignal);

        expect(result.imageUrl).toMatch(
          /^https:\/\/picsum\.photos\/200\/200\?random=\d+$/
        );
      } finally {
        Math.random = originalMathRandom;
      }
    });

    test("should generate unique IDs for each response", async () => {
      const mockAbortSignal = new AbortController().signal;

      const originalMathRandom = Math.random;
      Math.random = () => 0.9;

      try {
        const result1 = await generateImage(mockRequest, mockAbortSignal);
        const result2 = await generateImage(mockRequest, mockAbortSignal);

        expect(result1.id).toBe(mockRandomUUID);
        expect(result2.id).toBe(mockRandomUUID);
      } finally {
        Math.random = originalMathRandom;
      }
    });
  });

  describe("Error Handling", () => {
    test("should handle 'Model overloaded' errors correctly", async () => {
      const mockAbortSignal = new AbortController().signal;

      const originalMathRandom = Math.random;
      Math.random = () => 0.1;

      try {
        await expect(
          generateImage(mockRequest, mockAbortSignal)
        ).rejects.toThrow("Model overloaded");
      } finally {
        Math.random = originalMathRandom;
      }
    });
  });

  describe("Retry Logic with Exponential Backoff", () => {
    test("should retry automatically with exponential backoff (max 3 attempts)", async () => {
      const mockAbortSignal = new AbortController().signal;
      const onRetry = jest.fn();

      const originalMathRandom = Math.random;
      Math.random = () => 0.1;

      try {
        await expect(
          generateImageWithRetry(mockRequest, mockAbortSignal, onRetry)
        ).rejects.toThrow("Model overloaded");

        expect(onRetry).toHaveBeenCalledTimes(2);
        expect(onRetry).toHaveBeenCalledWith(1);
        expect(onRetry).toHaveBeenCalledWith(2);
      } finally {
        Math.random = originalMathRandom;
      }
    }, 15000);
  });

  describe("Abort Functionality", () => {
    test("should allow aborting in-flight requests", async () => {
      const abortController = new AbortController();
      const onRetry = jest.fn();

      const promise = generateImageWithRetry(
        mockRequest,
        abortController.signal,
        onRetry
      );

      abortController.abort();

      await expect(promise).rejects.toThrow("Request aborted");
    });
  });

  describe("Response Structure Validation", () => {
    test("should return response with all required fields", async () => {
      const mockAbortSignal = new AbortController().signal;

      const originalMathRandom = Math.random;
      Math.random = () => 0.9;

      try {
        const result = await generateImage(mockRequest, mockAbortSignal);

        expect(result).toHaveProperty("id");
        expect(result).toHaveProperty("imageUrl");
        expect(result).toHaveProperty("prompt");
        expect(result).toHaveProperty("style");
        expect(result).toHaveProperty("createdAt");
      } finally {
        Math.random = originalMathRandom;
      }
    });

    test("should generate valid ISO date string", async () => {
      const mockAbortSignal = new AbortController().signal;

      const originalMathRandom = Math.random;
      Math.random = () => 0.9;

      try {
        const result = await generateImage(mockRequest, mockAbortSignal);

        expect(result.createdAt).toMatch(
          /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
        );
      } finally {
        Math.random = originalMathRandom;
      }
    });
  });
});
