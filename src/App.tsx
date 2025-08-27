import { Header } from "./components/Header";
import { MainContent } from "./components/MainContent";
import { Footer } from "./components/Footer";
import { useImageGeneration } from "./hooks/useImageGeneration";

export default function App() {
  const {
    uploadState,
    setUploadState,
    prompt,
    setPrompt,
    style,
    setStyle,
    generationState,
    history,
    retryCount,
    handleGenerate,
    handleAbort,
    handleRestoreHistory,
    handleClearHistory,
  } = useImageGeneration();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex flex-col">
      <Header />
      <MainContent
        uploadState={uploadState}
        setUploadState={setUploadState}
        prompt={prompt}
        setPrompt={setPrompt}
        style={style}
        setStyle={setStyle}
        generationState={generationState}
        history={history}
        retryCount={retryCount}
        onGenerate={handleGenerate}
        onAbort={handleAbort}
        onRestoreHistory={handleRestoreHistory}
        onClearHistory={handleClearHistory}
      />
      <Footer />
    </div>
  );
}
