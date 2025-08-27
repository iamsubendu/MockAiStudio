import React, { useState } from "react";
import { Clock, Trash2 } from "lucide-react";
import type { HistoryItem } from "../types";

interface HistoryProps {
  history: HistoryItem[];
  onRestore: (item: HistoryItem) => void;
  onClearHistory: () => void;
}

export const History: React.FC<HistoryProps> = ({
  history,
  onRestore,
  onClearHistory,
}) => {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  if (history.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
        <Clock className="w-12 h-12 mx-auto mb-3 text-gray-400" />
        <h3 className="text-lg font-medium text-gray-700 mb-2">
          No generation history yet
        </h3>
        <p className="text-sm text-gray-500">
          Your generated images will appear here
        </p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleImageLoad = (imageUrl: string) => {
    setLoadedImages((prev) => new Set(prev).add(imageUrl));
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Generation History
        </h3>
        <button
          onClick={onClearHistory}
          className="text-sm text-red-600 hover:text-red-700 flex items-center space-x-1"
          aria-label="Clear all history"
        >
          <Trash2 size={14} />
          <span>Clear All</span>
        </button>
      </div>

      <div className="space-y-3">
        {history.map((item) => (
          <div
            key={item.id}
            className="group bg-white rounded-lg p-3 border border-gray-200 hover:border-blue-300 hover:bg-blue-50/30 transition-all duration-200 cursor-pointer relative overflow-hidden"
            onClick={() => onRestore(item)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onRestore(item);
              }
            }}
            tabIndex={0}
            role="button"
            aria-label={`Restore generation: ${item.prompt} in ${item.style} style`}
          >
            {!loadedImages.has(item.imageUrl || "") && (
              <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100">
                <div className="w-full h-full bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer"></div>
              </div>
            )}

            <div className="flex items-center space-x-3 relative z-10">
              <div className="w-14 h-14 rounded-lg flex-shrink-0 overflow-hidden bg-gray-100 relative">
                {item.imageUrl ? (
                  <>
                    {!loadedImages.has(item.imageUrl) && (
                      <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse">
                        <div className="w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer"></div>
                      </div>
                    )}

                    <img
                      src={item.imageUrl}
                      alt={item.prompt}
                      className={`w-full h-full object-cover transition-opacity duration-300 ${
                        loadedImages.has(item.imageUrl)
                          ? "opacity-100"
                          : "opacity-0"
                      }`}
                      onLoad={() => handleImageLoad(item.imageUrl)}
                      onError={() => {
                        const target = event?.target as HTMLImageElement;
                        if (target) {
                          target.style.display = "none";
                          const fallback =
                            target.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = "flex";
                        }
                      }}
                    />
                  </>
                ) : null}

                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400 text-xs">📷</span>
                </div>
              </div>

              <div className="flex-1 min-w-0">
                {!loadedImages.has(item.imageUrl || "") ? (
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse">
                      <div className="w-3/4 h-full bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer"></div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="h-5 w-16 bg-gray-200 rounded-full animate-pulse">
                        <div className="w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer"></div>
                      </div>
                      <div className="h-4 w-20 bg-gray-200 rounded animate-pulse">
                        <div className="w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer"></div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <h4 className="text-sm font-medium text-gray-900 truncate mb-1">
                      {item.prompt}
                    </h4>

                    <div className="flex items-center space-x-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {item.style}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDate(item.createdAt)}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
