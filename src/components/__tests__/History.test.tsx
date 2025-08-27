import { render, screen, fireEvent } from "@testing-library/react";
import { History } from "../History";
import type { HistoryItem } from "../../types";

jest.mock("../../utils/imageProcessor", () => ({
  downscaleImage: jest.fn().mockResolvedValue("data:image/jpeg;base64,mocked"),
}));

describe("History Component", () => {
  const mockHistoryItem: HistoryItem = {
    id: "test-uuid-123",
    imageUrl: "https://picsum.photos/400/400?random=123",
    prompt: "A beautiful landscape",
    style: "Editorial",
    createdAt: "2024-01-01T10:00:00.000Z",
  };

  const mockOnRestore = jest.fn();
  const mockOnClearHistory = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Basic Rendering", () => {
    test("should display generation history title", () => {
      const history = [mockHistoryItem];

      render(
        <History
          history={history}
          onRestore={mockOnRestore}
          onClearHistory={mockOnClearHistory}
        />
      );

      expect(screen.getByText("Generation History")).toBeInTheDocument();
    });

    test("should show empty state when no history", () => {
      render(
        <History
          history={[]}
          onRestore={mockOnRestore}
          onClearHistory={mockOnClearHistory}
        />
      );

      expect(screen.getByText("No generation history yet")).toBeInTheDocument();
      expect(
        screen.getByText("Your generated images will appear here")
      ).toBeInTheDocument();
    });

    test("should display history items correctly", () => {
      const history = [mockHistoryItem];

      render(
        <History
          history={history}
          onRestore={mockOnRestore}
          onClearHistory={mockOnClearHistory}
        />
      );

      expect(screen.getByText("Generation History")).toBeInTheDocument();

      const img = screen.getByAltText("A beautiful landscape");
      expect(img).toBeInTheDocument();

      expect(screen.getByText("📷")).toBeInTheDocument();
    });
  });

  describe("History Item Display", () => {
    test("should save id, imageUrl, prompt, style, and createdAt", () => {
      const history = [mockHistoryItem];

      render(
        <History
          history={history}
          onRestore={mockOnRestore}
          onClearHistory={mockOnClearHistory}
        />
      );

      const img = screen.getByAltText("A beautiful landscape");
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute(
        "src",
        "https://picsum.photos/400/400?random=123"
      );
    });

    test("should display image thumbnails", () => {
      const history = [mockHistoryItem];

      render(
        <History
          history={history}
          onRestore={mockOnRestore}
          onClearHistory={mockOnClearHistory}
        />
      );

      const img = screen.getByAltText("A beautiful landscape");
      expect(img).toBeInTheDocument();
    });

    test("should show fallback for failed image loads", () => {
      const history = [mockHistoryItem];

      render(
        <History
          history={history}
          onRestore={mockOnRestore}
          onClearHistory={mockOnClearHistory}
        />
      );

      expect(screen.getByText("📷")).toBeInTheDocument();
    });

    test("should handle history items without imageUrl", () => {
      const historyItemWithoutImage: HistoryItem = {
        ...mockHistoryItem,
        imageUrl: "",
      };

      const history = [historyItemWithoutImage];

      render(
        <History
          history={history}
          onRestore={mockOnRestore}
          onClearHistory={mockOnClearHistory}
        />
      );

      expect(screen.getByText("📷")).toBeInTheDocument();
    });
  });

  describe("Multiple History Items", () => {
    test("should display multiple history items", () => {
      const multipleHistory: HistoryItem[] = [
        mockHistoryItem,
        {
          ...mockHistoryItem,
          id: "test-uuid-456",
          prompt: "A vintage car",
          style: "Vintage",
        },
      ];

      render(
        <History
          history={multipleHistory}
          onRestore={mockOnRestore}
          onClearHistory={mockOnClearHistory}
        />
      );

      const img1 = screen.getByAltText("A beautiful landscape");
      const img2 = screen.getByAltText("A vintage car");
      expect(img1).toBeInTheDocument();
      expect(img2).toBeInTheDocument();
    });
  });

  describe("Interactive Elements", () => {
    test("should call onRestore when history item is clicked", () => {
      const history = [mockHistoryItem];

      render(
        <History
          history={history}
          onRestore={mockOnRestore}
          onClearHistory={mockOnClearHistory}
        />
      );

      const historyItem = screen.getByLabelText(
        "Restore generation: A beautiful landscape in Editorial style"
      );

      expect(historyItem).toHaveClass("hover:border-blue-300");
      expect(historyItem).toHaveClass("hover:bg-blue-50/30");
    });

    test("should show hover effects on clear button", () => {
      const history = [mockHistoryItem];

      render(
        <History
          history={history}
          onRestore={mockOnRestore}
          onClearHistory={mockOnClearHistory}
        />
      );

      const clearButton = screen.getByText("Clear All");

      const buttonElement = clearButton.closest("button");
      expect(buttonElement).toHaveClass("hover:text-red-700");
    });
  });

  describe("Error Handling", () => {
    test("should handle malformed history data gracefully", () => {
      const malformedHistory: HistoryItem[] = [
        {
          ...mockHistoryItem,
          prompt: "A beautiful landscape",
        },
      ];

      render(
        <History
          history={malformedHistory}
          onRestore={mockOnRestore}
          onClearHistory={mockOnClearHistory}
        />
      );

      expect(screen.getByText("Generation History")).toBeInTheDocument();
    });
  });

  describe("Clear History Functionality", () => {
    test("should have clear all history button", () => {
      const history = [mockHistoryItem];

      render(
        <History
          history={history}
          onRestore={mockOnRestore}
          onClearHistory={mockOnClearHistory}
        />
      );

      const clearButton = screen.getByText("Clear All");
      expect(clearButton).toBeInTheDocument();
    });

    test("should call onClearHistory when clear button is clicked", () => {
      const history = [mockHistoryItem];

      render(
        <History
          history={history}
          onRestore={mockOnRestore}
          onClearHistory={mockOnClearHistory}
        />
      );

      const clearButton = screen.getByText("Clear All");
      fireEvent.click(clearButton);

      expect(mockOnClearHistory).toHaveBeenCalled();
    });
  });

  describe("Accessibility Requirements", () => {
    test("should be keyboard navigable", () => {
      const history = [mockHistoryItem];

      render(
        <History
          history={history}
          onRestore={mockOnRestore}
          onClearHistory={mockOnClearHistory}
        />
      );

      const historyItem = screen.getByLabelText(
        "Restore generation: A beautiful landscape in Editorial style"
      );
      expect(historyItem).toHaveAttribute("tabIndex", "0");
      expect(historyItem).toHaveAttribute("role", "button");
    });

    test("should have proper ARIA labels", () => {
      const history = [mockHistoryItem];

      render(
        <History
          history={history}
          onRestore={mockOnRestore}
          onClearHistory={mockOnClearHistory}
        />
      );

      expect(
        screen.getByLabelText(
          "Restore generation: A beautiful landscape in Editorial style"
        )
      ).toBeInTheDocument();
    });

    test("should handle keyboard events", () => {
      const history = [mockHistoryItem];

      render(
        <History
          history={history}
          onRestore={mockOnRestore}
          onClearHistory={mockOnClearHistory}
        />
      );

      const historyItem = screen.getByLabelText(
        "Restore generation: A beautiful landscape in Editorial style"
      );

      fireEvent.keyDown(historyItem, { key: "Enter" });
      expect(mockOnRestore).toHaveBeenCalledWith(mockHistoryItem);

      fireEvent.keyDown(historyItem, { key: " " });
      expect(mockOnRestore).toHaveBeenCalledWith(mockHistoryItem);
    });
  });
});
