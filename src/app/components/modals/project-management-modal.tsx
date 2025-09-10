"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  Settings,
  MessageSquare,
  BarChart3,
  UserMinus,
  Crown,
  Mail,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface Project {
  id: number;
  title: string;
  description: string;
  category: string;
  creator: { name: string; avatar: string; id: string };
  members: number;
  maxMembers: number;
  upvotes: number;
  createdAt: string;
  status: string;
  tags: string[];
  difficulty: string;
  timeline: string;
  requirements: string;
  isJoined: boolean;
  isCreator: boolean;
}

interface ProjectManagementModalProps {
  project: Project;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Mock data for project members and applications
const mockMembers = [
  {
    id: 1,
    name: "John Doe",
    avatar: "/john-avatar.jpg",
    role: "Developer",
    joinedAt: "2024-01-20",
    status: "Active",
  },
  {
    id: 2,
    name: "Jane Smith",
    avatar: "/jane-avatar.jpg",
    role: "Designer",
    joinedAt: "2024-01-22",
    status: "Active",
  },
  {
    id: 3,
    name: "Mike Johnson",
    avatar: "/mike-avatar.jpg",
    role: "Developer",
    joinedAt: "2024-01-25",
    status: "Inactive",
  },
];

const mockApplications = [
  {
    id: 1,
    name: "Alice Brown",
    avatar: "/alice-avatar.jpg",
    message:
      "I'd love to contribute to this project. I have 3 years of React experience.",
    appliedAt: "2024-01-28",
  },
  {
    id: 2,
    name: "Bob Wilson",
    avatar: "/bob-avatar.jpg",
    message: "Experienced Python developer interested in AI/ML projects.",
    appliedAt: "2024-01-27",
  },
];

export function ProjectManagementModal({
  project,
  open,
  onOpenChange,
}: ProjectManagementModalProps) {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Manage Project: {project.title}
          </DialogTitle>
          <DialogDescription>
            Manage your project settings, team members, and applications.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Members
                  </CardTitle>
                  <Users className="text-muted-foreground h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{project.members}</div>
                  <p className="text-muted-foreground text-xs">
                    {project.maxMembers - project.members} spots remaining
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Pending Applications
                  </CardTitle>
                  <MessageSquare className="text-muted-foreground h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {mockApplications.length}
                  </div>
                  <p className="text-muted-foreground text-xs">
                    Awaiting your review
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Project Upvotes
                  </CardTitle>
                  <BarChart3 className="text-muted-foreground h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{project.upvotes}</div>
                  <p className="text-muted-foreground text-xs">+5 this week</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span>John Doe joined the project</span>
                    <span className="text-muted-foreground ml-auto">
                      2 hours ago
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                    <span>New application from Alice Brown</span>
                    <span className="text-muted-foreground ml-auto">
                      1 day ago
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                    <span>Project received 3 new upvotes</span>
                    <span className="text-muted-foreground ml-auto">
                      2 days ago
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="members" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                Team Members ({mockMembers.length})
              </h3>
              <Button size="sm">
                <Mail className="mr-2 h-4 w-4" />
                Invite Members
              </Button>
            </div>

            <div className="space-y-3">
              {mockMembers.map((member) => (
                <Card key={member.id}>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={member.avatar || "/placeholder.svg"}
                          />
                          <AvatarFallback>{member.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold">{member.name}</p>
                            {member.id === 1 && (
                              <Crown className="h-4 w-4 text-yellow-500" />
                            )}
                            <Badge
                              variant={
                                member.status === "Active"
                                  ? "default"
                                  : "secondary"
                              }
                              className="text-xs"
                            >
                              {member.status}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground text-sm">
                            {member.role} • Joined{" "}
                            {new Date(member.joinedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <UserMinus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="applications" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                Pending Applications ({mockApplications.length})
              </h3>
            </div>

            <div className="space-y-3">
              {mockApplications.map((application) => (
                <Card key={application.id}>
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={application.avatar || "/placeholder.svg"}
                            />
                            <AvatarFallback>
                              {application.name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold">{application.name}</p>
                            <p className="text-muted-foreground text-sm">
                              Applied{" "}
                              {new Date(
                                application.appliedAt,
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Accept
                          </Button>
                          <Button size="sm" variant="outline">
                            <XCircle className="mr-2 h-4 w-4" />
                            Decline
                          </Button>
                        </div>
                      </div>
                      <div className="bg-muted rounded-lg p-3">
                        <p className="text-sm">{application.message}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Project Settings</CardTitle>
                <CardDescription>
                  Update your project information and settings.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="project-title">Project Title</Label>
                    <Input id="project-title" defaultValue={project.title} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="project-status">Status</Label>
                    <Select defaultValue={project.status.toLowerCase()}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="recruiting">Recruiting</SelectItem>
                        <SelectItem value="paused">Paused</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="project-description">Description</Label>
                  <Textarea
                    id="project-description"
                    defaultValue={project.description}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="max-members">Maximum Members</Label>
                    <Input
                      id="max-members"
                      type="number"
                      defaultValue={project.maxMembers}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Difficulty Level</Label>
                    <Select defaultValue={project.difficulty.toLowerCase()}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">
                          Intermediate
                        </SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline">Cancel</Button>
                  <Button>Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
