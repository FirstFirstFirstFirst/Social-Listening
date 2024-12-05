"use client";
import React, { useState, useMemo } from "react";
import {
  Clock,
  Filter,
  Download,
  Twitter,
  Facebook,
  Instagram,
  Youtube,
  TrendingUp,
  ArrowUpDown,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
type WordDataItem = {
  word: string;
  count: number;
  trending: boolean;
  platforms: string[];
  sentiment: string;
  growth: number;
};

// Then, define valid sort keys
type SortKey = keyof Pick<WordDataItem, "word" | "count" | "growth">;
const WordFrequency = () => {
  const [sortConfig, setSortConfig] = useState<{
    key: SortKey;
    direction: "asc" | "desc";
  }>({ key: "count", direction: "desc" });
  // Extended mock data
  const wordData = [
    {
      word: "Computing",
      count: 245,
      trending: true,
      platforms: ["twitter", "facebook", "instagram"],
      sentiment: "positive",
      growth: 23,
    },
    {
      word: "AI",
      count: 188,
      trending: true,
      platforms: ["twitter", "youtube"],
      sentiment: "neutral",
      growth: 45,
    },
    {
      word: "Course",
      count: 156,
      trending: false,
      platforms: ["facebook", "instagram"],
      sentiment: "positive",
      growth: -5,
    },
    {
      word: "Programming",
      count: 134,
      trending: false,
      platforms: ["twitter", "youtube"],
      sentiment: "neutral",
      growth: 12,
    },
    {
      word: "Students",
      count: 122,
      trending: true,
      platforms: ["facebook", "instagram"],
      sentiment: "positive",
      growth: 18,
    },
    {
      word: "Technology",
      count: 98,
      trending: false,
      platforms: ["twitter", "youtube"],
      sentiment: "positive",
      growth: -2,
    },
    {
      word: "Learning",
      count: 87,
      trending: false,
      platforms: ["facebook", "instagram"],
      sentiment: "positive",
      growth: 8,
    },
    {
      word: "Projects",
      count: 76,
      trending: true,
      platforms: ["twitter", "youtube"],
      sentiment: "neutral",
      growth: 15,
    },
    {
      word: "Innovation",
      count: 165,
      trending: true,
      platforms: ["twitter", "facebook"],
      sentiment: "positive",
      growth: 28,
    },
    {
      word: "Research",
      count: 142,
      trending: false,
      platforms: ["twitter", "youtube", "facebook"],
      sentiment: "neutral",
      growth: 5,
    },
    {
      word: "Digital",
      count: 198,
      trending: true,
      platforms: ["instagram", "facebook"],
      sentiment: "positive",
      growth: 32,
    },
    {
      word: "Future",
      count: 167,
      trending: true,
      platforms: ["twitter", "youtube", "instagram"],
      sentiment: "positive",
      growth: 25,
    },
  ];

  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [showTrendingOnly, setShowTrendingOnly] = useState(false);

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "twitter":
        return <Twitter className="h-4 w-4 text-blue-400" />;
      case "facebook":
        return <Facebook className="h-4 w-4 text-blue-600" />;
      case "instagram":
        return <Instagram className="h-4 w-4 text-pink-500" />;
      case "youtube":
        return <Youtube className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getFontSize = (count: number) => {
    const baseSize = 14;
    const scale = count / 50;
    return Math.min(baseSize + scale * 8, 36);
  };

  const filteredAndSortedData = useMemo(() => {
    let filtered = [...wordData];

    // Platform filter
    if (selectedPlatform !== "all") {
      filtered = filtered.filter((item) =>
        item.platforms.includes(selectedPlatform)
      );
    }

    // Trending filter
    if (showTrendingOnly) {
      filtered = filtered.filter((item) => item.trending);
    }

    // Sort
    filtered.sort((a: WordDataItem, b: WordDataItem) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (sortConfig.direction === "asc") {
        return aValue > bValue ? 1 : -1;
      }
      return aValue < bValue ? 1 : -1;
    });

    return filtered;
  }, [wordData, selectedPlatform, sortConfig, showTrendingOnly]);

  const handleSort = (key: SortKey) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === "desc" ? "asc" : "desc",
    }));
  };

  const exportData = () => {
    const csvContent = [
      ["Word", "Count", "Trending", "Platforms", "Sentiment", "Growth"],
      ...filteredAndSortedData.map((item) => [
        item.word,
        item.count,
        item.trending ? "Yes" : "No",
        item.platforms.join(", "),
        item.sentiment,
        `${item.growth}%`,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "word_frequency_analysis.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Word Frequency Analysis</h2>
        <div className="flex space-x-4">
          <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              <SelectItem value="twitter">Twitter</SelectItem>
              <SelectItem value="facebook">Facebook</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="youtube">YouTube</SelectItem>
            </SelectContent>
          </Select>

          <button
            className={`flex items-center space-x-2 px-4 py-2 border rounded-lg ${
              showTrendingOnly
                ? "bg-blue-50 border-blue-200"
                : "hover:bg-gray-50"
            }`}
            onClick={() => setShowTrendingOnly(!showTrendingOnly)}
          >
            <Filter className="h-4 w-4" />
            <span>Trending Only</span>
          </button>

          <button
            onClick={exportData}
            className="flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-2 mb-6 text-sm text-gray-500">
        <Clock className="h-4 w-4" />
        <span>Last 5 days</span>
      </div>

      <div className="min-h-[400px] mb-8 p-8 bg-gray-50 rounded-lg">
        <div className="flex flex-wrap gap-4 justify-center items-center">
          {filteredAndSortedData.map((item) => (
            <div
              key={item.word}
              className="group relative cursor-pointer transition-all duration-200 hover:-translate-y-1"
              style={{
                fontSize: `${getFontSize(item.count)}px`,
              }}
            >
              <span className="font-semibold">
                {item.word}
                {item.trending && (
                  <TrendingUp className="inline-block h-4 w-4 ml-1 text-green-500" />
                )}
              </span>

              <div className="absolute hidden group-hover:block bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-3 bg-white rounded-lg shadow-lg w-48 z-10">
                <p className="font-semibold mb-2">{item.word}</p>
                <p className="text-sm text-gray-600 mb-2">
                  Mentioned {item.count} times
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  Growth:{" "}
                  <span
                    className={
                      item.growth >= 0 ? "text-green-500" : "text-red-500"
                    }
                  >
                    {item.growth}%
                  </span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {item.platforms.map((platform) => (
                    <div key={platform} className="flex items-center space-x-1">
                      {getPlatformIcon(platform)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th
                className="px-4 py-2 text-left cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort("word")}
              >
                <div className="flex items-center space-x-2">
                  <span>Word</span>
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </th>
              <th
                className="px-4 py-2 text-left cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort("count")}
              >
                <div className="flex items-center space-x-2">
                  <span>Count</span>
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </th>
              <th className="px-4 py-2 text-left">Trending</th>
              <th className="px-4 py-2 text-left">Platforms</th>
              <th
                className="px-4 py-2 text-left cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort("growth")}
              >
                <div className="flex items-center space-x-2">
                  <span>Growth</span>
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedData.map((item) => (
              <tr key={item.word} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">{item.word}</td>
                <td className="px-4 py-3">{item.count}</td>
                <td className="px-4 py-3">
                  {item.trending && (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex space-x-2">
                    {item.platforms.map((platform) => (
                      <div key={platform}>{getPlatformIcon(platform)}</div>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={
                      item.growth >= 0 ? "text-green-500" : "text-red-500"
                    }
                  >
                    {item.growth}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WordFrequency;
