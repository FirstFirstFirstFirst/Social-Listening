"use client";
import React, { useState, useCallback, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Clock, Plus, Share2, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@radix-ui/react-toast";
import { Alert, AlertDescription } from "./ui/alert";

interface Template {
  id: TemplateId;
  name: string;
  description: string;
  sections: Section[];
  defaultTimeRange?: TimeRange;
  defaultFormat?: ExportFormat;
}

interface Section {
  id: string;
  name: string;
  type: "chart" | "table" | "metrics" | "text";
  required?: boolean;
}

interface Report {
  id: number;
  name: string;
  type: string;
  date: string;
  status: ReportStatus;
  format: ExportFormat;
  timeRange: TimeRange;
  templateId: TemplateId;
  sections: Section[];
  createdBy?: string;
  lastModified?: string;
  scheduledFrequency?: ScheduleFrequency;
  nextScheduledRun?: string;
}

type TemplateId = "daily" | "weekly" | "monthly" | "custom";
type ReportStatus = "completed" | "scheduled" | "processing" | "failed";
type ExportFormat = "pdf" | "excel" | "csv" | "powerpoint";
type TimeRange = "last24h" | "last7days" | "last30days" | "custom";
type ScheduleFrequency = "daily" | "weekly" | "monthly" | "quarterly" | "none";

interface ScheduleSettings {
  frequency: ScheduleFrequency;
  startDate: string;
  recipients: string[];
}

interface DateRange {
  startDate: string;
  endDate: string;
}

const ReportGenerator = () => {
  const { toast } = useToast();
  const templates: Template[] = [
    {
      id: "daily",
      name: "Daily Overview",
      description: "Daily summary of key metrics and activities",
      sections: [
        { id: "metrics", name: "Key Metrics", type: "metrics", required: true },
        {
          id: "activity",
          name: "Activity Feed",
          type: "table",
          required: true,
        },
        { id: "trends", name: "Trend Analysis", type: "chart" },
        { id: "alerts", name: "Daily Alerts", type: "text" },
      ],
      defaultTimeRange: "last24h",
      defaultFormat: "pdf",
    },
    {
      id: "weekly",
      name: "Weekly Analysis",
      description: "Comprehensive weekly performance report",
      sections: [
        {
          id: "summary",
          name: "Executive Summary",
          type: "text",
          required: true,
        },
        {
          id: "performance",
          name: "Performance Metrics",
          type: "metrics",
          required: true,
        },
        { id: "comparison", name: "Week-over-Week", type: "chart" },
        { id: "insights", name: "Weekly Insights", type: "text" },
      ],
      defaultTimeRange: "last7days",
      defaultFormat: "powerpoint",
    },
    {
      id: "monthly",
      name: "Monthly Report",
      description: "In-depth monthly analysis and insights",
      sections: [
        {
          id: "overview",
          name: "Monthly Overview",
          type: "text",
          required: true,
        },
        { id: "kpis", name: "KPI Dashboard", type: "metrics", required: true },
        { id: "trendline", name: "Monthly Trends", type: "chart" },
        { id: "recommendations", name: "Action Items", type: "text" },
      ],
      defaultTimeRange: "last30days",
      defaultFormat: "pdf",
    },
  ];
  const [recentReports, setRecentReports] = useState<Report[]>([
    {
      id: 1,
      name: "November Performance Review",
      type: "Monthly Report",
      date: "2024-11-30",
      status: "completed",
      format: "pdf",
      timeRange: "last30days",
      templateId: "monthly",
      sections: templates.find((t) => t.id === "monthly")?.sections || [],
      createdBy: "John Smith",
      lastModified: "2024-11-30T15:30:00Z",
    },
    {
      id: 2,
      name: "Weekly Operations Summary",
      type: "Weekly Report",
      date: "2024-12-01",
      status: "scheduled",
      format: "powerpoint",
      timeRange: "last7days",
      templateId: "weekly",
      sections: templates.find((t) => t.id === "weekly")?.sections || [],
      createdBy: "Sarah Johnson",
      scheduledFrequency: "weekly",
      nextScheduledRun: "2024-12-08T00:00:00Z",
    },
    {
      id: 3,
      name: "Daily Metrics Report",
      type: "Daily Report",
      date: "2024-12-04", // Yesterday
      status: "completed",
      format: "pdf",
      timeRange: "last24h",
      templateId: "daily",
      sections: templates.find((t) => t.id === "daily")?.sections || [],
      createdBy: "Mike Wilson",
    },
    {
      id: 4,
      name: "Today's Performance",
      type: "Daily Report",
      date: "2024-12-05", // Today
      status: "processing",
      format: "pdf",
      timeRange: "last24h",
      templateId: "daily",
      sections: templates.find((t) => t.id === "daily")?.sections || [],
      createdBy: "Mike Wilson",
    },
    // Add more historical data
    {
      id: 5,
      name: "October Performance Review",
      type: "Monthly Report",
      date: "2024-10-31",
      status: "completed",
      format: "pdf",
      timeRange: "last30days",
      templateId: "monthly",
      sections: templates.find((t) => t.id === "monthly")?.sections || [],
      createdBy: "Emma Davis",
    },
  ]);

  // State management
  const [loadingReports, setLoadingReports] = useState<Record<number, boolean>>(
    {}
  );
  const [selectedTemplate, setSelectedTemplate] =
    useState<TemplateId>("custom");
  const [selectedTimeRange, setSelectedTimeRange] =
    useState<TimeRange>("last7days");
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>("pdf");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });

  // New state for scheduling
  const [scheduleSettings, setScheduleSettings] = useState<ScheduleSettings>({
    frequency: "none",
    startDate: new Date().toISOString().split("T")[0],
    recipients: [],
  });

  const [showScheduleDialog, setShowScheduleDialog] = useState(false);

  const handleScheduleReport = useCallback(
    (settings: ScheduleSettings) => {
      setScheduleSettings(settings);
      setShowScheduleDialog(false);

      toast({
        title: "Report Scheduled",
        description: `Report will run ${settings.frequency} starting ${new Date(
          settings.startDate
        ).toLocaleDateString()}`,
        duration: 5000,
      });
    },
    [toast]
  );

  const ScheduleDialog = () => (
    <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Schedule Report</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Frequency</label>
            <Select
              value={scheduleSettings.frequency}
              onValueChange={(value: ScheduleFrequency) =>
                setScheduleSettings((prev) => ({
                  ...prev,
                  frequency: value,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Start Date</label>
            <input
              type="date"
              value={scheduleSettings.startDate}
              onChange={(e) =>
                setScheduleSettings((prev) => ({
                  ...prev,
                  startDate: e.target.value,
                }))
              }
              className="w-full p-2 rounded-md border"
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          <Button
            type="button"
            onClick={() => handleScheduleReport(scheduleSettings)}
            className="w-full"
          >
            Schedule Report
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
  const getFilteredReports = useCallback(() => {
    const today = new Date();

    if (
      selectedTimeRange === "custom" &&
      dateRange.startDate &&
      dateRange.endDate
    ) {
      const start = new Date(dateRange.startDate);
      const end = new Date(dateRange.endDate);
      return recentReports.filter((report) => {
        const reportDate = new Date(report.date);
        return reportDate >= start && reportDate <= end;
      });
    }

    switch (selectedTimeRange) {
      case "last24h":
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        return recentReports.filter((report) => {
          const reportDate = new Date(report.date);
          return reportDate >= yesterday;
        });

      case "last7days":
        const lastWeek = new Date(today);
        lastWeek.setDate(lastWeek.getDate() - 7);
        return recentReports.filter((report) => {
          const reportDate = new Date(report.date);
          return reportDate >= lastWeek;
        });

      case "last30days":
        const lastMonth = new Date(today);
        lastMonth.setDate(lastMonth.getDate() - 30);
        return recentReports.filter((report) => {
          const reportDate = new Date(report.date);
          return reportDate >= lastMonth;
        });

      default:
        return recentReports;
    }
  }, [selectedTimeRange, dateRange, recentReports]);

  const handleDownloadReport = useCallback(
    async (reportId: number) => {
      const report = recentReports.find((r) => r.id === reportId);

      if (!report) {
        toast({
          variant: "destructive",
          title: "Download Failed",
          description: "Report not found.",
          duration: 3000,
        });
        return;
      }

      if (report.status !== "completed") {
        toast({
          variant: "destructive",
          title: "Download Failed",
          description: "This report is not ready for download yet.",
          duration: 3000,
        });
        return;
      }

      try {
        setLoadingReports((prev) => ({ ...prev, [reportId]: true }));

        await new Promise((resolve) => setTimeout(resolve, 1500));

        let content = "Report content";
        let mimeType;
        let fileExtension;

        console.log("Current report format:", selectedFormat);

        switch (selectedFormat) {
          case "excel":
            content = "Excel content";
            mimeType = "application/vnd.ms-excel";
            fileExtension = "xlsx";
            break;
          case "csv":
            content = "data,more data,even more data";
            mimeType = "text/csv";
            fileExtension = "csv";
            break;
          case "powerpoint":
            content = "PowerPoint content";
            mimeType = "application/vnd.ms-powerpoint";
            fileExtension = "pptx";
            break;
          case "pdf":
          default:
            content = "PDF content";
            mimeType = "application/pdf";
            fileExtension = "pdf";
            break;
        }

        // Create and trigger download
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = `${report.name}.${fileExtension}`;

        // Add to document, trigger download, and cleanup
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
        document.body.removeChild(a);

        toast({
          title: "Download Complete",
          description: `${report.name}.${fileExtension} has been downloaded successfully.`,
          duration: 3000,
        });
      } catch (error) {
        console.error("Download error:", error);
        toast({
          variant: "destructive",
          title: "Download Failed",
          description: "Failed to download report. Please try again.",
          duration: 3000,
        });
      } finally {
        setLoadingReports((prev) => ({ ...prev, [reportId]: false }));
      }
    },
    [toast, recentReports, selectedFormat]
  );
  useEffect(() => {
    console.log("selectedFormat changed to:", selectedFormat);
  }, [selectedFormat]);

  // Enhanced handler functions with toast notifications
  const handleTemplateSelect = (templateId: TemplateId) => {
    setSelectedTemplate(templateId);
    const template = templates.find((t) => t.id === templateId);
    if (template?.defaultTimeRange) {
      setSelectedTimeRange(template.defaultTimeRange);
    }
    if (template?.defaultFormat) {
      setSelectedFormat(template.defaultFormat);
    }

    toast({
      title: "Template Selected",
      description: `${template?.name} template loaded successfully.`,
      duration: 3000,
    });
  };

  const handleGenerateReport = async () => {
    if (!selectedTemplate) {
      toast({
        variant: "destructive",
        title: "Template Required",
        description: "Please select a template before generating a report.",
        duration: 3000,
      });
      return;
    }

    setIsGenerating(true);
    setError(null);

    toast({
      title: "Generating Report",
      description: "Please wait while we generate your report...",
      duration: 5000,
    });

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const newReport: Report = {
        id: Math.max(...recentReports.map((r) => r.id)) + 1,
        name: `${
          templates.find((t) => t.id === selectedTemplate)?.name || "Custom"
        } Report`,
        type:
          selectedTemplate.charAt(0).toUpperCase() +
          selectedTemplate.slice(1) +
          " Report",
        date: new Date().toISOString().split("T")[0],
        status: "completed",
        format: selectedFormat,
        timeRange: selectedTimeRange,
        templateId: selectedTemplate,
        sections:
          templates.find((t) => t.id === selectedTemplate)?.sections || [],
        createdBy: "Current User",
        lastModified: new Date().toISOString(),
      };

      // Update recentReports state
      setRecentReports((prevReports) => [newReport, ...prevReports]);

      toast({
        title: "Report Generated",
        description: "Your report has been generated successfully.",
        duration: 5000,
        action: (
          <ToastAction
            altText="View Report"
            onClick={() => console.log("Viewing report")}
          >
            View Report
          </ToastAction>
        ),
      });
    } catch (err) {
      setError("Failed to generate report. Please try again.");

      toast({
        variant: "destructive",
        title: "Generation Failed",
        description:
          "There was an error generating your report. Please try again.",
        duration: 5000,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShareReport = async (reportId: number) => {
    const report = recentReports.find((r) => r.id === reportId);

    if (!report) {
      toast({
        variant: "destructive",
        title: "Share Failed",
        description: "Report not found.",
        duration: 3000,
      });
      return;
    }

    // Simulate copying share link to clipboard
    await navigator.clipboard.writeText(
      `https://example.com/reports/${reportId}`
    );

    toast({
      title: "Link Copied",
      description: "Share link has been copied to clipboard.",
      duration: 3000,
    });
  };

  // Add these event handlers to your component's JSX
  return (
    <div className="bg-white rounded-xl p-6">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-xl font-semibold">Report Generator</h2>
          <p className="text-gray-500 mt-1">
            Create, schedule, and export reports
          </p>
        </div>
        <div className="flex space-x-4">
          <button
            className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
            onClick={() => setShowScheduleDialog(true)}
          >
            <Clock className="h-4 w-4" />
            <span>Schedule</span>
          </button>
          <button
            className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
            onClick={handleGenerateReport}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            <span>
              {isGenerating ? "Generating..." : "New Report from Template"}
            </span>
          </button>
        </div>
      </div>

      <ScheduleDialog />
      {/* Template Selection */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">Select Template</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {templates.map((template) => (
            <div
              key={template.id}
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                selectedTemplate === template.id
                  ? "border-blue-500 bg-blue-50"
                  : "hover:border-gray-300"
              }`}
              onClick={() => handleTemplateSelect(template.id)}
            >
              <h4 className="font-medium">{template.name}</h4>
              <p className="text-sm text-gray-600 mt-1">
                {template.description}
              </p>
              {template.sections.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs text-gray-500 mb-2">
                    Included sections:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {template.sections.map((section) => (
                      <span
                        key={section.id}
                        className="text-xs px-2 py-1 bg-white rounded-full border"
                      >
                        {section.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Report Configuration */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">Configure Report</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Time Range */}
          <div className="space-y-4">
            <h4 className="font-medium">Time Range</h4>
            <div className="flex space-x-4">
              <Select
                value={selectedTimeRange}
                onValueChange={(value: TimeRange) =>
                  setSelectedTimeRange(value)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last24h">Last 24 Hours</SelectItem>
                  <SelectItem value="last7days">Last 7 Days</SelectItem>
                  <SelectItem value="last30days">Last 30 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Export Format */}
          <div className="space-y-4">
            <h4 className="font-medium">Export Format</h4>
            <div className="flex space-x-4">
              <Select
                value={selectedFormat}
                onValueChange={(value: ExportFormat) => {
                  setSelectedFormat(value);
                  console.log("Changing format to:", value);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF Report</SelectItem>
                  <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                  <SelectItem value="csv">CSV Data</SelectItem>
                  <SelectItem value="powerpoint">PowerPoint</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Reports */}
      <div>
        <h3 className="text-lg font-medium mb-4">Recent Reports</h3>
        <div className="space-y-4">
          {getFilteredReports().map((report) => (
            <div
              key={report.id}
              className="p-4 border rounded-lg hover:shadow-sm transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{report.name}</h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-sm text-gray-500">{report.type}</span>
                    <span className="text-sm text-gray-400">•</span>
                    <span className="text-sm text-gray-500">{report.date}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    className="p-2 text-gray-400 hover:text-gray-600"
                    onClick={() => handleShareReport(report.id)}
                  >
                    <Share2 className="h-4 w-4" />
                  </button>
                  <button
                    className="p-2 text-gray-400 hover:text-gray-600"
                    onClick={() => handleDownloadReport(report.id)}
                    disabled={loadingReports[report.id]}
                  >
                    {loadingReports[report.id] ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportGenerator;
