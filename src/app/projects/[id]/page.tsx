"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Heart,
  Users,
  Calendar,
  MapPin,
  Plus,
  Share,
  Bookmark,
  Flag,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";

interface ProjectPageProps {
  params: {
    id: string;
  };
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // In real app, fetch project data based on params.id
  const project = {
    id: params.id,
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
    requiredTools: ["React Native", "Node.js", "MongoDB", "Firebase"],
    actionPlan: [
      "Research and design user interface mockups",
      "Develop core tracking algorithms and gamification system",
      "Build backend API and database structure",
      "Implement social features and community challenges",
      "Beta testing with environmental groups",
      "Launch and marketing campaign",
    ],
    collaboration:
      "We're looking for passionate developers, UX designers, and environmental advocates to join our mission. Remote-friendly team with weekly video calls.",
    peopleInfluenced: 10000,
    typeOfPeople:
      "Environmentally conscious individuals, families, and corporate teams",
    status: "open" as const,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-20",
  };

  const teamMembers = [
    { name: "Sarah Chen", role: "Project Lead", avatar: "/sarah-avatar.png" },
    {
      name: "Alex Rodriguez",
      role: "Backend Developer",
      avatar: "/diverse-user-avatars.png",
    },
    {
      name: "Maya Patel",
      role: "UX Designer",
      avatar: "/diverse-user-avatars.png",
    },
  ];

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <header className="border-border bg-card/50 sticky top-0 z-50 border-b backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/projects">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Projects
              </Button>
            </Link>
            <div className="flex-1">
              <div className="mb-1 flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className="bg-accent/10 text-accent border-accent/20"
                >
                  {project.category}
                </Badge>
                <Badge
                  variant={project.status === "open" ? "default" : "secondary"}
                >
                  {project.status === "open"
                    ? "Open for Applications"
                    : "Closed"}
                </Badge>
              </div>
              <h1 className="text-foreground text-2xl font-bold">
                {project.title}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsLiked(!isLiked)}
                className={isLiked ? "border-red-200 text-red-500" : ""}
              >
                <Heart
                  className={`mr-2 h-4 w-4 ${isLiked ? "fill-current" : ""}`}
                />
                {project.likes + (isLiked ? 1 : 0)}
              </Button>
              <Button variant="outline" size="sm">
                <Share className="mr-2 h-4 w-4" />
                Share
              </Button>
              <Link href="/signup">
                <Button className="bg-accent hover:bg-accent/90 text-white">
                  <Plus className="mr-2 h-4 w-4" />
                  Join Project
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-8 lg:col-span-2">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="plan">Action Plan</TabsTrigger>
                <TabsTrigger value="team">Team</TabsTrigger>
                <TabsTrigger value="updates">Updates</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="bg-card rounded-lg border p-6">
                  <h3 className="mb-3 text-lg font-semibold">
                    Project Description
                  </h3>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {project.description}
                  </p>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <h4 className="mb-2 font-medium">Expected Impact</h4>
                      <p className="text-muted-foreground text-sm">
                        {project.impact}
                      </p>
                    </div>
                    <div>
                      <h4 className="mb-2 font-medium">Target Audience</h4>
                      <p className="text-muted-foreground text-sm">
                        {project.typeOfPeople}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-card rounded-lg border p-6">
                  <h3 className="mb-3 text-lg font-semibold">
                    Required Tools & Technologies
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.requiredTools.map((tool, index) => (
                      <Badge key={index} variant="outline">
                        {tool}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="bg-card rounded-lg border p-6">
                  <h3 className="mb-3 text-lg font-semibold">
                    Collaboration Details
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {project.collaboration}
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="plan" className="space-y-4">
                <div className="bg-card rounded-lg border p-6">
                  <h3 className="mb-4 text-lg font-semibold">Action Plan</h3>
                  <div className="space-y-3">
                    {project.actionPlan.map((step, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="bg-accent mt-0.5 flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold text-white">
                          {index + 1}
                        </div>
                        <p className="text-muted-foreground flex-1">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="team" className="space-y-4">
                <div className="bg-card rounded-lg border p-6">
                  <h3 className="mb-4 text-lg font-semibold">
                    Current Team Members
                  </h3>
                  <div className="space-y-4">
                    {teamMembers.map((member, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage
                            src={member.avatar || "/placeholder.svg"}
                          />
                          <AvatarFallback>
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-muted-foreground text-sm">
                            {member.role}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="updates">
                <div className="bg-card rounded-lg border p-6 text-center">
                  <MessageCircle className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                  <h3 className="mb-2 text-lg font-semibold">No Updates Yet</h3>
                  <p className="text-muted-foreground">
                    Project updates and heartbeats will appear here.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-card rounded-lg border p-6">
              <h3 className="mb-4 text-lg font-semibold">Project Details</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="text-muted-foreground h-4 w-4" />
                  <span>Team Size: {project.teamSize} members</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="text-muted-foreground h-4 w-4" />
                  <span>Duration: {project.effort}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="text-muted-foreground h-4 w-4" />
                  <span>
                    People Influenced:{" "}
                    {project.peopleInfluenced?.toLocaleString()}+
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg border p-6">
              <h3 className="mb-4 text-lg font-semibold">Project Creator</h3>
              <div className="mb-4 flex items-center gap-3">
                <Avatar>
                  <AvatarImage
                    src={project.creatorAvatar || "/placeholder.svg"}
                  />
                  <AvatarFallback>
                    {project.creator
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{project.creator}</p>
                  <p className="text-muted-foreground text-sm">Project Lead</p>
                </div>
              </div>
              <Button variant="outline" className="w-full bg-transparent">
                View Profile
              </Button>
            </div>

            <div className="bg-card rounded-lg border p-6">
              <h3 className="mb-4 text-lg font-semibold">Quick Actions</h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                  onClick={() => setIsBookmarked(!isBookmarked)}
                >
                  <Bookmark
                    className={`mr-2 h-4 w-4 ${isBookmarked ? "fill-current" : ""}`}
                  />
                  {isBookmarked ? "Bookmarked" : "Bookmark Project"}
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                >
                  <Flag className="mr-2 h-4 w-4" />
                  Report Project
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
