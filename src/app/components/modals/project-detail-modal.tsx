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
import { api } from "@/trpc/react";

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
  isMember?: boolean;
  isCreator?: boolean;
};

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
  const { data: members } = api.project.getMembers.useQuery(project.id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex gap-2">
                <Badge variant="outline">{project.category}</Badge>
                <Badge
                  variant={project.status === "open" ? "default" : "secondary"}
                >
                  {project.status}
                </Badge>
                <Badge variant="outline">{project.effort}</Badge>
              </div>
              <DialogTitle className="text-2xl">{project.title}</DialogTitle>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={project.creator.profileImageUrl ?? "/placeholder.svg"}
              />
              <AvatarFallback>
                {project.creator.username?.[0] ?? "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">
                {project.creator.username ?? "Unknown"}
              </p>
              <p className="text-muted-foreground text-sm">Project Creator</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="bg-muted rounded-lg p-3 text-center">
              <div className="text-muted-foreground mb-1 flex items-center justify-center gap-1 text-sm">
                <Users className="h-4 w-4" />
                Members
              </div>
              <div className="font-semibold">
                {members?.length ?? 0}/{project.teamSize}
              </div>
            </div>
            <div className="bg-muted rounded-lg p-3 text-center">
              <div className="text-muted-foreground mb-1 flex items-center justify-center gap-1 text-sm">
                <Heart className="h-4 w-4" />
                Upvotes
              </div>
              <div className="font-semibold">{project.voteCount}</div>
            </div>
            <div className="bg-muted rounded-lg p-3 text-center">
              <div className="text-muted-foreground mb-1 flex items-center justify-center gap-1 text-sm">
                <Clock className="h-4 w-4" />
                Effort
              </div>
              <div className="text-sm font-semibold">{project.effort}</div>
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

          <div>
            <h3 className="mb-2 flex items-center gap-2 font-semibold">
              <Target className="h-4 w-4" />
              Project Description
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {project.description}
            </p>
          </div>

          <div>
            <h3 className="mb-2 font-semibold">Impact</h3>
            <p className="text-muted-foreground leading-relaxed">
              {project.impact}
            </p>
          </div>

          <div>
            <h3 className="mb-2 font-semibold">Technologies & Tools</h3>
            <div className="flex flex-wrap gap-2">
              {(project.requiredTools ?? []).map((tool) => (
                <Badge key={tool} variant="secondary">
                  {tool}
                </Badge>
              ))}
            </div>
          </div>

          {project.actionPlan && project.actionPlan.length > 0 && (
            <div>
              <h3 className="mb-2 font-semibold">Action Plan</h3>
              <ul className="text-muted-foreground list-disc pl-5">
                {project.actionPlan.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ul>
            </div>
          )}

          <Separator />

          <div className="flex gap-3">
            {project.isCreator ? (
              <Button className="flex-1" disabled>
                You created this project
              </Button>
            ) : project.isMember ? (
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
                disabled={project.status !== "open"}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                {project.status !== "open" ? "Closed" : "Join Project"}
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
