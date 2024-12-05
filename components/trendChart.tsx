import React, { useEffect, useRef, useState } from "react";
import {
  createChart,
  IChartApi,
  ISeriesApi,
  LineData,
  HistogramData,
} from "lightweight-charts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DataPoint {
  date: string;
  Twitter: number;
  Facebook: number;
  Instagram: number;
  YouTube: number;
  TikTok: number;
  sentiment: number;
}

type MetricType =
  | "Twitter"
  | "Facebook"
  | "Instagram"
  | "YouTube"
  | "TikTok"
  | "sentiment";
type ChartType = "area" | "histogram";

const TrendChart: React.FC = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Area" | "Histogram"> | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<MetricType>("Twitter");
  const [chartType, setChartType] = useState<ChartType>("area");

  const mockData = [
    {
      date: "2024-11-28",
      Twitter: 245,
      Facebook: 184,
      Instagram: 142,
      YouTube: 98,
      TikTok: 156,
      sentiment: 75,
    },
    {
      date: "2024-11-29",
      Twitter: 288,
      Facebook: 205,
      Instagram: 165,
      YouTube: 112,
      TikTok: 178,
      sentiment: 72,
    },
    {
      date: "2024-11-30",
      Twitter: 256,
      Facebook: 236,
      Instagram: 198,
      YouTube: 134,
      TikTok: 201,
      sentiment: 68,
    },
    {
      date: "2024-12-01",
      Twitter: 334,
      Facebook: 278,
      Instagram: 167,
      YouTube: 156,
      TikTok: 245,
      sentiment: 81,
    },
    {
      date: "2024-12-02",
      Twitter: 289,
      Facebook: 245,
      Instagram: 189,
      YouTube: 143,
      TikTok: 232,
      sentiment: 77,
    },
    {
      date: "2024-12-03",
      Twitter: 376,
      Facebook: 289,
      Instagram: 234,
      YouTube: 165,
      TikTok: 267,
      sentiment: 73,
    },
    {
      date: "2024-12-04",
      Twitter: 412,
      Facebook: 312,
      Instagram: 256,
      YouTube: 187,
      TikTok: 289,
      sentiment: 79,
    },
  ];

  const formatChartData = (
    data: DataPoint[],
    metric: MetricType,
    type: ChartType
  ): (LineData | HistogramData)[] => {
    return data.map((item) => ({
      time: item.date,
      value: item[metric],
      ...(type === "histogram" && { color: getMetricColor(metric).line }),
    }));
  };

  const getMetricColor = (
    metric: MetricType
  ): { line: string; area: string } => {
    const colors = {
      Twitter: { line: "#1DA1F2", area: "rgba(29, 161, 242, 0.2)" },
      Facebook: { line: "#4267B2", area: "rgba(66, 103, 178, 0.2)" },
      Instagram: { line: "#E1306C", area: "rgba(225, 48, 108, 0.2)" },
      YouTube: { line: "#FF0000", area: "rgba(255, 0, 0, 0.2)" },
      TikTok: { line: "#000000", area: "rgba(0, 0, 0, 0.2)" },
      sentiment: { line: "#4CAF50", area: "rgba(76, 175, 80, 0.2)" },
    };
    return colors[metric];
  };

  useEffect(() => {
    let chart: IChartApi | null = null;

    if (chartContainerRef.current) {
      chart = createChart(chartContainerRef.current, {
        height: 500,
        layout: {
          background: { color: "#ffffff" },
          textColor: "#333",
        },
        grid: {
          vertLines: { color: "#f0f0f0" },
          horzLines: { color: "#f0f0f0" },
        },
        rightPriceScale: {
          borderVisible: false,
        },
        timeScale: {
          borderVisible: false,
          timeVisible: true,
        },
        crosshair: {
          horzLine: {
            visible: true,
            labelVisible: true,
          },
          vertLine: {
            visible: true,
            labelVisible: true,
          },
        },
      });

      chartRef.current = chart;
      const colors = getMetricColor(selectedMetric);

      const newSeries =
        chartType === "area"
          ? chart.addAreaSeries({
              lineColor: colors.line,
              topColor: colors.area,
              bottomColor: "rgba(255, 255, 255, 0)",
              lineWidth: 2,
            })
          : chart.addHistogramSeries({
              color: colors.line,
              priceFormat: {
                type: "price",
              },
            });

      seriesRef.current = newSeries;
      newSeries.setData(formatChartData(mockData, selectedMetric, chartType));
      chart.timeScale().fitContent();

      const handleResize = () => {
        if (chartContainerRef.current && chart) {
          chart.applyOptions({
            width: chartContainerRef.current.clientWidth,
          });
        }
      };

      window.addEventListener("resize", handleResize);
      handleResize();

      return () => {
        window.removeEventListener("resize", handleResize);
        if (chart) {
          chart.remove();
        }
      };
    }
  }, [selectedMetric, chartType]);

  return (
    <div className="w-full h-full p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Social Media Trends</h2>
        <div className="flex gap-4">
          <Select
            defaultValue={chartType}
            onValueChange={(value) => setChartType(value as ChartType)}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select chart type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="area">Area Chart</SelectItem>
              <SelectItem value="histogram">Histogram</SelectItem>
            </SelectContent>
          </Select>
          <Select
            defaultValue={selectedMetric}
            onValueChange={(value) => setSelectedMetric(value as MetricType)}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select metric" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Twitter">Twitter</SelectItem>
              <SelectItem value="Facebook">Facebook</SelectItem>
              <SelectItem value="Instagram">Instagram</SelectItem>
              <SelectItem value="YouTube">YouTube</SelectItem>
              <SelectItem value="TikTok">TikTok</SelectItem>
              <SelectItem value="sentiment">Sentiment</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div ref={chartContainerRef} className="w-full" />
    </div>
  );
};

export default TrendChart;
