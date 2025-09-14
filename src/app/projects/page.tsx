"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import type { Project } from "../components/modals/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Users,
  Calendar,
  Heart,
  Rocket,
  Loader2,
  AlertCircle,
  ArrowLeft,
  Users2,
} from "lucide-react";
import Link from "next/link";

export default function ProjectsPage() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Fetch projects
  const {
    data: projectsData,
    isLoading,
    error,
  } = api.project.getAll.useQuery({
    limit: 20,
    sort: "newest",
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="text-accent h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <AlertCircle className="text-destructive mx-auto h-12 w-12" />
          <p className="text-foreground mt-4 text-lg">{error.message}</p>
          <Link href="/">
            <Button
              variant="outline"
              className="border-accent/30 text-accent hover:bg-accent/5 mt-4"
            >
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const projects = projectsData?.projects ?? [];

  return (
    <div className="bg-background min-h-screen px-4 py-16 sm:px-6 sm:py-24">
      {/* Back to Home button */}
      <div className="mb-4 flex items-center justify-center sm:mb-0 sm:justify-start">
        <Link href="/">
          <Button className="bg-blue-600 text-white hover:bg-blue-700">
            <ArrowLeft />
            Back to Home
          </Button>
        </Link>
      </div>
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12 text-center sm:mb-20">
          <Badge
            variant="outline"
            className="border-accent/30 text-accent mb-4 sm:mb-6"
          >
            <Rocket className="mr-2 h-4 w-4" />
            All Projects
          </Badge>
          <h2 className="text-foreground mb-4 text-3xl font-bold text-balance sm:mb-6 sm:text-5xl md:text-6xl">
            Explore Amazing <span className="text-gradient">Projects</span>
          </h2>
          <p className="text-muted-foreground mx-auto max-w-3xl text-lg leading-relaxed sm:text-xl">
            Discover innovative projects that are making a real impact. Join
            passionate creators and contribute to something extraordinary.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="mb-12 grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group from-card to-muted/50 border-border/50 hover:border-accent/30 relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border bg-gradient-to-br p-6 transition-all duration-500 sm:rounded-3xl sm:p-8"
              onClick={() => setSelectedProject(project)}
            >
              <div className="from-accent/20 to-secondary/20 absolute top-0 right-0 h-20 w-20 rounded-full bg-gradient-to-br blur-2xl transition-transform duration-700 group-hover:scale-150 sm:h-32 sm:w-32"></div>
              <div className="relative z-10 flex h-full flex-col">
                <div className="mb-4 flex items-start justify-between">
                  <Badge
                    variant="secondary"
                    className="bg-accent/10 text-accent border-accent/20 text-xs"
                  >
                    {project.category}
                  </Badge>
                  <div className="text-muted-foreground flex items-center gap-1">
                    <Heart className="h-4 w-4" />
                    <span className="text-sm">{project.voteCount}</span>
                  </div>
                </div>

                <h3 className="text-foreground group-hover:text-accent mb-3 text-xl font-bold transition-colors sm:text-2xl">
                  {project.title}
                </h3>
                <p className="text-muted-foreground mb-4 line-clamp-3 text-sm leading-relaxed sm:text-base">
                  {project.description}
                </p>

                <div className="mb-6 space-y-2">
                  <div className="text-muted-foreground flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4" />
                    <span>Team of {project.teamSize}</span>
                  </div>
                  <div className="text-muted-foreground flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4" />
                    <span>{project.effort}</span>
                  </div>
                </div>

                {/* Footer pinned at bottom */}
                <div className="border-border/40 mt-auto flex items-center justify-between border-t pt-4">
                  <div className="flex items-center gap-2">
                    {project.creator?.profileImageUrl ? (
                      <img
                        src={project.creator.profileImageUrl}
                        alt={project.creator.username ?? "Creator"}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="from-accent to-secondary flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br">
                        <span className="text-xs font-semibold text-white">
                          {(project.creator?.username ?? "C")
                            .slice(0, 2)
                            .toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-accent/30 text-accent hover:bg-accent/5 bg-background"
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dialog for Project Details */}
        <Dialog
          open={!!selectedProject}
          onOpenChange={() => setSelectedProject(null)}
        >
          <DialogContent className="bg-card max-w-3xl rounded-2xl p-6 shadow-xl sm:rounded-3xl sm:p-8">
            {selectedProject && (
              <div className="relative">
                <DialogHeader>
                  <DialogTitle className="text-foreground text-2xl sm:text-3xl">
                    {selectedProject.title}
                  </DialogTitle>
                  <DialogDescription className="text-muted-foreground text-base">
                    {selectedProject.description}
                  </DialogDescription>
                </DialogHeader>
                <div className="mt-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className="bg-accent/10 text-accent border-accent/20"
                    >
                      {selectedProject.category}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="border-accent/30 text-accent"
                    >
                      {selectedProject.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedProject.creator?.profileImageUrl ? (
                      <img
                        src={selectedProject.creator.profileImageUrl}
                        alt={selectedProject.creator.username ?? "Creator"}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="from-accent to-secondary flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br">
                        <span className="text-sm font-semibold text-white">
                          {(selectedProject.creator?.username ?? "C")
                            .slice(0, 2)
                            .toUpperCase()}
                        </span>
                      </div>
                    )}
                    <span className="text-foreground font-semibold">
                      {selectedProject.creator?.username ?? "Anonymous"}
                    </span>
                  </div>
                  <div className="text-muted-foreground space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>Team of {selectedProject.teamSize}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Effort: {selectedProject.effort}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4" />
                      <span>{selectedProject.voteCount} votes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Rocket className="h-4 w-4" />
                      <span>Impact: {selectedProject.impact}</span>
                    </div>
                    {selectedProject.peopleInfluenced && (
                      <div className="flex items-center gap-2">
                        <Users2 className="h-4 w-4" />
                        <span>
                          People Influenced: {selectedProject.peopleInfluenced}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Created:{" "}
                        {new Date(selectedProject.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
