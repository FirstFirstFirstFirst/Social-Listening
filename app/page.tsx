"use client";
import DashboardLayout from "@/components/dashboardLayout";
import TrendChart from "@/components/trendChart";
import RecentMentions from "@/components/recentMentions";
import WordFrequency from "@/components/wordFrequency";
import AlertSystem from "@/components/alertSystem";
import ReportGenerator from "@/components/reportGenerator";
import AnalyticsIntegration from "@/components/analyticsIntegration";

export default function Home() {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <TrendChart />
        </div>
        <div className="mb-8">
          <WordFrequency />
        </div>
        <div className="mb-8">
          <RecentMentions />
        </div>
        <div className="mb-8">
          <AlertSystem />
        </div>
        <div className="mb-8">
          <ReportGenerator />
        </div>
        <div className="mb-8">
          <AnalyticsIntegration />
        </div>
      </div>
    </DashboardLayout>
  );
}
