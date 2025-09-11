"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Heart,
  Users,
  Search,
  Eye,
  UserPlus,
  Settings,
  Plus,
} from "lucide-react";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { ProjectDetailModal } from "../modals/project-detail-modal";
import { ProjectManagementModal } from "../modals/project-management-modal";
import { useInView } from "react-intersection-observer";

type ProjectStatus = "all" | "open" | "ongoing" | "completed";
type SortOption = "newest" | "upvotes";
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

type ProjectsTabProps = {
  onCreate: () => void; // new prop
};

export function ProjectsTab({ onCreate }: ProjectsTabProps) {
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState<ProjectStatus>("all");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [managementProject, setManagementProject] = useState<Project | null>(
    null,
  );
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const { ref, inView } = useInView();

  const { data, isLoading, isError, error, refetch } =
    api.project.getAll.useQuery({
      category: selectedCategory === "all" ? undefined : selectedCategory,
      status: selectedStatus === "all" ? undefined : selectedStatus,
      sort: sortBy,
      limit: 20,
      cursor,
    });

  const { data: userProjects } = api.project.getUserProjects.useQuery(
    { limit: 100 },
    { enabled: !!session },
  );

  const { data: categories } = api.project.getAll.useQuery(
    { limit: 1 },
    {
      select: (data) =>
        [...new Set(data.projects.map((p) => p.category))].sort(),
    },
  );

  const joinProject = api.project.join.useMutation({
    onSuccess: () => {
      toast.success("Successfully joined project");
      refetch();
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const leaveProject = api.project.leave.useMutation({
    onSuccess: () => {
      toast.success("Successfully left project");
      refetch();
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const upvoteProject = api.project.upvote.useMutation({
    onSuccess: () => {
      toast.success("Successfully upvoted project");
      refetch();
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const handleJoinProject = async (projectId: string) => {
    if (!session) {
      toast.error("Please sign in to join a project");
      return;
    }
    await joinProject.mutateAsync(projectId);
  };

  const handleLeaveProject = async (projectId: string) => {
    if (!session) {
      toast.error("Please sign in to leave a project");
      return;
    }
    await leaveProject.mutateAsync(projectId);
  };

  const handleUpvoteProject = async (projectId: string) => {
    if (!session) {
      toast.error("Please sign in to upvote a project");
      return;
    }
    await upvoteProject.mutateAsync(projectId);
  };

  const enrichedProjects = useCallback(() => {
    if (!data?.projects) return [];
    if (!userProjects?.projects) return data.projects;

    const userProjectMap = new Map(
      userProjects.projects.map((p) => [
        p.id,
        { isMember: p.isMember, isCreator: p.isCreator },
      ]),
    );

    const filtered = data.projects
      .map((project) => ({
        ...project,
        isMember: userProjectMap.get(project.id)?.isMember ?? false,
        isCreator: userProjectMap.get(project.id)?.isCreator ?? false,
      }))
      .filter(
        (project) =>
          project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          (project.requiredTools?.some((tool) =>
            tool.toLowerCase().includes(searchQuery.toLowerCase()),
          ) ??
            false),
      );

    return filtered;
  }, [data, userProjects, searchQuery]);

  useEffect(() => {
    if (data?.projects) {
      setAllProjects(
        (prev) =>
          (cursor
            ? [...prev, ...enrichedProjects()]
            : enrichedProjects()) as Project[],
      );
    }
  }, [data, enrichedProjects, cursor]);

  useEffect(() => {
    if (inView && data?.nextCursor) {
      setCursor(data.nextCursor);
    }
  }, [inView, data?.nextCursor]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Projects</h2>
        {session && (
          <Button onClick={onCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Create Project
          </Button>
        )}
      </div>

      <div className="space-y-4">
        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
          <Input
            placeholder="Search projects, technologies, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex flex-wrap gap-2">
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories?.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedStatus}
              onValueChange={(value) =>
                setSelectedStatus(value as ProjectStatus)
              }
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="ongoing">Ongoing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Select
            value={sortBy}
            onValueChange={(value) => setSortBy(value as SortOption)}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Most Recent</SelectItem>
              <SelectItem value="upvotes">Most Popular</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="text-muted-foreground text-sm">
          {isError ? (
            <div className="text-destructive">Error: {error?.message}</div>
          ) : (
            `Showing ${allProjects.length} projects`
          )}
        </div>
      </div>

      {isLoading && !allProjects.length ? (
        <div>Loading...</div>
      ) : isError ? (
        <div className="text-destructive text-center">
          Failed to load projects. Please try again.
        </div>
      ) : allProjects.length === 0 ? (
        <div className="text-center">No projects found.</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {allProjects.map((project) => (
            <Card
              key={project.id}
              className="transition-shadow hover:shadow-lg"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <Badge variant="outline" className="mb-2">
                    {project.category}
                  </Badge>
                  <Badge
                    variant={
                      project.status === "open" ? "default" : "secondary"
                    }
                    className="text-xs"
                  >
                    {project.status}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{project.title}</CardTitle>
                <CardDescription className="line-clamp-2 text-sm">
                  {project.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage
                        src={
                          project.creator.profileImageUrl ?? "/placeholder.svg"
                        }
                      />
                      <AvatarFallback>
                        {project.creator.username?.[0] ?? "U"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-muted-foreground text-sm">
                      by {project.creator.username ?? "Unknown"}
                    </span>
                    {project.isCreator && (
                      <Badge variant="secondary" className="text-xs">
                        Creator
                      </Badge>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {(project.requiredTools ?? []).slice(0, 3).map((tool) => (
                      <Badge key={tool} variant="secondary" className="text-xs">
                        {tool}
                      </Badge>
                    ))}
                    {(project.requiredTools ?? []).length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{(project.requiredTools ?? []).length - 3}
                      </Badge>
                    )}
                  </div>

                  <div className="text-muted-foreground flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {project.teamSize}
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        {project.voteCount}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      Effort: {project.effort}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    {project.isCreator ? (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 bg-transparent"
                          onClick={() => setManagementProject(project)}
                        >
                          <Settings className="mr-2 h-4 w-4" />
                          Manage
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedProject(project)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </>
                    ) : project.isMember ? (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 bg-transparent"
                          onClick={() => handleLeaveProject(project.id)}
                          disabled={leaveProject.isPending}
                        >
                          Leave Project
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedProject(project)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() => handleJoinProject(project.id)}
                          disabled={
                            joinProject.isPending ?? project.status !== "open"
                          }
                        >
                          <UserPlus className="mr-2 h-4 w-4" />
                          {project.status !== "open" ? "Closed" : "Join"}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedProject(project)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {data?.nextCursor && (
            <div ref={ref} className="text-center">
              Loading more...
            </div>
          )}
        </div>
      )}

      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          open={!!selectedProject}
          onOpenChange={() => setSelectedProject(null)}
          onJoin={() => handleJoinProject(selectedProject.id)}
          onLeave={() => handleLeaveProject(selectedProject.id)}
          onUpvote={() => handleUpvoteProject(selectedProject.id)}
        />
      )}

      {managementProject && (
        <ProjectManagementModal
          project={managementProject}
          open={!!managementProject}
          onOpenChange={() => setManagementProject(null)}
          onUpdate={() => refetch()}
          onDelete={() => refetch()}
        />
      )}
    </div>
  );
}
