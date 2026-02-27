import { useState } from "react";
import { motion } from "motion/react";
import { ChevronDown, ChevronUp, ExternalLink, Copy, Check } from "lucide-react";
import { NewsItem } from "../types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface NewsCardProps {
  news: NewsItem;
  index: number;
}

export function NewsCard({ news, index }: NewsCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const getWeightColor = (weight: string) => {
    switch (weight) {
      case "High": return "bg-red-100 text-red-800 border-red-200";
      case "Medium": return "bg-orange-100 text-orange-800 border-orange-200";
      default: return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    let text = `[${news.category}] ${news.titleKr}\n`;
    text += `${news.titleEn}\n\n`;
    text += `요약: ${news.summaryKr}\n`;
    text += `Summary: ${news.summaryEn}\n\n`;
    text += `투자 포인트:\n`;
    news.investmentPointsKr.forEach(p => text += `- ${p}\n`);
    if (news.expertQuote) {
      text += `\n[전문가 코멘트]\n"${news.expertQuote.quote}"\n- ${news.expertQuote.author} (${news.expertQuote.title})\n`;
    }
    text += `\n출처: ${news.url}`;

    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group relative bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 pdf-export-target"
    >
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--color-brand-green)] opacity-0 group-hover:opacity-100 transition-opacity rounded-l-2xl" />
      
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-2 items-center">
          <span className="px-3 py-1 text-xs font-mono font-medium bg-gray-100 text-gray-600 rounded-full">
            {news.category}
          </span>
          <span className={cn("px-3 py-1 text-xs font-mono font-medium rounded-full border", getWeightColor(news.weight))}>
            {news.weight} Impact
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleCopy}
            className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors bg-gray-50 hover:bg-gray-100 rounded-md mr-2"
            title="Copy this news item"
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
            {isCopied ? "Copied" : "Copy"}
          </button>
          <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full">
            <span className="text-xs font-mono text-gray-500">Sentiment</span>
            <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[var(--color-brand-green)]" 
                style={{ width: `${news.sentimentScore}%` }}
              />
            </div>
            <span className="text-xs font-mono font-bold">{news.sentimentScore}</span>
          </div>
        </div>
      </div>

      <div className="cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <h2 className="text-xl font-serif font-bold text-[var(--color-brand-black)] mb-2 leading-tight">
          {news.titleKr}
        </h2>
        <h3 className="text-sm font-sans text-gray-500 mb-4 leading-snug">
          {news.titleEn}
        </h3>
        
        <p className="text-sm text-gray-700 mb-2 line-clamp-2">
          {news.summaryKr}
        </p>
      </div>

      {isExpanded && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-4 pt-4 border-t border-gray-100"
        >
          <div className="mb-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">English Summary</h4>
            <p className="text-sm text-gray-600 italic">{news.summaryEn}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Investment Points (KR)</h4>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                {news.investmentPointsKr.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Investment Points (EN)</h4>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                {news.investmentPointsEn.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </div>
          </div>

          {news.expertQuote && (
            <div className="mb-4 bg-gray-50 border-l-4 border-[var(--color-brand-green)] p-4 rounded-r-lg">
              <p className="text-sm italic text-gray-700 mb-2">"{news.expertQuote.quote}"</p>
              <p className="text-xs font-bold text-gray-900">— {news.expertQuote.author}, <span className="font-normal text-gray-500">{news.expertQuote.title}</span></p>
            </div>
          )}

          <div className="flex justify-between items-center mt-6">
            <span className="text-xs font-mono text-gray-400">{news.date}</span>
            <a 
              href={news.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm font-medium text-[var(--color-brand-black)] hover:text-[var(--color-brand-green)] transition-colors"
            >
              Read Source <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </motion.div>
      )}

      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute bottom-4 right-6 text-gray-400 hover:text-gray-600"
      >
        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>
    </motion.div>
  );
}
