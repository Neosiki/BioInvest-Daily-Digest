export interface NewsItem {
  id: string;
  category: "Clinical" | "FDA/EMA" | "M&A" | "Innovation" | "Other";
  weight: "High" | "Medium" | "Normal";
  titleKr: string;
  titleEn: string;
  summaryKr: string;
  summaryEn: string;
  investmentPointsKr: string[];
  investmentPointsEn: string[];
  sentimentScore: number; // 0 to 100
  url: string;
  date: string;
  expertQuote?: {
    quote: string;
    author: string;
    title: string;
  };
}

export interface DashboardState {
  news: NewsItem[];
  isLoading: boolean;
  isExporting?: boolean;
  lastUpdated: string | null;
}
