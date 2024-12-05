"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Settings,
  Activity,
  UserCircle,
  Plus,
  Edit2,
  Search,
} from "lucide-react";

// Type definitions
interface UserPermissions {
  canCreateUsers: boolean;
  canDeleteUsers: boolean;
  canEditPermissions: boolean;
  canViewLogs: boolean;
  canManageRoles: boolean;
}

interface User {
  id: number;
  name: string;
  role: string;
  lastActive: string;
  status: "Active" | "Inactive";
  permissions: UserPermissions;
}

interface ActivityLog {
  id: number;
  userId: number;
  action: string;
  target: string;
  timestamp: string;
}

// Props interfaces
interface UserPermissionsDialogProps {
  user: User;
  onPermissionChange: (
    userId: number,
    permission: keyof UserPermissions
  ) => void;
}

// Mock data
const initialUsers: User[] = [
  {
    id: 1,
    name: "John Doe",
    role: "Admin",
    lastActive: "2024-12-05",
    status: "Active",
    permissions: {
      canCreateUsers: true,
      canDeleteUsers: true,
      canEditPermissions: true,
      canViewLogs: true,
      canManageRoles: true,
    },
  },
  {
    id: 2,
    name: "Jane Smith",
    role: "User",
    lastActive: "2024-12-04",
    status: "Active",
    permissions: {
      canCreateUsers: false,
      canDeleteUsers: false,
      canEditPermissions: false,
      canViewLogs: true,
      canManageRoles: false,
    },
  },
  {
    id: 3,
    name: "Mike Johnson",
    role: "User",
    lastActive: "2024-12-03",
    status: "Inactive",
    permissions: {
      canCreateUsers: false,
      canDeleteUsers: false,
      canEditPermissions: false,
      canViewLogs: false,
      canManageRoles: false,
    },
  },
];

const initialActivityLogs: ActivityLog[] = [
  {
    id: 1,
    userId: 1,
    action: "Updated user permissions",
    target: "Jane Smith",
    timestamp: "2024-12-05 14:30:00",
  },
  {
    id: 2,
    userId: 2,
    action: "Logged in",
    target: "System",
    timestamp: "2024-12-05 13:15:00",
  },
  {
    id: 3,
    userId: 1,
    action: "Created new user",
    target: "Mike Johnson",
    timestamp: "2024-12-03 09:45:00",
  },
];

const UserPermissionsDialog: React.FC<UserPermissionsDialogProps> = ({
  user,
  onPermissionChange,
}) => (
  <DialogContent className="sm:max-w-md">
    <DialogHeader>
      <DialogTitle>Edit Permissions - {user.name}</DialogTitle>
    </DialogHeader>
    <div className="space-y-4 py-4">
      {(
        Object.entries(user.permissions) as [keyof UserPermissions, boolean][]
      ).map(([permission, value]) => (
        <div key={permission} className="flex items-center justify-between">
          <span className="capitalize">
            {permission.replace(/([A-Z])/g, " $1")}
          </span>
          <button
            onClick={() => onPermissionChange(user.id, permission)}
            className={`px-3 py-1 rounded-full text-sm ${
              value
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {value ? "Enabled" : "Disabled"}
          </button>
        </div>
      ))}
    </div>
  </DialogContent>
);

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [activityLogs, setActivityLogs] =
    useState<ActivityLog[]>(initialActivityLogs);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handlePermissionChange = (
    userId: number,
    permission: keyof UserPermissions
  ): void => {
    setUsers(
      users.map((user) => {
        if (user.id === userId) {
          return {
            ...user,
            permissions: {
              ...user.permissions,
              [permission]: !user.permissions[permission],
            },
          };
        }
        return user;
      })
    );

    // Add activity log
    const newLog: ActivityLog = {
      id: activityLogs.length + 1,
      userId: 1, // Assuming current user is id 1
      action: "Updated permissions",
      target: users.find((u) => u.id === userId)?.name || "Unknown User",
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
    };

    setActivityLogs([newLog, ...activityLogs]);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getActiveUsersCount = (): number => {
    return users.filter((u) => u.status === "Active").length;
  };

  return (
    <div className="flex flex-col space-y-6 px-4 sm:px-6 lg:px-8 pt-4">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold">User Management</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-gray-500">+2 this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Active Now</CardTitle>
            <Activity className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getActiveUsersCount()}</div>
            <p className="text-xs text-gray-500">Online users</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Roles</CardTitle>
            <Settings className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-gray-500">Admin, User, Viewer</p>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      <div className="flex justify-end">
        <div className="relative">
          <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 border rounded-lg"
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchTerm(e.target.value)
            }
          />
        </div>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="activity">Activity Log</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4">User</th>
                      <th className="text-left p-4">Role</th>
                      <th className="text-left p-4">Last Active</th>
                      <th className="text-left p-4">Status</th>
                      <th className="text-left p-4">Permissions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b hover:bg-gray-50">
                        <td className="p-4 flex items-center gap-3">
                          <UserCircle className="h-8 w-8 text-gray-400" />
                          {user.name}
                        </td>
                        <td className="p-4">{user.role}</td>
                        <td className="p-4">{user.lastActive}</td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              user.status === "Active"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {user.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <Dialog>
                            <DialogTrigger asChild>
                              <span className="text-blue-500 hover:text-blue-600 cursor-pointer">
                                <Edit2 className="h-4 w-4" />
                              </span>
                            </DialogTrigger>
                            <UserPermissionsDialog
                              user={user}
                              onPermissionChange={handlePermissionChange}
                            />
                          </Dialog>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4">Time</th>
                      <th className="text-left p-4">User</th>
                      <th className="text-left p-4">Action</th>
                      <th className="text-left p-4">Target</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activityLogs.map((log) => (
                      <tr key={log.id} className="border-b hover:bg-gray-50">
                        <td className="p-4">{log.timestamp}</td>
                        <td className="p-4">
                          {users.find((u) => u.id === log.userId)?.name}
                        </td>
                        <td className="p-4">{log.action}</td>
                        <td className="p-4">{log.target}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserManagement;
