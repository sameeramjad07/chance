"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Users,
  FolderOpen,
  Heart,
  BarChart3,
  Settings,
  Search,
  MoreHorizontal,
  TrendingUp,
  Shield,
  Award,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Eye,
  Ban,
  UserCheck,
  Star,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock data
const mockUsers = [
  {
    id: 1,
    name: "Sarah Chen",
    email: "sarah@example.com",
    role: "Creator",
    projects: 12,
    heartbeats: 45,
    influence: 2840,
    status: "active",
    joinDate: "2024-01-15",
  },
  {
    id: 2,
    name: "Marcus Rodriguez",
    email: "marcus@example.com",
    role: "Collaborator",
    projects: 8,
    heartbeats: 23,
    influence: 1920,
    status: "active",
    joinDate: "2024-02-03",
  },
  {
    id: 3,
    name: "Emma Thompson",
    email: "emma@example.com",
    role: "Creator",
    projects: 15,
    heartbeats: 67,
    influence: 3450,
    status: "suspended",
    joinDate: "2023-12-10",
  },
  {
    id: 4,
    name: "David Kim",
    email: "david@example.com",
    role: "Collaborator",
    projects: 5,
    heartbeats: 12,
    influence: 890,
    status: "active",
    joinDate: "2024-03-20",
  },
];

const mockProjects = [
  {
    id: 1,
    title: "EcoTrack Mobile App",
    creator: "Sarah Chen",
    members: 8,
    category: "Mobile Development",
    status: "active",
    created: "2024-01-20",
    completion: 75,
  },
  {
    id: 2,
    title: "Community Garden Platform",
    creator: "Marcus Rodriguez",
    members: 12,
    category: "Web Development",
    status: "completed",
    created: "2024-02-15",
    completion: 100,
  },
  {
    id: 3,
    title: "AI Writing Assistant",
    creator: "Emma Thompson",
    members: 6,
    category: "AI/ML",
    status: "pending",
    created: "2024-03-10",
    completion: 30,
  },
  {
    id: 4,
    title: "Fitness Tracking Dashboard",
    creator: "David Kim",
    members: 4,
    category: "Health Tech",
    status: "active",
    created: "2024-03-25",
    completion: 45,
  },
];

