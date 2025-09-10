"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Search,
  Heart,
  Users,
  Calendar,
  ExternalLink,
  Plus,
} from "lucide-react";
import Link from "next/link";

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedEffort, setSelectedEffort] = useState("all");

  // Sample projects data - in real app this would come from your database
  const projects = [
    {
      id: "1",
      title: "EcoTrack - Carbon Footprint App",
      description:
        "Building a mobile app to help individuals track and reduce their carbon footprint through gamified daily challenges and community competitions.",
      category: "Environment",
      teamSize: 5,
      effort: "3-6 months",
      likes: 234,
      creator: "Sarah Chen",
      creatorAvatar: "/sarah-avatar.png",
      impact: "Help 10,000+ users reduce their carbon footprint by 30%",
      requiredTools: ["React Native", "Node.js", "MongoDB"],
      peopleInfluenced: 10000,
      typeOfPeople: "Environmentally conscious individuals",
    },
    // Add more projects...
  ];

  const categories = [
    "all",
    "Environment",
    "Education",
    "Community",
    "Technology",
    "Health",
    "Arts",
  ];
  const effortLevels = [
    "all",
    "1-2 months",
    "3-6 months",
    "6-12 months",
    "12+ months",
  ];

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || project.category === selectedCategory;
    const matchesEffort =
      selectedEffort === "all" || project.effort === selectedEffort;

    return matchesSearch && matchesCategory && matchesEffort;
  });

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <header className="border-border bg-card/50 sticky top-0 z-50 border-b backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-foreground text-2xl font-bold">
                All Projects
              </h1>
              <p className="text-muted-foreground">
                Discover amazing projects and join the community
              </p>
            </div>
            <Link href="/signup">
              <Button className="bg-accent hover:bg-accent/90 text-white">
                <Plus className="mr-2 h-4 w-4" />
                Join Platform
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="border-border bg-card/30 border-b backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
              <Input
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedEffort} onValueChange={setSelectedEffort}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Time Commitment" />
              </SelectTrigger>
              <SelectContent>
                {effortLevels.map((effort) => (
                  <SelectItem key={effort} value={effort}>
                    {effort === "all" ? "Any Duration" : effort}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <Link key={project.id} href={`/projects/${project.id}`}>
              <div className="group from-card to-muted/50 border-border/50 hover:border-accent/30 relative cursor-pointer overflow-hidden rounded-2xl border bg-gradient-to-br p-6 transition-all duration-500">
                <div className="from-accent/20 to-secondary/20 absolute top-0 right-0 h-32 w-32 rounded-full bg-gradient-to-br blur-2xl transition-transform duration-700 group-hover:scale-150"></div>

                <div className="relative z-10">
                  <div className="mb-4 flex items-start justify-between">
                    <Badge
                      variant="secondary"
                      className="bg-accent/10 text-accent border-accent/20"
                    >
                      {project.category}
                    </Badge>
                    <div className="text-muted-foreground flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      <span className="text-sm">{project.likes}</span>
                    </div>
                  </div>

                  <h3 className="text-foreground group-hover:text-accent mb-3 text-xl font-bold transition-colors">
                    {project.title}
                  </h3>

                  <p className="text-muted-foreground mb-4 line-clamp-3 text-sm leading-relaxed">
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

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="from-accent to-secondary flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br">
                        <span className="text-xs font-semibold text-white">
                          {project.creator
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <span className="text-foreground text-sm font-medium">
                        {project.creator}
                      </span>
                    </div>
                    <ExternalLink className="text-muted-foreground group-hover:text-accent h-4 w-4 transition-colors" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-muted-foreground mb-4">
              No projects found matching your criteria.
            </p>
            <Button variant="outline">Clear Filters</Button>
          </div>
        )}
      </main>
    </div>
  );
}
