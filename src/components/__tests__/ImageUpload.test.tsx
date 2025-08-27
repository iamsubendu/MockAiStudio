import { render, screen, fireEvent } from "@testing-library/react";
import { ImageUpload } from "../ImageUpload";
import type { UploadState } from "../../types";

jest.mock("../../utils/imageProcessor", () => ({
  imageProcessor: {
    validateFile: jest.fn(),
    downscaleImage: jest.fn(),
  },
}));

const mockImageProcessor = {
  validateFile: jest.fn(),
  downscaleImage: jest.fn(),
};

const defaultUploadState: UploadState = {
  file: null,
  preview: null,
  isProcessing: false,
  error: null,
};

const mockOnUploadStateChange = jest.fn();

describe("ImageUpload Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockImageProcessor.validateFile.mockReturnValue({ isValid: true });
    mockImageProcessor.downscaleImage.mockResolvedValue(
      "data:image/jpeg;base64,mock"
    );
  });

  describe("Drag and Drop Functionality", () => {
    test("should show drag over state", () => {
      render(
        <ImageUpload
          uploadState={defaultUploadState}
          onUploadStateChange={mockOnUploadStateChange}
        />
      );

      const dropZone = screen
        .getByText(/or drag and drop here/i)
        .closest("div")!.parentElement!.parentElement!;

      fireEvent.dragOver(dropZone);

      expect(dropZone).toHaveClass("border-blue-500");
      expect(dropZone).toHaveClass("bg-blue-50/80");
      expect(dropZone).toHaveClass("scale-105");
    });
  });

  describe("Accessibility Requirements", () => {
    test("should be keyboard navigable", () => {
      render(
        <ImageUpload
          uploadState={defaultUploadState}
          onUploadStateChange={mockOnUploadStateChange}
        />
      );

      const uploadButton = screen.getByText("Choose Image").closest("label");

      expect(uploadButton).toHaveAttribute("tabIndex", "0");
    });
  });

  describe("Processing States", () => {
    test("should show loading state during image processing", () => {
      const processingState: UploadState = {
        ...defaultUploadState,
        isProcessing: true,
      };

      render(
        <ImageUpload
          uploadState={processingState}
          onUploadStateChange={mockOnUploadStateChange}
        />
      );

      const loadingSpinner = screen
        .getByText(/or drag and drop here/i)
        .closest("div")!
        .parentElement!.querySelector(".animate-spin-slow");
      expect(loadingSpinner).toBeInTheDocument();
    });
  });
});
