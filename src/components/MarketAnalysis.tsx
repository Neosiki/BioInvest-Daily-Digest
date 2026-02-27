import { NewsItem } from "../types";
import { 
  PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis 
} from "recharts";

interface MarketAnalysisProps {
  news: NewsItem[];
}

export function MarketAnalysis({ news }: MarketAnalysisProps) {
  // Category Distribution
  const categoryCount = news.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categoryData = Object.entries(categoryCount).map(([name, value]) => ({ name, value }));
  const COLORS = ['#00FF85', '#111111', '#888888', '#E5E7EB', '#3B82F6'];

  // Sentiment Scores
  const sentimentData = news.map(item => ({
    name: item.titleKr.substring(0, 15) + "...",
    score: item.sentimentScore
  }));

  // Sector Radar (Average Sentiment per Category)
  const sectorSentiment = news.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = { total: 0, count: 0 };
    }
    acc[item.category].total += item.sentimentScore;
    acc[item.category].count += 1;
    return acc;
  }, {} as Record<string, { total: number, count: number }>);

  const radarData = Object.entries(sectorSentiment).map(([subject, data]) => ({
    subject,
    A: Math.round(data.total / data.count),
    fullMark: 100,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Category Distribution */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 pdf-export-target">
        <h3 className="text-lg font-serif font-bold mb-6">Category Distribution</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <RechartsTooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sector Radar */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 pdf-export-target">
        <h3 className="text-lg font-serif font-bold mb-6">Sector Sentiment Radar</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#888888', fontSize: 12 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              <Radar name="Sentiment" dataKey="A" stroke="#00FF85" fill="#00FF85" fillOpacity={0.6} />
              <RechartsTooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sentiment Bar Chart */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2 pdf-export-target">
        <h3 className="text-lg font-serif font-bold mb-6">Top 10 News Sentiment</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sentimentData} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis 
                dataKey="name" 
                angle={-45} 
                textAnchor="end" 
                height={80} 
                tick={{ fill: '#888888', fontSize: 11 }} 
              />
              <YAxis domain={[0, 100]} tick={{ fill: '#888888', fontSize: 12 }} />
              <RechartsTooltip 
                cursor={{ fill: '#F3F4F6' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="score" fill="#111111" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
