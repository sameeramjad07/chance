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
  Calendar,
  Search,
  Eye,
  UserPlus,
  Settings,
} from "lucide-react";
import { ProjectDetailModal } from "../modals/project-detail-modal";
import { ProjectManagementModal } from "../modals/project-management-modal";

// Mock data - replace with your actual data fetching
const mockProjects = [
  {
    id: 1,
    title: "AI-Powered Task Manager",
    description:
      "Building an intelligent task management system with natural language processing and smart scheduling.",
    category: "AI/ML",
    creator: {
      name: "Sarah Chen",
      avatar: "/sarah-avatar.png",
      id: "sarah123",
    },
    members: 12,
    maxMembers: 15,
    upvotes: 45,
    createdAt: "2024-01-15",
    status: "Active",
    tags: ["React", "Python", "OpenAI"],
    difficulty: "Intermediate",
    timeline: "2-3 months",
    requirements:
      "Experience with React, Python, and API integrations. Knowledge of AI/ML concepts preferred.",
    isJoined: false,
    isCreator: false,
  },
  {
    id: 2,
    title: "Sustainable Fashion Marketplace",
    description:
      "Creating a platform to connect eco-conscious consumers with sustainable fashion brands.",
    category: "E-commerce",
    creator: {
      name: "Alex Rodriguez",
      avatar: "/alex-avatar.png",
      id: "alex456",
    },
    members: 8,
    maxMembers: 12,
    upvotes: 32,
    createdAt: "2024-01-20",
    status: "Recruiting",
    tags: ["Next.js", "Stripe", "Sustainability"],
    difficulty: "Advanced",
    timeline: "3-6 months",
    requirements:
      "Full-stack development experience, e-commerce knowledge, passion for sustainability.",
    isJoined: true,
    isCreator: false,
  },
  {
    id: 3,
    title: "Community Garden Network",
    description:
      "Building a network to help communities start and manage local garden projects.",
    category: "Social Impact",
    creator: { name: "Maya Patel", avatar: "/maya-avatar.jpg", id: "maya789" },
    members: 15,
    maxMembers: 20,
    upvotes: 67,
    createdAt: "2024-01-10",
    status: "Active",
    tags: ["Vue.js", "Maps API", "Community"],
    difficulty: "Beginner",
    timeline: "1-2 months",
    requirements:
      "Basic web development skills, interest in community building and environmental impact.",
    isJoined: false,
    isCreator: true,
  },
];

export function ProjectsTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [selectedProject, setSelectedProject] = useState<
    (typeof mockProjects)[0] | null
  >(null);
  const [managementProject, setManagementProject] = useState<
    (typeof mockProjects)[0] | null
  >(null);

  const filteredProjects = mockProjects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    const matchesCategory =
      selectedCategory === "all" || project.category === selectedCategory;
    const matchesDifficulty =
      selectedDifficulty === "all" || project.difficulty === selectedDifficulty;
    const matchesStatus =
      selectedStatus === "all" || project.status === selectedStatus;

    return (
      matchesSearch && matchesCategory && matchesDifficulty && matchesStatus
    );
  });

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    switch (sortBy) {
      case "popular":
        return b.upvotes - a.upvotes;
      case "members":
        return b.members - a.members;
      case "recent":
      default:
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
  });

  const handleJoinProject = (projectId: number) => {
    // Handle project joining logic here
    console.log("Joining project:", projectId);
  };

  const handleLeaveProject = (projectId: number) => {
    // Handle project leaving logic here
    console.log("Leaving project:", projectId);
  };

  const handleUpvoteProject = (projectId: number) => {
    // Handle project upvoting logic here
    console.log("Upvoting project:", projectId);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
          <Input
            placeholder="Search projects, technologies, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filters */}
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
                <SelectItem value="AI/ML">AI/ML</SelectItem>
                <SelectItem value="E-commerce">E-commerce</SelectItem>
                <SelectItem value="Social Impact">Social Impact</SelectItem>
                <SelectItem value="Web3">Web3</SelectItem>
                <SelectItem value="Mobile">Mobile</SelectItem>
                <SelectItem value="Design">Design</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={selectedDifficulty}
              onValueChange={setSelectedDifficulty}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Recruiting">Recruiting</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="members">Most Members</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results count */}
        <div className="text-muted-foreground text-sm">
          Showing {sortedProjects.length} of {mockProjects.length} projects
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sortedProjects.map((project) => (
          <Card key={project.id} className="transition-shadow hover:shadow-lg">
            <CardHeader>
              <div className="flex items-start justify-between">
                <Badge variant="outline" className="mb-2">
                  {project.category}
                </Badge>
                <div className="flex gap-1">
                  <Badge
                    variant={
                      project.status === "Active" ? "default" : "secondary"
                    }
                    className="text-xs"
                  >
                    {project.status}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {project.difficulty}
                  </Badge>
                </div>
              </div>
              <CardTitle className="text-lg">{project.title}</CardTitle>
              <CardDescription className="line-clamp-2 text-sm">
                {project.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Creator */}
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage
                      src={project.creator.avatar || "/placeholder.svg"}
                    />
                    <AvatarFallback>{project.creator.name[0]}</AvatarFallback>
                  </Avatar>
                  <span className="text-muted-foreground text-sm">
                    by {project.creator.name}
                  </span>
                  {project.isCreator && (
                    <Badge variant="secondary" className="text-xs">
                      Creator
                    </Badge>
                  )}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {project.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {project.tags.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{project.tags.length - 3}
                    </Badge>
                  )}
                </div>

                <div className="text-muted-foreground flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {project.members}/{project.maxMembers}
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      {project.upvotes}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {project.timeline}
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
                  ) : project.isJoined ? (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 bg-transparent"
                        onClick={() => handleLeaveProject(project.id)}
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
                        disabled={project.members >= project.maxMembers}
                      >
                        <UserPlus className="mr-2 h-4 w-4" />
                        {project.members >= project.maxMembers
                          ? "Full"
                          : "Join"}
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
      </div>

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
        />
      )}
    </div>
  );
}
