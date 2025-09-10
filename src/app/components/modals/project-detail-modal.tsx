"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Heart,
  Users,
  Calendar,
  Clock,
  Target,
  UserPlus,
  ExternalLink,
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

interface ProjectDetailModalProps {
  project: Project;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onJoin: () => void;
  onLeave: () => void;
  onUpvote: () => void;
}

export function ProjectDetailModal({
  project,
  open,
  onOpenChange,
  onJoin,
  onLeave,
  onUpvote,
}: ProjectDetailModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex gap-2">
                <Badge variant="outline">{project.category}</Badge>
                <Badge
                  variant={
                    project.status === "Active" ? "default" : "secondary"
                  }
                >
                  {project.status}
                </Badge>
                <Badge variant="outline">{project.difficulty}</Badge>
              </div>
              <DialogTitle className="text-2xl">{project.title}</DialogTitle>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Creator Info */}
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={project.creator.avatar || "/placeholder.svg"} />
              <AvatarFallback>{project.creator.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{project.creator.name}</p>
              <p className="text-muted-foreground text-sm">Project Creator</p>
            </div>
          </div>

          {/* Project Stats */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="bg-muted rounded-lg p-3 text-center">
              <div className="text-muted-foreground mb-1 flex items-center justify-center gap-1 text-sm">
                <Users className="h-4 w-4" />
                Members
              </div>
              <div className="font-semibold">
                {project.members}/{project.maxMembers}
              </div>
            </div>
            <div className="bg-muted rounded-lg p-3 text-center">
              <div className="text-muted-foreground mb-1 flex items-center justify-center gap-1 text-sm">
                <Heart className="h-4 w-4" />
                Upvotes
              </div>
              <div className="font-semibold">{project.upvotes}</div>
            </div>
            <div className="bg-muted rounded-lg p-3 text-center">
              <div className="text-muted-foreground mb-1 flex items-center justify-center gap-1 text-sm">
                <Clock className="h-4 w-4" />
                Timeline
              </div>
              <div className="text-sm font-semibold">{project.timeline}</div>
            </div>
            <div className="bg-muted rounded-lg p-3 text-center">
              <div className="text-muted-foreground mb-1 flex items-center justify-center gap-1 text-sm">
                <Calendar className="h-4 w-4" />
                Created
              </div>
              <div className="text-sm font-semibold">
                {new Date(project.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          <Separator />

          {/* Description */}
          <div>
            <h3 className="mb-2 flex items-center gap-2 font-semibold">
              <Target className="h-4 w-4" />
              Project Description
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Requirements */}
          <div>
            <h3 className="mb-2 font-semibold">Requirements & Skills Needed</h3>
            <p className="text-muted-foreground leading-relaxed">
              {project.requirements}
            </p>
          </div>

          {/* Technologies */}
          <div>
            <h3 className="mb-2 font-semibold">Technologies & Tags</h3>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex gap-3">
            {project.isCreator ? (
              <Button className="flex-1" disabled>
                You created this project
              </Button>
            ) : project.isJoined ? (
              <>
                <Button
                  variant="outline"
                  onClick={onLeave}
                  className="flex-1 bg-transparent"
                >
                  Leave Project
                </Button>
                <Button variant="outline">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Workspace
                </Button>
              </>
            ) : (
              <Button
                onClick={onJoin}
                className="flex-1"
                disabled={project.members >= project.maxMembers}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                {project.members >= project.maxMembers
                  ? "Project Full"
                  : "Join Project"}
              </Button>
            )}
            <Button variant="outline" onClick={onUpvote}>
              <Heart className="mr-2 h-4 w-4" />
              Upvote
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