const mockHeartbeats = [
  {
    id: 1,
    author: "Sarah Chen",
    content:
      "Just launched our MVP! The community response has been incredible...",
    likes: 234,
    comments: 45,
    shares: 12,
    created: "2024-03-28",
    status: "published",
  },
  {
    id: 2,
    author: "Marcus Rodriguez",
    content:
      "Working late nights on the garden platform. The passion drives us forward!",
    likes: 156,
    comments: 23,
    shares: 8,
    created: "2024-03-27",
    status: "published",
  },
  {
    id: 3,
    author: "Emma Thompson",
    content: "AI is revolutionizing how we approach creative writing...",
    likes: 89,
    comments: 67,
    shares: 15,
    created: "2024-03-26",
    status: "flagged",
  },
  {
    id: 4,
    author: "David Kim",
    content:
      "Fitness tech meetup was amazing! Met so many talented developers.",
    likes: 78,
    comments: 12,
    shares: 5,
    created: "2024-03-25",
    status: "published",
  },
];

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");

  const stats = {
    totalUsers: 1247,
    activeProjects: 89,
    totalHeartbeats: 3456,
    pendingReviews: 23,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-sm">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-violet-600 to-purple-600">
                <Shield className="h-4 w-4 text-white" />
              </div>
              <h1 className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-xl font-bold text-transparent">
                Chance Admin
              </h1>
            </div>
            <Badge
              variant="secondary"
              className="bg-violet-100 text-violet-700"
            >
              Super Admin
            </Badge>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
              <Input
                placeholder="Search users, projects, posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-80 pl-10"
              />
            </div>
            <Avatar>
              <AvatarImage src="/admin-avatar.png" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="min-h-screen w-64 border-r bg-white p-6">
          <nav className="space-y-2">
            <Button
              variant={activeTab === "overview" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("overview")}
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              Overview
            </Button>
            <Button
              variant={activeTab === "users" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("users")}
            >
              <Users className="mr-2 h-4 w-4" />
              Users
            </Button>
            <Button
              variant={activeTab === "projects" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("projects")}
            >
              <FolderOpen className="mr-2 h-4 w-4" />
              Projects
            </Button>
            <Button
              variant={activeTab === "heartbeats" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("heartbeats")}
            >
              <Heart className="mr-2 h-4 w-4" />
              Heart Beats
            </Button>
            <Button
              variant={activeTab === "influence" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("influence")}
            >
              <Award className="mr-2 h-4 w-4" />
              Influence Points
            </Button>
            <Button
              variant={activeTab === "settings" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("settings")}
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div>
                <h2 className="mb-2 text-2xl font-bold text-gray-900">
                  Platform Overview
                </h2>
                <p className="text-gray-600">
                  Monitor and manage the Chance platform
                </p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-0 bg-gradient-to-br from-blue-50 to-blue-100 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-blue-700">
                      Total Users
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-900">
                      {stats.totalUsers.toLocaleString()}
                    </div>
                    <div className="mt-1 flex items-center text-xs text-blue-600">
                      <TrendingUp className="mr-1 h-3 w-3" />
                      +12% from last month
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 bg-gradient-to-br from-green-50 to-green-100 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-green-700">
                      Active Projects
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-900">
                      {stats.activeProjects}
                    </div>
                    <div className="mt-1 flex items-center text-xs text-green-600">
                      <TrendingUp className="mr-1 h-3 w-3" />
                      +8% from last month
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 bg-gradient-to-br from-purple-50 to-purple-100 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-purple-700">
                      Total Heart Beats
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-purple-900">
                      {stats.totalHeartbeats.toLocaleString()}
                    </div>
                    <div className="mt-1 flex items-center text-xs text-purple-600">
                      <TrendingUp className="mr-1 h-3 w-3" />
                      +25% from last month
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 bg-gradient-to-br from-orange-50 to-orange-100 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-orange-700">
                      Pending Reviews
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-900">
                      {stats.pendingReviews}
                    </div>
                    <div className="mt-1 flex items-center text-xs text-orange-600">
                      <AlertTriangle className="mr-1 h-3 w-3" />
                      Requires attention
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Latest platform activities requiring admin attention
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 rounded-lg border border-yellow-200 bg-yellow-50 p-3">
                      <AlertTriangle className="h-5 w-5 text-yellow-600" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          Content flagged for review
                        </p>
                        <p className="text-sm text-gray-600">
                          Heart beat by Emma Thompson needs moderation
                        </p>
                      </div>
                      <Button size="sm" variant="outline">
                        Review
                      </Button>
                    </div>

                    <div className="flex items-center gap-4 rounded-lg border border-blue-200 bg-blue-50 p-3">
                      <UserCheck className="h-5 w-5 text-blue-600" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          New user registration
                        </p>
                        <p className="text-sm text-gray-600">
                          Alex Johnson joined the platform
                        </p>
                      </div>
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                    </div>

                    <div className="flex items-center gap-4 rounded-lg border border-green-200 bg-green-50 p-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          Project completed
                        </p>
                        <p className="text-sm text-gray-600">
                          Community Garden Platform by Marcus Rodriguez
                        </p>
                      </div>
                      <Button size="sm" variant="outline">
                        Award Points
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "users" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    User Management
                  </h2>
                  <p className="text-gray-600">Manage all platform users</p>
                </div>
                <Button>Add User</Button>
              </div>

              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Projects</TableHead>
                        <TableHead>Heart Beats</TableHead>
                        <TableHead>Influence</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>
                                  {user.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-sm text-gray-500">
                                  {user.email}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                user.role === "Creator"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell>{user.projects}</TableCell>
                          <TableCell>{user.heartbeats}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-500" />
                              {user.influence.toLocaleString()}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                user.status === "active"
                                  ? "default"
                                  : "destructive"
                              }
                            >
                              {user.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Profile
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit User
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Ban className="mr-2 h-4 w-4" />
                                  Suspend
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "projects" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Project Management
                  </h2>
                  <p className="text-gray-600">
                    Monitor and manage all projects
                  </p>
                </div>
              </div>

              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Project</TableHead>
                        <TableHead>Creator</TableHead>
                        <TableHead>Members</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Progress</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockProjects.map((project) => (
                        <TableRow key={project.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{project.title}</p>
                              <p className="text-sm text-gray-500">
                                Created {project.created}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>{project.creator}</TableCell>
                          <TableCell>{project.members} members</TableCell>
                          <TableCell>
                            <Badge variant="outline">{project.category}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-16 overflow-hidden rounded-full bg-gray-200">
                                <div
                                  className="h-full bg-blue-500 transition-all"
                                  style={{ width: `${project.completion}%` }}
                                />
                              </div>
                              <span className="text-sm text-gray-600">
                                {project.completion}%
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                project.status === "completed"
                                  ? "default"
                                  : project.status === "active"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {project.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Award className="mr-2 h-4 w-4" />
                                  Award Points
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit Project
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">
                                  <XCircle className="mr-2 h-4 w-4" />
                                  Archive
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "heartbeats" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Heart Beats Management
                  </h2>
                  <p className="text-gray-600">
                    Monitor and moderate all posts
                  </p>
                </div>
              </div>

              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Author</TableHead>
                        <TableHead>Content</TableHead>
                        <TableHead>Engagement</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockHeartbeats.map((post) => (
                        <TableRow key={post.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>
                                  {post.author
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-medium">{post.author}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="max-w-md truncate">{post.content}</p>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span>{post.likes} likes</span>
                              <span>{post.comments} comments</span>
                              <span>{post.shares} shares</span>
                            </div>
                          </TableCell>
                          <TableCell>{post.created}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                post.status === "published"
                                  ? "default"
                                  : post.status === "flagged"
                                    ? "destructive"
                                    : "outline"
                              }
                            >
                              {post.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Full Post
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Approve
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Ban className="mr-2 h-4 w-4" />
                                  Hide Post
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "influence" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Influence Points Management
                </h2>
                <p className="text-gray-600">
                  Award and manage user influence points
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Award Points</CardTitle>
                    <CardDescription>
                      Manually award influence points to users
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">User</label>
                      <Input placeholder="Search user..." />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Points</label>
                      <Input
                        type="number"
                        placeholder="Enter points to award"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Reason</label>
                      <Input placeholder="Reason for awarding points" />
                    </div>
                    <Button className="w-full">Award Points</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Point Categories</CardTitle>
                    <CardDescription>
                      Configure point values for different actions
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Project Creation</span>
                      <Input className="w-20" defaultValue="100" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Project Completion</span>
                      <Input className="w-20" defaultValue="500" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Heart Beat Post</span>
                      <Input className="w-20" defaultValue="10" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Project Collaboration</span>
                      <Input className="w-20" defaultValue="250" />
                    </div>
                    <Button className="w-full">Save Settings</Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Platform Settings
                </h2>
                <p className="text-gray-600">
                  Configure platform-wide settings
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>General Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">
                        Platform Name
                      </label>
                      <Input defaultValue="Chance" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">
                        Max Projects per User
                      </label>
                      <Input type="number" defaultValue="10" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">
                        Max Members per Project
                      </label>
                      <Input type="number" defaultValue="20" />
                    </div>
                    <Button>Save Changes</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Content Moderation</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Auto-moderate content</span>
                      <Button variant="outline" size="sm">
                        Enable
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Require approval for new projects</span>
                      <Button variant="outline" size="sm">
                        Disable
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Flag inappropriate content</span>
                      <Button variant="outline" size="sm">
                        Enable
                      </Button>
                    </div>
                    <Button>Update Settings</Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
