import { render, screen, fireEvent } from "@testing-library/react";
import { PromptInput } from "../PromptInput";

const mockOnPromptChange = jest.fn();
const mockOnStyleChange = jest.fn();

describe("PromptInput Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Assignment Requirements: Prompt & Style", () => {
    test("should have input field for text prompt", () => {
      render(
        <PromptInput
          prompt=""
          style="Editorial"
          onPromptChange={mockOnPromptChange}
          onStyleChange={mockOnStyleChange}
        />
      );

      const promptInput = screen.getByLabelText(/describe your vision/i);
      expect(promptInput).toBeInTheDocument();

      expect(promptInput.tagName).toBe("TEXTAREA");
    });

    test("should have dropdown with at least 3 style options", () => {
      render(
        <PromptInput
          prompt=""
          style="Editorial"
          onPromptChange={mockOnPromptChange}
          onStyleChange={mockOnStyleChange}
        />
      );

      const styleSelect = screen.getByLabelText(/choose a style/i);
      expect(styleSelect).toBeInTheDocument();

      expect(screen.getByText("Editorial")).toBeInTheDocument();
      expect(screen.getByText("Streetwear")).toBeInTheDocument();
      expect(screen.getByText("Vintage")).toBeInTheDocument();
      expect(screen.getByText("Minimalist")).toBeInTheDocument();
      expect(screen.getByText("Artistic")).toBeInTheDocument();
    });

    test("should display current prompt value", () => {
      const testPrompt = "A beautiful sunset over mountains";

      render(
        <PromptInput
          prompt={testPrompt}
          style="Editorial"
          onPromptChange={mockOnPromptChange}
          onStyleChange={mockOnStyleChange}
        />
      );

      const promptInput = screen.getByLabelText(/describe your vision/i);
      expect(promptInput).toHaveValue(testPrompt);
    });

    test("should display current style selection", () => {
      render(
        <PromptInput
          prompt=""
          style="Streetwear"
          onPromptChange={mockOnPromptChange}
          onStyleChange={mockOnStyleChange}
        />
      );

      const styleSelect = screen.getByLabelText(/choose a style/i);
      expect(styleSelect).toHaveValue("Streetwear");
    });

    test("should call onPromptChange when prompt is modified", () => {
      render(
        <PromptInput
          prompt=""
          style="Editorial"
          onPromptChange={mockOnPromptChange}
          onStyleChange={mockOnStyleChange}
        />
      );

      const promptInput = screen.getByLabelText(/describe your vision/i);
      const newPrompt = "A futuristic cityscape";

      fireEvent.change(promptInput, { target: { value: newPrompt } });

      expect(mockOnPromptChange).toHaveBeenCalledWith(newPrompt);
    });

    test("should call onStyleChange when style is selected", () => {
      render(
        <PromptInput
          prompt=""
          style="Editorial"
          onPromptChange={mockOnPromptChange}
          onStyleChange={mockOnStyleChange}
        />
      );

      const styleSelect = screen.getByLabelText(/choose a style/i);

      fireEvent.change(styleSelect, { target: { value: "Vintage" } });

      expect(mockOnStyleChange).toHaveBeenCalledWith("Vintage");
    });
  });

  describe("Input Validation and Behavior", () => {
    test("should handle empty prompt input", () => {
      render(
        <PromptInput
          prompt="Initial prompt"
          style="Editorial"
          onPromptChange={mockOnPromptChange}
          onStyleChange={mockOnStyleChange}
        />
      );

      const promptInput = screen.getByLabelText(/describe your vision/i);
      fireEvent.change(promptInput, { target: { value: "" } });

      expect(mockOnPromptChange).toHaveBeenCalledWith("");
    });

    test("should handle long prompt text", () => {
      const longPrompt =
        "A very long and detailed description of a beautiful landscape with mountains, rivers, trees, clouds, and wildlife that goes on for many sentences to test how the component handles longer text input";

      render(
        <PromptInput
          prompt=""
          style="Editorial"
          onPromptChange={mockOnPromptChange}
          onStyleChange={mockOnStyleChange}
        />
      );

      const promptInput = screen.getByLabelText(/describe your vision/i);
      fireEvent.change(promptInput, { target: { value: longPrompt } });

      expect(mockOnPromptChange).toHaveBeenCalledWith(longPrompt);
    });
  });

  describe("Component Styling and Layout", () => {
    test("should have proper spacing between elements", () => {
      render(
        <PromptInput
          prompt=""
          style="Editorial"
          onPromptChange={mockOnPromptChange}
          onStyleChange={mockOnStyleChange}
        />
      );

      const container = screen.getByText("Describe your vision").closest("div")!
        .parentElement!;
      expect(container).toHaveClass("space-y-4");
    });
  });
});
