"use client";
import React, { useState, useCallback } from "react";
import {
  Bell,
  AlertTriangle,
  TrendingUp,
  MessageSquare,
  Settings,
  Plus,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Trash2,
  Edit,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// TypeScript interfaces
interface Alert {
  id: number;
  type: "spike" | "sentiment" | "trending" | "engagement" | "keyword";
  title: string;
  description: string;
  priority: "critical" | "high" | "medium" | "low";
  timestamp: string;
  status: "active" | "resolved" | "acknowledged";
  metadata?: {
    previousValue?: number;
    currentValue?: number;
    threshold?: number;
    platform?: string;
    keywords?: string[];
  };
}

interface AlertRule {
  id: number;
  name: string;
  description: string;
  type: "spike" | "sentiment" | "trending" | "engagement" | "keyword";
  status: "enabled" | "disabled";
  conditions: {
    threshold?: number;
    timeWindow?: string;
    keywords?: string[];
    platforms?: string[];
  };
  notifications: {
    email?: boolean;
    slack?: boolean;
    push?: boolean;
  };
  createdAt: string;
  lastModified: string;
}

interface NewAlertRuleForm {
  name: string;
  description: string;
  type: AlertRule["type"];
  conditions: AlertRule["conditions"];
  notifications: AlertRule["notifications"];
}

const AlertSystem = () => {
  // State management
  const [activeAlerts, setActiveAlerts] = useState<Alert[]>([
    {
      id: 1,
      type: "spike",
      title: "Mention Spike Detected",
      description:
        'Unusual increase in mentions about "Computer Science Course"',
      priority: "high",
      timestamp: "10 minutes ago",
      status: "active",
      metadata: {
        previousValue: 50,
        currentValue: 150,
        threshold: 50,
        platform: "Twitter",
      },
    },
    {
      id: 2,
      type: "sentiment",
      title: "Negative Sentiment Alert",
      description:
        'Sentiment score dropped below threshold for "Campus Facilities"',
      priority: "medium",
      timestamp: "1 hour ago",
      status: "active",
      metadata: {
        previousValue: 0.75,
        currentValue: 0.25,
        threshold: 0.3,
      },
    },
    {
      id: 3,
      type: "trending",
      title: "New Trending Topic",
      description: '"AI Workshop" is trending across platforms',
      priority: "low",
      timestamp: "2 hours ago",
      status: "resolved",
      metadata: {
        keywords: ["AI", "Workshop", "Technology"],
        platform: "All Platforms",
      },
    },
    {
      id: 4,
      type: "engagement",
      title: "Low Engagement Warning",
      description:
        "Student engagement metrics below average for Online Courses",
      priority: "critical",
      timestamp: "30 minutes ago",
      status: "acknowledged",
      metadata: {
        previousValue: 85,
        currentValue: 45,
        threshold: 60,
      },
    },
    {
      id: 5,
      type: "keyword",
      title: "Keyword Alert",
      description: 'Multiple mentions of "Technical Issues" detected',
      priority: "high",
      timestamp: "15 minutes ago",
      status: "active",
      metadata: {
        keywords: ["bug", "error", "technical issue"],
        platform: "Support Forums",
      },
    },
  ]);

  const [alertRules, setAlertRules] = useState<AlertRule[]>([
    {
      id: 1,
      name: "Mention Spike Detection",
      description: "Alert when mentions increase by 50% within 1 hour",
      type: "spike",
      status: "enabled",
      conditions: {
        threshold: 50,
        timeWindow: "1h",
        platforms: ["Twitter", "Facebook", "LinkedIn"],
      },
      notifications: {
        email: true,
        slack: true,
        push: false,
      },
      createdAt: "2024-01-15T10:00:00Z",
      lastModified: "2024-03-20T15:30:00Z",
    },
    {
      id: 2,
      name: "Sentiment Monitoring",
      description: "Alert when sentiment score drops below 30%",
      type: "sentiment",
      status: "enabled",
      conditions: {
        threshold: 0.3,
        timeWindow: "24h",
      },
      notifications: {
        email: true,
        slack: true,
        push: true,
      },
      createdAt: "2024-02-01T09:00:00Z",
      lastModified: "2024-03-15T11:20:00Z",
    },
    {
      id: 3,
      name: "Trending Topics",
      description: "Alert when new topics start trending",
      type: "trending",
      status: "disabled",
      conditions: {
        timeWindow: "4h",
        platforms: ["All"],
      },
      notifications: {
        email: false,
        slack: true,
        push: false,
      },
      createdAt: "2024-02-15T14:00:00Z",
      lastModified: "2024-03-10T16:45:00Z",
    },
    {
      id: 4,
      name: "Engagement Monitoring",
      description: "Alert on significant drops in student engagement",
      type: "engagement",
      status: "enabled",
      conditions: {
        threshold: 60,
        timeWindow: "12h",
      },
      notifications: {
        email: true,
        slack: true,
        push: true,
      },
      createdAt: "2024-03-01T08:00:00Z",
      lastModified: "2024-03-18T13:15:00Z",
    },
    {
      id: 5,
      name: "Technical Issues Tracking",
      description: "Monitor for mentions of technical problems",
      type: "keyword",
      status: "enabled",
      conditions: {
        keywords: ["bug", "error", "issue", "not working"],
        timeWindow: "30m",
        platforms: ["Support Forums", "Email"],
      },
      notifications: {
        email: true,
        slack: true,
        push: false,
      },
      createdAt: "2024-03-05T11:00:00Z",
      lastModified: "2024-03-19T09:30:00Z",
    },
  ]);
  const [expandedAlerts, setExpandedAlerts] = useState<number[]>([]);
  const [isNewRuleModalOpen, setIsNewRuleModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<AlertRule | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(
    null
  );

  // Form state for new/edit rule
  const [ruleForm, setRuleForm] = useState<NewAlertRuleForm>({
    name: "",
    description: "",
    type: "spike",
    conditions: {
      threshold: 50,
      timeWindow: "1h",
      platforms: [],
      keywords: [],
    },
    notifications: {
      email: false,
      slack: false,
      push: false,
    },
  });

  // Filter and sort state
  const [filterType, setFilterType] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter alerts
  const getFilteredAlerts = useCallback(() => {
    let filtered = [...activeAlerts];

    // Apply type filter
    if (filterType !== "all") {
      filtered = filtered.filter((alert) => alert.type === filterType);
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (alert) =>
          alert.title.toLowerCase().includes(query) ||
          alert.description.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    switch (sortBy) {
      case "newest":
        filtered.sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        break;
      case "oldest":
        filtered.sort(
          (a, b) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
        break;
      case "priority": {
        const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        filtered.sort(
          (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
        );
        break;
      }
      case "status": {
        const statusOrder = { active: 0, acknowledged: 1, resolved: 2 };
        filtered.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
        break;
      }
    }

    return filtered;
  }, [activeAlerts, filterType, sortBy, searchQuery]);

  // Alert management functions
  const acknowledgeAlert = useCallback((alertId: number) => {
    setActiveAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId
          ? { ...alert, status: "acknowledged" as const, timestamp: "Just now" }
          : alert
      )
    );
  }, []);

  const resolveAlert = useCallback((alertId: number) => {
    setActiveAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId
          ? { ...alert, status: "resolved" as const, timestamp: "Just now" }
          : alert
      )
    );
  }, []);

  const deleteAlert = useCallback((alertId: number) => {
    setActiveAlerts((prev) => prev.filter((alert) => alert.id !== alertId));
  }, []);

  // Rule management functions
  const createRule = useCallback(
    (newRule: Omit<AlertRule, "id" | "createdAt" | "lastModified">) => {
      const rule: AlertRule = {
        ...newRule,
        id: Math.max(...alertRules.map((r) => r.id)) + 1,
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString(),
      };
      setAlertRules((prev) => [...prev, rule]);
    },
    [alertRules]
  );

  const updateRule = useCallback(
    (ruleId: number, updates: Partial<AlertRule>) => {
      setAlertRules((prev) =>
        prev.map((rule) =>
          rule.id === ruleId
            ? { ...rule, ...updates, lastModified: new Date().toISOString() }
            : rule
        )
      );
    },
    []
  );

  const toggleRuleStatus = useCallback((ruleId: number) => {
    setAlertRules((prev) =>
      prev.map((rule) =>
        rule.id === ruleId
          ? {
              ...rule,
              status: rule.status === "enabled" ? "disabled" : "enabled",
              lastModified: new Date().toISOString(),
            }
          : rule
      )
    );
  }, []);

  const deleteRule = useCallback((ruleId: number) => {
    setAlertRules((prev) => prev.filter((rule) => rule.id !== ruleId));
  }, []);

  // Form handling
  const handleRuleSubmit = useCallback(
    (formData: NewAlertRuleForm, editingRuleId?: number) => {
      if (editingRuleId) {
        updateRule(editingRuleId, formData);
      } else {
        createRule({
          ...formData,
          status: "enabled",
        });
      }
      setIsNewRuleModalOpen(false);
      setEditingRule(null);
    },
    [createRule, updateRule]
  );

  // Metadata display functions
  const formatMetadata = useCallback((metadata: Alert["metadata"]) => {
    if (!metadata) return [];

    return Object.entries(metadata)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          return { label: key, value: value.join(", ") };
        }
        return { label: key, value: value.toString() };
      });
  }, []);

  // Handlers for alerts
  const toggleAlertExpansion = (alertId: number) => {
    setExpandedAlerts((prev) =>
      prev.includes(alertId)
        ? prev.filter((id) => id !== alertId)
        : [...prev, alertId]
    );
  };

  const updateAlertStatus = (alertId: number, newStatus: Alert["status"]) => {
    setActiveAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId
          ? { ...alert, status: newStatus, timestamp: "Just now" }
          : alert
      )
    );
  };

  const saveRule = (isNew: boolean) => {
    const newRule: AlertRule = {
      id: isNew
        ? Math.max(...alertRules.map((r) => r.id)) + 1
        : editingRule!.id,
      ...ruleForm,
      status: "enabled",
      createdAt: isNew ? new Date().toISOString() : editingRule!.createdAt,
      lastModified: new Date().toISOString(),
    };

    setAlertRules((prev) =>
      isNew
        ? [...prev, newRule]
        : prev.map((rule) => (rule.id === newRule.id ? newRule : rule))
    );

    setIsNewRuleModalOpen(false);
    setEditingRule(null);
    resetForm();
  };

  const resetForm = () => {
    setRuleForm({
      name: "",
      description: "",
      type: "spike",
      conditions: {
        threshold: 50,
        timeWindow: "1h",
        platforms: [],
        keywords: [],
      },
      notifications: {
        email: false,
        slack: false,
        push: false,
      },
    });
  };

  // Utility functions
  const getPriorityColor = (priority: Alert["priority"]) => {
    switch (priority) {
      case "critical":
        return "text-purple-500 bg-purple-50";
      case "high":
        return "text-red-500 bg-red-50";
      case "medium":
        return "text-yellow-500 bg-yellow-50";
      case "low":
        return "text-blue-500 bg-blue-50";
      default:
        return "text-gray-500 bg-gray-50";
    }
  };

  const getStatusIcon = (status: Alert["status"]) => {
    switch (status) {
      case "active":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case "resolved":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "acknowledged":
        return <Bell className="h-5 w-5 text-blue-500" />;
      default:
        return <XCircle className="h-5 w-5 text-gray-500" />;
    }
  };
  const formatDate = (date: any) => {
    return new Date(date).toISOString().split("T")[0];
  };

  return (
    <div className="bg-white rounded-xl p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold">Alert Center</h2>
          <div className="flex items-center space-x-2 px-3 py-1 bg-green-50 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-green-700">System Active</span>
          </div>
        </div>
        <Dialog open={isNewRuleModalOpen} onOpenChange={setIsNewRuleModalOpen}>
          <DialogTrigger asChild>
            <Button
              className="flex items-center space-x-2"
              onClick={() => {
                setEditingRule(null);
                resetForm();
              }}
            >
              <Plus className="h-4 w-4" />
              <span>New Alert Rule</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingRule ? "Edit Alert Rule" : "Create New Alert Rule"}
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Rule Name</Label>
                <Input
                  id="name"
                  value={ruleForm.name}
                  onChange={(e) =>
                    setRuleForm((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={ruleForm.description}
                  onChange={(e) =>
                    setRuleForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">Alert Type</Label>
                <Select
                  value={ruleForm.type}
                  onValueChange={(value) =>
                    setRuleForm((prev) => ({
                      ...prev,
                      type: value as AlertRule["type"],
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="spike">Mention Spike</SelectItem>
                    <SelectItem value="sentiment">Sentiment</SelectItem>
                    <SelectItem value="trending">Trending</SelectItem>
                    <SelectItem value="engagement">Engagement</SelectItem>
                    <SelectItem value="keyword">Keyword</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsNewRuleModalOpen(false);
                  setEditingRule(null);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button onClick={() => saveRule(!editingRule)}>
                {editingRule ? "Save Changes" : "Create Rule"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Active Alerts Section */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">Active Alerts</h3>
        <div className="space-y-4">
          {getFilteredAlerts().map((alert) => (
            <div
              key={alert.id}
              className="p-4 border rounded-lg hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  {getStatusIcon(alert.status)}
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium">{alert.title}</h4>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(
                          alert.priority
                        )}`}
                      >
                        {alert.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {alert.description}
                    </p>
                    <span className="text-xs text-gray-500 mt-2 block">
                      {alert.timestamp}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {alert.status === "active" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        updateAlertStatus(alert.id, "acknowledged")
                      }
                    >
                      Acknowledge
                    </Button>
                  )}
                  {(alert.status === "active" ||
                    alert.status === "acknowledged") && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateAlertStatus(alert.id, "resolved")}
                    >
                      Resolve
                    </Button>
                  )}
                  <button
                    className="text-gray-400 hover:text-gray-600"
                    onClick={() => toggleAlertExpansion(alert.id)}
                  >
                    {expandedAlerts.includes(alert.id) ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              {expandedAlerts.includes(alert.id) && alert.metadata && (
                <div className="mt-4 pl-8 border-t pt-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {alert.metadata.previousValue !== undefined && (
                      <div>
                        <span className="text-gray-500">Previous Value:</span>
                        <span className="ml-2 font-medium">
                          {alert.metadata.previousValue}
                        </span>
                      </div>
                    )}
                    {alert.metadata.currentValue !== undefined && (
                      <div>
                        <span className="text-gray-500">Current Value:</span>
                        <span className="ml-2 font-medium">
                          {alert.metadata.currentValue}
                        </span>
                      </div>
                    )}
                    {alert.metadata.threshold !== undefined && (
                      <div>
                        <span className="text-gray-500">Threshold:</span>
                        <span className="ml-2 font-medium">
                          {alert.metadata.threshold}
                        </span>
                      </div>
                    )}
                    {alert.metadata.platform && (
                      <div>
                        <span className="text-gray-500">Platform:</span>
                        <span className="ml-2 font-medium">
                          {alert.metadata.platform}
                        </span>
                      </div>
                    )}
                    {alert.metadata.keywords && (
                      <div className="col-span-2">
                        <span className="text-gray-500">Keywords:</span>
                        <span className="ml-2 font-medium">
                          {alert.metadata.keywords.join(", ")}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Alert Rules Section */}
      <div>
        <h3 className="text-lg font-medium mb-4">Alert Rules</h3>
        <div className="space-y-4">
          {alertRules.map((rule) => (
            <div
              key={rule.id}
              className="p-4 border rounded-lg hover:shadow-sm transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{rule.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {rule.description}
                  </p>
                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                    <span>Created: {formatDate(rule.createdAt)}</span>
                    <span>Modified: {formatDate(rule.lastModified)}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Select
                    defaultValue={rule.status}
                    onValueChange={(value: AlertRule["status"]) =>
                      toggleRuleStatus(rule.id)
                    }
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="enabled">Enabled</SelectItem>
                      <SelectItem value="disabled">Disabled</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditingRule(rule);
                        setRuleForm({
                          name: rule.name,
                          description: rule.description,
                          type: rule.type,
                          conditions: { ...rule.conditions },
                          notifications: { ...rule.notifications },
                        });
                        setIsNewRuleModalOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Dialog
                      open={showDeleteConfirm === rule.id}
                      onOpenChange={(open) =>
                        setShowDeleteConfirm(open ? rule.id : null)
                      }
                    >
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Delete Alert Rule</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to delete "{rule.name}"? This
                            action cannot be undone.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => setShowDeleteConfirm(null)}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => deleteRule(rule.id)}
                          >
                            Delete
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
              {expandedAlerts.includes(rule.id) && (
                <div className="mt-4 border-t pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium text-sm mb-2">Conditions</h5>
                      <div className="space-y-2 text-sm">
                        {rule.conditions.threshold && (
                          <p>Threshold: {rule.conditions.threshold}</p>
                        )}
                        {rule.conditions.timeWindow && (
                          <p>Time Window: {rule.conditions.timeWindow}</p>
                        )}
                        {rule.conditions.platforms && (
                          <p>
                            Platforms: {rule.conditions.platforms.join(", ")}
                          </p>
                        )}
                        {rule.conditions.keywords && (
                          <p>Keywords: {rule.conditions.keywords.join(", ")}</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <h5 className="font-medium text-sm mb-2">
                        Notifications
                      </h5>
                      <div className="space-y-2 text-sm">
                        <p>
                          Email:{" "}
                          {rule.notifications.email ? "Enabled" : "Disabled"}
                        </p>
                        <p>
                          Slack:{" "}
                          {rule.notifications.slack ? "Enabled" : "Disabled"}
                        </p>
                        <p>
                          Push:{" "}
                          {rule.notifications.push ? "Enabled" : "Disabled"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Filter and Sort Options */}
      {/* Filter and Sort Options */}
      <div className="mt-6 border-t pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="spike">Mention Spike</SelectItem>
                <SelectItem value="sentiment">Sentiment</SelectItem>
                <SelectItem value="trending">Trending</SelectItem>
                <SelectItem value="engagement">Engagement</SelectItem>
                <SelectItem value="keyword">Keyword</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
                <SelectItem value="status">Status</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              Showing {getFilteredAlerts().length} alerts
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertSystem;
