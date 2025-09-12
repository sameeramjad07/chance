"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
  BarChart3,
  UserMinus,
  Crown,
  Trash2,
  Calendar,
} from "lucide-react";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { z } from "zod";

type Project = {
  id: string;
  title: string;
  description: string;
  category: string;
  impact: string;
  teamSize: number;
  effort: string;
  peopleInfluenced: number | null;
  typeOfPeople: string | null;
  requiredTools: string[] | null;
  actionPlan: string[] | null;
  collaboration: string | null;
  likes: number;
  creatorId: string;
  status: "open" | "ongoing" | "completed";
  visibility: "public" | "private";
  adminNotes: string | null;
  createdAt: Date;
  updatedAt: Date | null;
  voteCount: number;
  creator: {
    id: string;
    username: string | null;
    profileImageUrl: string | null;
  };
  isCreator?: boolean;
};

interface ProjectManagementModalProps {
  project: Project;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
  onDelete: () => void;
}

export function ProjectManagementModal({
  project,
  open,
  onOpenChange,
  onUpdate,
  onDelete,
}: ProjectManagementModalProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: project.title,
    description: project.description,
    category: project.category,
    impact: project.impact,
    teamSize: project.teamSize.toString(),
    effort: project.effort,
    visibility: project.visibility,
    status: project.status,
    adminNotes: project.adminNotes ?? "",
  });

  const { data: members } = api.project.getMembers.useQuery(project.id);
  const updateProject = api.project.update.useMutation({
    onSuccess: () => {
      toast.success("Project updated successfully");
      onUpdate();
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });
  const deleteProject = api.project.delete.useMutation({
    onSuccess: () => {
      toast.success("Project deleted successfully");
      onDelete();
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });
  const leaveProject = api.project.leave.useMutation({
    onSuccess: () => {
      toast.success("Member removed successfully");
      onUpdate();
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const handleUpdate = () => {
    updateProject.mutate({
      projectId: project.id,
      ...formData,
      teamSize: parseInt(formData.teamSize) || project.teamSize,
      peopleInfluenced: project.peopleInfluenced ?? undefined,
      adminNotes: formData.adminNotes || undefined,
    });
  };

  const handleRemoveMember = (userId: string) => {
    leaveProject.mutate(
      { projectId: project.id, userId },
      {
        onSuccess: () => {
          toast.success("Member removed successfully");
          onUpdate();
        },
      },
    );
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[90vh] max-w-6xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Manage Project: {project.title}
            </DialogTitle>
            <DialogDescription>
              Manage your project settings, team members, and more.
            </DialogDescription>
          </DialogHeader>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="members">Members</TabsTrigger>
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
                    <div className="text-2xl font-bold">
                      {members?.length ?? 0}
                    </div>
                    <p className="text-muted-foreground text-xs">
                      {project.teamSize - (members?.length ?? 0)} spots
                      remaining
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
                    <div className="text-2xl font-bold">
                      {project.voteCount}
                    </div>
                    <p className="text-muted-foreground text-xs">
                      Community support
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Created At
                    </CardTitle>
                    <Calendar className="text-muted-foreground h-4 w-4" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl font-bold">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </div>
                    <p className="text-muted-foreground text-xs">
                      Project start
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Project Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="font-semibold">Description</p>
                      <p className="text-muted-foreground">
                        {project.description}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold">Impact</p>
                      <p className="text-muted-foreground">{project.impact}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Tools</p>
                      <div className="flex flex-wrap gap-2">
                        {(project.requiredTools ?? []).map((tool) => (
                          <Badge key={tool} variant="secondary">
                            {tool}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="members" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  Team Members ({members?.length ?? 0})
                </h3>
              </div>

              <div className="space-y-3">
                {members?.map((member) => (
                  <Card key={member.id}>
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={member.profileImageUrl ?? "/placeholder.svg"}
                            />
                            <AvatarFallback>
                              {member.username?.[0] ?? "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-semibold">
                                {member.username ?? "Unknown"}
                              </p>
                              {member.id === project.creatorId && (
                                <Crown className="h-4 w-4 text-yellow-500" />
                              )}
                            </div>
                            <p className="text-muted-foreground text-sm">
                              Member
                            </p>
                          </div>
                        </div>
                        {member.id !== project.creatorId &&
                          project.isCreator && (
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRemoveMember(member.id)}
                              >
                                <UserMinus className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
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
                      <Input
                        id="project-title"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="project-status">Status</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            status: value as "open" | "ongoing" | "completed",
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="open">Open</SelectItem>
                          <SelectItem value="ongoing">Ongoing</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="project-description">Description</Label>
                    <Textarea
                      id="project-description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="team-size">Team Size</Label>
                      <Input
                        id="team-size"
                        type="number"
                        value={formData.teamSize}
                        onChange={(e) =>
                          setFormData({ ...formData, teamSize: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="visibility">Visibility</Label>
                      <Select
                        value={formData.visibility}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            visibility: value as "public" | "private",
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="private">Private</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="admin-notes">Admin Notes</Label>
                    <Textarea
                      id="admin-notes"
                      value={formData.adminNotes}
                      onChange={(e) =>
                        setFormData({ ...formData, adminNotes: e.target.value })
                      }
                    />
                  </div>

                  <div className="flex justify-between gap-2 pt-4">
                    {project.isCreator && (
                      <Button
                        variant="destructive"
                        onClick={() => setIsDeleteDialogOpen(true)}
                        disabled={deleteProject.isPending}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Project
                      </Button>
                    )}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleUpdate}
                        disabled={updateProject.isPending}
                      >
                        Save Changes
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Project Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{project.title}"? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                deleteProject.mutate({ projectId: project.id });
                setIsDeleteDialogOpen(false);
              }}
              disabled={deleteProject.isPending}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
