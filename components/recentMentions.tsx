"use client";
import React, { useState, useMemo } from "react";
import {
  Twitter,
  Facebook,
  Instagram,
  Youtube,
  MessageCircle,
  ThumbsUp,
  Share2,
  MoreHorizontal,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Platform = "twitter" | "facebook" | "instagram" | "youtube";
type Sentiment = "positive" | "negative" | "neutral";
type SortOption = "recent" | "engagement" | "sentiment";

interface Engagement {
  replies: number;
  likes: number;
  shares: number;
}

interface Mention {
  id: number;
  platform: Platform;
  username: string;
  content: string;
  timestamp: string;
  sentiment: Sentiment;
  engagement: Engagement;
  createdAt: Date; // Added for proper date sorting
}

const mentions: Mention[] = [
  {
    id: 1,
    platform: "twitter",
    username: "@techstudent",
    content:
      "The new AI course at College of Computing is amazing! Learning so much about machine learning and neural networks. #education #AI",
    timestamp: "2 hours ago",
    sentiment: "positive",
    engagement: {
      replies: 12,
      likes: 48,
      shares: 8,
    },
    createdAt: new Date("2024-12-04T10:00:00"),
  },
  {
    id: 2,
    platform: "facebook",
    username: "Sarah Chen",
    content:
      "Just finished my final project at the College of Computing. The faculty support was incredible throughout the whole process! 🎓",
    timestamp: "4 hours ago",
    sentiment: "positive",
    engagement: {
      replies: 24,
      likes: 156,
      shares: 3,
    },
    createdAt: new Date("2024-12-04T08:00:00"),
  },
  {
    id: 3,
    platform: "instagram",
    username: "computinglife",
    content:
      "Great workshop on cybersecurity today at the College of Computing. Really eye-opening discussion about current threats and protection measures.",
    timestamp: "6 hours ago",
    sentiment: "neutral",
    engagement: {
      replies: 8,
      likes: 95,
      shares: 12,
    },
    createdAt: new Date("2024-12-04T06:00:00"),
  },
  {
    id: 4,
    platform: "youtube",
    username: "TechTalks",
    content:
      "The facilities at College of Computing could use some upgrades, especially the computer labs. Hope they consider updating the equipment soon.",
    timestamp: "8 hours ago",
    sentiment: "negative",
    engagement: {
      replies: 45,
      likes: 132,
      shares: 18,
    },
    createdAt: new Date("2024-12-04T04:00:00"),
  },
  {
    id: 5,
    platform: "twitter",
    username: "@codemaster",
    content:
      "Struggling with the advanced algorithms course. Anyone else finding the complexity analysis particularly challenging? #coding #help",
    timestamp: "12 hours ago",
    sentiment: "negative",
    engagement: {
      replies: 32,
      likes: 24,
      shares: 5,
    },
    createdAt: new Date("2024-12-04T00:00:00"),
  },
  {
    id: 6,
    platform: "instagram",
    username: "campuslife",
    content:
      "Study group forming at the College of Computing library. Join us for the databases final prep! #studying #collegelife",
    timestamp: "1 day ago",
    sentiment: "neutral",
    engagement: {
      replies: 15,
      likes: 88,
      shares: 7,
    },
    createdAt: new Date("2024-12-03T12:00:00"),
  },
];

const RecentMentions = () => {
  const [selectedPlatform, setSelectedPlatform] = useState<"all" | Platform>(
    "all"
  );
  const [sortBy, setSortBy] = useState<SortOption>("recent");

  const getPlatformIcon = (platform: Platform) => {
    switch (platform) {
      case "twitter":
        return <Twitter className="h-5 w-5 text-blue-400" />;
      case "facebook":
        return <Facebook className="h-5 w-5 text-blue-600" />;
      case "instagram":
        return <Instagram className="h-5 w-5 text-pink-500" />;
      case "youtube":
        return <Youtube className="h-5 w-5 text-red-500" />;
    }
  };

  const getSentimentColor = (sentiment: Sentiment) => {
    switch (sentiment) {
      case "positive":
        return "bg-green-100 text-green-700";
      case "negative":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getEngagementScore = (engagement: Engagement): number => {
    return engagement.replies * 2 + engagement.likes + engagement.shares * 3;
  };

  const getSentimentScore = (sentiment: Sentiment): number => {
    switch (sentiment) {
      case "positive":
        return 3;
      case "neutral":
        return 2;
      case "negative":
        return 1;
    }
  };

  const filteredAndSortedMentions = useMemo(() => {
    let filtered = [...mentions];

    // Apply platform filter
    if (selectedPlatform !== "all") {
      filtered = filtered.filter(
        (mention) => mention.platform === selectedPlatform
      );
    }

    // Apply sorting
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return b.createdAt.getTime() - a.createdAt.getTime();
        case "engagement":
          return (
            getEngagementScore(b.engagement) - getEngagementScore(a.engagement)
          );
        case "sentiment":
          return (
            getSentimentScore(b.sentiment) - getSentimentScore(a.sentiment)
          );
        default:
          return 0;
      }
    });
  }, [selectedPlatform, sortBy]);

  return (
    <div className="bg-white rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Recent Mentions</h2>
        <div className="flex space-x-4">
          <Select
            defaultValue="all"
            onValueChange={(value: "all" | Platform) =>
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
            </SelectContent>
          </Select>
          <Select
            defaultValue="recent"
            onValueChange={(value: SortOption) => setSortBy(value)}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="engagement">Most Engaged</SelectItem>
              <SelectItem value="sentiment">Sentiment</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredAndSortedMentions.map((mention) => (
          <div
            key={mention.id}
            className="p-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                {getPlatformIcon(mention.platform)}
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold">{mention.username}</span>
                    <span className="text-sm text-gray-500">
                      {mention.timestamp}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${getSentimentColor(
                        mention.sentiment
                      )}`}
                    >
                      {mention.sentiment}
                    </span>
                  </div>
                  <p className="mt-1 text-gray-700">{mention.content}</p>
                  <div className="flex items-center space-x-6 mt-3">
                    <div className="flex items-center space-x-1 text-gray-500">
                      <MessageCircle className="h-4 w-4" />
                      <span className="text-sm">
                        {mention.engagement.replies}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-500">
                      <ThumbsUp className="h-4 w-4" />
                      <span className="text-sm">
                        {mention.engagement.likes}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-500">
                      <Share2 className="h-4 w-4" />
                      <span className="text-sm">
                        {mention.engagement.shares}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentMentions;
