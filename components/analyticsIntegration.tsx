"use client";
import React, { useState, useRef, useEffect } from "react";
import { createChart, ColorType, IChartApi } from "lightweight-charts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Settings, Download } from "lucide-react";

const AnalyticsIntegration = () => {
  const [timeRange, setTimeRange] = useState("7d");
  const [activeTab, setActiveTab] = useState("overview");
  const engagementChartRef = useRef<HTMLDivElement>(null);
  const demographicsChartRef = useRef<HTMLDivElement>(null);
  const [engagementChart, setEngagementChart] = useState<IChartApi | null>(
    null
  );
  const [demographicsChart, setDemographicsChart] = useState<IChartApi | null>(
    null
  );

  const engagementData = [
    {
      time: "2024-01-01",
      facebook: 150,
      twitter: 280,
      instagram: 190,
      linkedin: 120,
    },
    {
      time: "2024-01-02",
      facebook: 220,
      twitter: 250,
      instagram: 210,
      linkedin: 140,
    },
    {
      time: "2024-01-03",
      facebook: 180,
      twitter: 290,
      instagram: 230,
      linkedin: 160,
    },
    {
      time: "2024-01-04",
      facebook: 240,
      twitter: 300,
      instagram: 250,
      linkedin: 180,
    },
    {
      time: "2024-01-05",
      facebook: 260,
      twitter: 320,
      instagram: 270,
      linkedin: 200,
    },
  ];

  const demographicsData = [
    { age: "18-24", male: 30, female: 35, other: 5 },
    { age: "25-34", male: 45, female: 48, other: 7 },
    { age: "35-44", male: 35, female: 38, other: 4 },
    { age: "45-54", male: 25, female: 28, other: 3 },
    { age: "55+", male: 15, female: 18, other: 2 },
  ];

  useEffect(() => {
    const handleResize = () => {
      if (engagementChart) {
        engagementChart.applyOptions({
          width: engagementChartRef.current?.clientWidth,
        });
      }
      if (demographicsChart) {
        demographicsChart.applyOptions({
          width: demographicsChartRef.current?.clientWidth,
        });
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [engagementChart, demographicsChart]);

  useEffect(() => {
    if (!engagementChartRef.current || activeTab !== "engagement") return;

    const chart = createChart(engagementChartRef.current, {
      layout: {
        background: { color: "#ffffff" },
        textColor: "#333",
      },
      width: engagementChartRef.current.clientWidth,
      height: 320,
      rightPriceScale: { visible: true },
      grid: {
        vertLines: { color: "#f0f0f0" },
        horzLines: { color: "#f0f0f0" },
      },
    });

    setEngagementChart(chart);

    const facebookSeries = chart.addLineSeries({
      color: "#4267B2",
      title: "Facebook",
    });
    const twitterSeries = chart.addLineSeries({
      color: "#1DA1F2",
      title: "Twitter",
    });
    const instagramSeries = chart.addLineSeries({
      color: "#E1306C",
      title: "Instagram",
    });
    const linkedinSeries = chart.addLineSeries({
      color: "#0077B5",
      title: "LinkedIn",
    });

    facebookSeries.setData(
      engagementData.map((item) => ({
        time: item.time,
        value: item.facebook,
      }))
    );

    twitterSeries.setData(
      engagementData.map((item) => ({
        time: item.time,
        value: item.twitter,
      }))
    );

    instagramSeries.setData(
      engagementData.map((item) => ({
        time: item.time,
        value: item.instagram,
      }))
    );

    linkedinSeries.setData(
      engagementData.map((item) => ({
        time: item.time,
        value: item.linkedin,
      }))
    );

    chart.timeScale().fitContent();

    return () => {
      chart.remove();
      setEngagementChart(null);
    };
  }, [activeTab]);

  useEffect(() => {
    if (!demographicsChartRef.current || activeTab !== "demographics") return;

    const chart = createChart(demographicsChartRef.current, {
      layout: {
        background: { color: "#ffffff" },
        textColor: "#333",
      },
      width: demographicsChartRef.current.clientWidth,
      height: 320,
      rightPriceScale: { visible: true },
      grid: {
        vertLines: { color: "#f0f0f0" },
        horzLines: { color: "#f0f0f0" },
      },
      timeScale: {
        timeVisible: false,
        borderColor: "#D1D5DB",
        fixLeftEdge: true,
        fixRightEdge: true,
      },
    });

    setDemographicsChart(chart);

    const maleSeries = chart.addLineSeries({
      color: "#2563eb",
      title: "Male",
      lineWidth: 3,
      lastValueVisible: true,
    });
    const femaleSeries = chart.addLineSeries({
      color: "#db2777",
      title: "Female",
      lineWidth: 3,
      lastValueVisible: true,
    });
    const otherSeries = chart.addLineSeries({
      color: "#8b5cf6",
      title: "Other",
      lineWidth: 3,
      lastValueVisible: true,
    });

    // Add custom axis labels
    const labels = demographicsData.map((item, index) => ({
      time: `2024-01-0${index + 1}`,
      position: "bottom",
      text: item.age,
    }));

    maleSeries.setData(
      demographicsData.map((item, index) => ({
        time: `2024-01-0${index + 1}`,
        value: item.male,
      }))
    );

    femaleSeries.setData(
      demographicsData.map((item, index) => ({
        time: `2024-01-0${index + 1}`,
        value: item.female,
      }))
    );

    otherSeries.setData(
      demographicsData.map((item, index) => ({
        time: `2024-01-0${index + 1}`,
        value: item.other,
      }))
    );

    chart.timeScale().fitContent();

    return () => {
      chart.remove();
      setDemographicsChart(null);
    };
  }, [activeTab]);

  return (
    <div className="bg-white rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Analytics Integration</h2>
          <p className="text-sm text-gray-500">
            Connected to Google Analytics & Power BI
          </p>
        </div>
      </div>

      <Tabs
        defaultValue="overview"
        className="space-y-4"
        onValueChange={setActiveTab}
      >
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">Total Reach</h3>
              <p className="text-2xl font-bold mt-1">2.4M</p>
              <span className="text-sm text-green-500">
                ↑ 12% vs last period
              </span>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">
                Engagement Rate
              </h3>
              <p className="text-2xl font-bold mt-1">4.8%</p>
              <span className="text-sm text-red-500">↓ 2% vs last period</span>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">
                Conversion Rate
              </h3>
              <p className="text-2xl font-bold mt-1">2.1%</p>
              <span className="text-sm text-green-500">
                ↑ 5% vs last period
              </span>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="engagement">
          <div ref={engagementChartRef} className="w-full" />
        </TabsContent>

        <TabsContent value="demographics">
          <div ref={demographicsChartRef} className="w-full" />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsIntegration;
