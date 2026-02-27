import { RefreshCw, Mail, Download, FileText, Copy, BarChart2, Newspaper } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SidebarProps {
  activeTab: "feed" | "analysis";
  setActiveTab: (tab: "feed" | "analysis") => void;
  onRefresh: () => void;
  onSendEmail: () => void;
  onDownloadPdf: () => void;
  onDownloadPpt: () => void;
  onCopyAll: () => void;
  isLoading: boolean;
  isExporting?: boolean;
}

export function Sidebar({
  activeTab,
  setActiveTab,
  onRefresh,
  onSendEmail,
  onDownloadPdf,
  onDownloadPpt,
  onCopyAll,
  isLoading,
  isExporting
}: SidebarProps) {
  return (
    <div className="w-64 h-screen bg-[var(--color-brand-black)] text-white fixed left-0 top-0 flex flex-col p-6">
      <div className="mb-12">
        <h1 className="text-2xl font-serif font-bold tracking-tight mb-1">
          BioInvest<span className="text-[var(--color-brand-green)]">.</span>
        </h1>
        <p className="text-xs font-mono text-gray-400 uppercase tracking-widest">Daily Digest</p>
      </div>

      <nav className="flex-1 space-y-2">
        <button
          onClick={() => setActiveTab("feed")}
          className={cn(
            "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-sm font-medium",
            activeTab === "feed" 
              ? "bg-white/10 text-white" 
              : "text-gray-400 hover:text-white hover:bg-white/5"
          )}
        >
          <Newspaper className="w-5 h-5" />
          News Feed
        </button>
        <button
          onClick={() => setActiveTab("analysis")}
          className={cn(
            "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-sm font-medium",
            activeTab === "analysis" 
              ? "bg-white/10 text-white" 
              : "text-gray-400 hover:text-white hover:bg-white/5"
          )}
        >
          <BarChart2 className="w-5 h-5" />
          Market Analysis
        </button>
      </nav>

      <div className="space-y-2 mt-auto">
        <div className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-4 px-2">Actions</div>
        
        <button
          onClick={onRefresh}
          disabled={isLoading || isExporting}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium bg-[var(--color-brand-green)] text-black hover:bg-emerald-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
          {isLoading ? "Curating..." : "Refresh News"}
        </button>

        <button
          onClick={onSendEmail}
          disabled={isLoading || isExporting}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Mail className="w-4 h-4" />
          Send Email
        </button>

        <button
          onClick={onDownloadPdf}
          disabled={isLoading || isExporting}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isExporting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
          {isExporting ? "Exporting..." : "Download PDF"}
        </button>

        <button
          onClick={onDownloadPpt}
          disabled={isLoading || isExporting}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-4 h-4" />
          Download PPT
        </button>

        <button
          onClick={onCopyAll}
          disabled={isLoading || isExporting}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Copy className="w-4 h-4" />
          Copy All (Notepad)
        </button>
      </div>
    </div>
  );
}
