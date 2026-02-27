import { useState, useEffect } from "react";
import { Sidebar } from "./components/Sidebar";
import { NewsCard } from "./components/NewsCard";
import { MarketAnalysis } from "./components/MarketAnalysis";
import { EmailModal } from "./components/EmailModal";
import { fetchCuratedNews } from "./services/geminiService";
import { copyToNotepad, downloadPdf, downloadPpt } from "./utils/exportUtils";
import { NewsItem, DashboardState } from "./types";
import { Loader2 } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<"feed" | "analysis">("feed");
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [state, setState] = useState<DashboardState>({
    news: [],
    isLoading: false,
    lastUpdated: null
  });

  const handleRefresh = async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const news = await fetchCuratedNews();
      setState({
        news,
        isLoading: false,
        lastUpdated: new Date().toISOString()
      });
    } catch (error) {
      console.error("Failed to fetch news:", error);
      alert("Failed to fetch news. Please check your API key and try again.");
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleSendEmail = () => {
    if (state.news.length === 0) {
      alert("Please load news first.");
      return;
    }
    setIsEmailModalOpen(true);
  };

  const handleDownloadPdf = async () => {
    if (state.news.length === 0) {
      alert("Please load news first.");
      return;
    }
    
    setState(prev => ({ ...prev, isExporting: true }));
    
    try {
      await downloadPdf();
    } finally {
      setState(prev => ({ ...prev, isExporting: false }));
    }
  };

  const handleDownloadPpt = () => {
    if (state.news.length === 0) {
      alert("Please load news first.");
      return;
    }
    downloadPpt(state.news);
  };

  const handleCopyAll = () => {
    if (state.news.length === 0) {
      alert("Please load news first.");
      return;
    }
    copyToNotepad(state.news);
  };

  // Load initial data (optional, but good for UX)
  // useEffect(() => {
  //   handleRefresh();
  // }, []);

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex print:bg-white">
      <div className="print:hidden">
        <Sidebar 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onRefresh={handleRefresh}
          onSendEmail={handleSendEmail}
          onDownloadPdf={handleDownloadPdf}
          onDownloadPpt={handleDownloadPpt}
          onCopyAll={handleCopyAll}
          isLoading={state.isLoading}
          isExporting={state.isExporting}
        />
      </div>

      <main id="dashboard-content" className="flex-1 ml-64 p-8 lg:p-12 print:ml-0 print:p-0">
        <header className="mb-12 flex justify-between items-end print:mb-6">
          <div>
            <h2 className="text-3xl font-serif font-bold text-[var(--color-brand-black)] mb-2">
              {activeTab === "feed" ? "Today's Top 10 News" : "Market Analysis"}
            </h2>
            <p className="text-sm font-sans text-gray-500">
              {state.lastUpdated 
                ? `Last updated: ${new Date(state.lastUpdated).toLocaleString()}`
                : "Click 'Refresh News' to load the latest curated news."}
            </p>
          </div>
        </header>

        {state.isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400 print:hidden">
            <Loader2 className="w-8 h-8 animate-spin mb-4 text-[var(--color-brand-green)]" />
            <p className="text-sm font-mono uppercase tracking-widest">Curating Global News...</p>
          </div>
        ) : state.news.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400 bg-white rounded-2xl border border-dashed border-gray-200 print:hidden">
            <p className="text-sm font-mono uppercase tracking-widest">No news loaded.</p>
            <button 
              onClick={handleRefresh}
              className="mt-4 px-6 py-2 bg-[var(--color-brand-black)] text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              Load News Now
            </button>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto">
            {activeTab === "feed" ? (
              <div className="space-y-6 print:space-y-4">
                {state.news.map((item, index) => (
                  <NewsCard key={item.id || index} news={item} index={index} />
                ))}
              </div>
            ) : (
              <MarketAnalysis news={state.news} />
            )}
          </div>
        )}
      </main>

      {isEmailModalOpen && (
        <EmailModal 
          isOpen={isEmailModalOpen} 
          onClose={() => setIsEmailModalOpen(false)} 
          news={state.news} 
        />
      )}
    </div>
  );
}

