"use client";
import React, { useState, useMemo, PropsWithChildren } from "react";
import { Bell, Menu, Search, Settings, User } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TrendChart from "@/components/trendChart";
import RecentMentions from "@/components/recentMentions";

type TimePeriod = "24h" | "7d" | "30d";
type PlatformFilter =
  | "all"
  | "twitter"
  | "facebook"
  | "instagram"
  | "youtube"
  | "tiktok";

interface PlatformStat {
  platform: string;
  mentions: number;
  sentiment: number;
  trend: string;
}

interface TimePeriodsData {
  "24h": PlatformStat[];
  "7d": PlatformStat[];
  "30d": PlatformStat[];
}

const DashboardLayout: React.FC<PropsWithChildren> = ({ children }) => {
  const [selectedPlatform, setSelectedPlatform] =
    useState<PlatformFilter>("all");
  const [selectedTimePeriod, setSelectedTimePeriod] =
    useState<TimePeriod>("7d");
  // Extended mock data with historical data for different time periods
  const mockData: TimePeriodsData = {
    "24h": [
      { platform: "Twitter", mentions: 234, sentiment: 82, trend: "+5%" },
      { platform: "Facebook", mentions: 156, sentiment: 68, trend: "-2%" },
      { platform: "Instagram", mentions: 143, sentiment: 85, trend: "+3%" },
      { platform: "YouTube", mentions: 92, sentiment: 75, trend: "+1%" },
      { platform: "TikTok", mentions: 287, sentiment: 72, trend: "+8%" },
    ],
    "7d": [
      { platform: "Twitter", mentions: 1234, sentiment: 78, trend: "+12%" },
      { platform: "Facebook", mentions: 856, sentiment: 65, trend: "-5%" },
      { platform: "Instagram", mentions: 643, sentiment: 82, trend: "+7%" },
      { platform: "YouTube", mentions: 432, sentiment: 71, trend: "+4%" },
      { platform: "TikTok", mentions: 987, sentiment: 69, trend: "+15%" },
    ],
    "30d": [
      { platform: "Twitter", mentions: 5234, sentiment: 75, trend: "+25%" },
      { platform: "Facebook", mentions: 3856, sentiment: 70, trend: "+8%" },
      { platform: "Instagram", mentions: 2643, sentiment: 79, trend: "+18%" },
      { platform: "YouTube", mentions: 1432, sentiment: 73, trend: "+11%" },
      { platform: "TikTok", mentions: 4987, sentiment: 71, trend: "+30%" },
    ],
  };

  // Filter and sort data based on user selection
  const filteredStats = useMemo(() => {
    // Now TypeScript knows this is PlatformStat[]
    let stats = mockData[selectedTimePeriod];

    if (selectedPlatform !== "all") {
      stats = stats.filter(
        (stat) => stat.platform.toLowerCase() === selectedPlatform
      );
    }

    return [...stats].sort((a, b) => b.mentions - a.mentions);
  }, [selectedPlatform, selectedTimePeriod]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Filters */}
        <div className="mb-8 flex space-x-4">
          <Select
            defaultValue="7d"
            onValueChange={(value: TimePeriod) => setSelectedTimePeriod(value)}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Time Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 hours</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
            </SelectContent>
          </Select>

          <Select
            defaultValue="all"
            onValueChange={(value: PlatformFilter) =>
              setSelectedPlatform(value)
            }
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              <SelectItem value="twitter">Twitter</SelectItem>
              <SelectItem value="facebook">Facebook</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="youtube">YouTube</SelectItem>
              <SelectItem value="tiktok">TikTok</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {filteredStats.map((stat) => (
            <div
              key={stat.platform}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-semibold mb-2">{stat.platform}</h3>
              <div className="flex flex-col space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">Mentions</p>
                    <p className="text-2xl font-bold">{stat.mentions}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Sentiment</p>
                    <p className="text-2xl font-bold text-green-500">
                      {stat.sentiment}%
                    </p>
                  </div>
                </div>
                <div className="text-sm">
                  <span className="text-gray-500">Trend: </span>
                  <span
                    className={
                      stat.trend.startsWith("+")
                        ? "text-green-500"
                        : "text-red-500"
                    }
                  >
                    {stat.trend}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
