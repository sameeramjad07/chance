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
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Heart,
  Calendar,
  MapPin,
  LinkIcon,
  Edit,
  Camera,
  Award,
  TrendingUp,
  Users,
  Github,
  Twitter,
  Linkedin,
  Globe,
} from "lucide-react";

// Mock user data
const mockUser = {
  id: 1,
  name: "Sarah Chen",
  username: "sarahchen",
  email: "sarah@example.com",
  bio: "Full-stack developer passionate about creating innovative solutions that make a difference. Love collaborating on projects that push the boundaries of technology.",
  location: "San Francisco, CA",
  website: "https://sarahchen.dev",
  joinDate: "January 2024",
  avatar: "/sarah-avatar.png",
  coverImage: "/user-cover.jpg",
  stats: {
    influence: 2840,
    projects: 12,
    heartbeats: 45,
    followers: 234,
    following: 156,
    completedProjects: 8,
  },
  achievements: [
    {
      id: 1,
      name: "First Project",
      description: "Created your first project",
      icon: "🚀",
      earned: true,
    },
    {
      id: 2,
      name: "Team Player",
      description: "Joined 5 projects",
      icon: "🤝",
      earned: true,
    },
    {
      id: 3,
      name: "Influencer",
      description: "Reached 1000 influence points",
      icon: "⭐",
      earned: true,
    },
    {
      id: 4,
      name: "Heartbeat Hero",
      description: "Posted 50 heartbeats",
      icon: "❤️",
      earned: false,
    },
    {
      id: 5,
      name: "Project Master",
      description: "Completed 10 projects",
      icon: "🏆",
      earned: false,
    },
  ],
  recentProjects: [
    {
      id: 1,
      title: "EcoTrack Mobile App",
      status: "active",
      progress: 75,
      members: 8,
      category: "Mobile Development",
    },
    {
      id: 2,
      title: "AI Writing Assistant",
      status: "completed",
      progress: 100,
      members: 6,
      category: "AI/ML",
    },
    {
      id: 3,
      title: "Community Dashboard",
      status: "active",
      progress: 45,
      members: 12,
      category: "Web Development",
    },
  ],
  recentHeartbeats: [
    {
      id: 1,
      content:
        "Just launched our MVP! The community response has been incredible. Excited to see where this goes! 🚀",
      likes: 234,
      comments: 45,
      timestamp: "2 hours ago",
    },
    {
      id: 2,
      content:
        "Working late nights on the EcoTrack app. The passion for sustainability drives us forward! 🌱",
      likes: 156,
      comments: 23,
      timestamp: "1 day ago",
    },
    {
      id: 3,
      content:
        "Amazing collaboration session with the team today. Love how ideas flow when creative minds meet! ✨",
      likes: 89,
      comments: 12,
      timestamp: "3 days ago",
    },
  ],
};

export function UserProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="bg-background min-h-screen">
      {/* Cover Image & Profile Header */}
      <div className="relative">
        <div className="from-accent/20 via-secondary/20 to-accent/20 relative h-64 overflow-hidden bg-gradient-to-r">
          <div className="from-accent/10 to-secondary/10 animate-gradient absolute inset-0 bg-gradient-to-r"></div>
          <div className="absolute top-4 right-4">
            <Button
              variant="outline"
              size="sm"
              className="border-white/20 bg-white/10 text-white backdrop-blur-sm"
            >
              <Camera className="mr-2 h-4 w-4" />
              Change Cover
            </Button>
          </div>
        </div>

        <div className="relative container mx-auto px-6">
          <div className="relative z-10 -mt-16 flex flex-col items-start gap-6 md:flex-row md:items-end">
            <div className="relative">
              <Avatar className="border-background h-32 w-32 border-4 shadow-xl">
                <AvatarImage src={mockUser.avatar || "/placeholder.svg"} />
                <AvatarFallback className="from-accent to-secondary bg-gradient-to-br text-2xl text-white">
                  {mockUser.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <Button
                size="sm"
                variant="outline"
                className="bg-background absolute right-2 bottom-2 h-8 w-8 rounded-full border-2 p-0"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex-1 pb-6">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                  <h1 className="text-foreground mb-1 text-3xl font-bold">
                    {mockUser.name}
                  </h1>
                  <p className="text-muted-foreground mb-2">
                    @{mockUser.username}
                  </p>
                  <div className="text-muted-foreground flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {mockUser.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Joined {mockUser.joinDate}
                    </div>
                    <div className="flex items-center gap-1">
                      <LinkIcon className="h-4 w-4" />
                      <a
                        href={mockUser.website}
                        className="text-accent hover:underline"
                      >
                        sarahchen.dev
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Button variant="outline">
                    <Users className="mr-2 h-4 w-4" />
                    Follow
                  </Button>
                  <Button onClick={() => setIsEditing(!isEditing)}>
                    <Edit className="mr-2 h-4 w-4" />
                    {isEditing ? "Save Profile" : "Edit Profile"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="border-border bg-card/50 border-b">
        <div className="container mx-auto px-6 py-6">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-6">
            <div className="text-center">
              <div className="text-accent mb-1 text-2xl font-bold">
                {mockUser.stats.influence.toLocaleString()}
              </div>
              <div className="text-muted-foreground text-sm">Influence</div>
            </div>
            <div className="text-center">
              <div className="text-foreground mb-1 text-2xl font-bold">
                {mockUser.stats.projects}
              </div>
              <div className="text-muted-foreground text-sm">Projects</div>
            </div>
            <div className="text-center">
              <div className="text-foreground mb-1 text-2xl font-bold">
                {mockUser.stats.heartbeats}
              </div>
              <div className="text-muted-foreground text-sm">Heartbeats</div>
            </div>
            <div className="text-center">
              <div className="text-foreground mb-1 text-2xl font-bold">
                {mockUser.stats.followers}
              </div>
              <div className="text-muted-foreground text-sm">Followers</div>
            </div>
            <div className="text-center">
              <div className="text-foreground mb-1 text-2xl font-bold">
                {mockUser.stats.following}
              </div>
              <div className="text-muted-foreground text-sm">Following</div>
            </div>
            <div className="text-center">
              <div className="text-secondary mb-1 text-2xl font-bold">
                {mockUser.stats.completedProjects}
              </div>
              <div className="text-muted-foreground text-sm">Completed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8 grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="heartbeats">Heartbeats</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Bio & Info */}
              <div className="space-y-6 lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>About</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      <Textarea
                        defaultValue={mockUser.bio}
                        placeholder="Tell us about yourself..."
                        className="min-h-24"
                      />
                    ) : (
                      <p className="text-muted-foreground leading-relaxed">
                        {mockUser.bio}
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>
                      Your latest heartbeats and project updates
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {mockUser.recentHeartbeats.map((heartbeat) => (
                      <div
                        key={heartbeat.id}
                        className="border-accent/20 border-l-2 py-2 pl-4"
                      >
                        <p className="text-foreground mb-2">
                          {heartbeat.content}
                        </p>
                        <div className="text-muted-foreground flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1">
                            <Heart className="h-4 w-4" />
                            {heartbeat.likes}
                          </span>
                          <span>{heartbeat.comments} comments</span>
                          <span>{heartbeat.timestamp}</span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Quick Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="text-accent h-5 w-5" />
                      Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground text-sm">
                        This Month
                      </span>
                      <Badge variant="secondary">+15% Influence</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground text-sm">
                        Projects Active
                      </span>
                      <span className="font-semibold">4</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground text-sm">
                        Heartbeats
                      </span>
                      <span className="font-semibold">12 this week</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Social Links */}
                <Card>
                  <CardHeader>
                    <CardTitle>Connect</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {isEditing ? (
                      <div className="space-y-3">
                        <Input placeholder="GitHub username" />
                        <Input placeholder="Twitter handle" />
                        <Input placeholder="LinkedIn profile" />
                        <Input placeholder="Personal website" />
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <a
                          href="#"
                          className="text-muted-foreground hover:text-foreground flex items-center gap-3 transition-colors"
                        >
                          <Github className="h-4 w-4" />
                          @sarahchen
                        </a>
                        <a
                          href="#"
                          className="text-muted-foreground hover:text-foreground flex items-center gap-3 transition-colors"
                        >
                          <Twitter className="h-4 w-4" />
                          @sarahchen_dev
                        </a>
                        <a
                          href="#"
                          className="text-muted-foreground hover:text-foreground flex items-center gap-3 transition-colors"
                        >
                          <Linkedin className="h-4 w-4" />
                          Sarah Chen
                        </a>
                        <a
                          href="#"
                          className="text-muted-foreground hover:text-foreground flex items-center gap-3 transition-colors"
                        >
                          <Globe className="h-4 w-4" />
                          sarahchen.dev
                        </a>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {mockUser.recentProjects.map((project) => (
                <Card
                  key={project.id}
                  className="transition-shadow hover:shadow-lg"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          {project.title}
                        </CardTitle>
                        <CardDescription>{project.category}</CardDescription>
                      </div>
                      <Badge
                        variant={
                          project.status === "completed"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {project.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="mb-2 flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{project.progress}%</span>
                        </div>
                        <div className="bg-muted h-2 w-full rounded-full">
                          <div
                            className="bg-accent h-2 rounded-full transition-all"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>
                      <div className="text-muted-foreground flex items-center justify-between text-sm">
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {project.members} members
                        </span>
                        <Button variant="outline" size="sm">
                          View Project
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="heartbeats" className="space-y-6">
            <div className="space-y-4">
              {mockUser.recentHeartbeats.map((heartbeat) => (
                <Card key={heartbeat.id}>
                  <CardContent className="pt-6">
                    <div className="flex gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={mockUser.avatar || "/placeholder.svg"}
                        />
                        <AvatarFallback>SC</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-2">
                          <span className="font-semibold">{mockUser.name}</span>
                          <span className="text-muted-foreground text-sm">
                            {heartbeat.timestamp}
                          </span>
                        </div>
                        <p className="text-foreground mb-3">
                          {heartbeat.content}
                        </p>
                        <div className="text-muted-foreground flex items-center gap-6 text-sm">
                          <button className="hover:text-accent flex items-center gap-1 transition-colors">
                            <Heart className="h-4 w-4" />
                            {heartbeat.likes}
                          </button>
                          <button className="hover:text-accent transition-colors">
                            {heartbeat.comments} comments
                          </button>
                          <button className="hover:text-accent transition-colors">
                            Share
                          </button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {mockUser.achievements.map((achievement) => (
                <Card
                  key={achievement.id}
                  className={`${achievement.earned ? "border-accent/50 bg-accent/5" : "opacity-60"}`}
                >
                  <CardContent className="pt-6 text-center">
                    <div className="mb-3 text-4xl">{achievement.icon}</div>
                    <h3 className="mb-2 text-lg font-semibold">
                      {achievement.name}
                    </h3>
                    <p className="text-muted-foreground mb-4 text-sm">
                      {achievement.description}
                    </p>
                    {achievement.earned ? (
                      <Badge className="bg-accent text-white">
                        <Award className="mr-1 h-3 w-3" />
                        Earned
                      </Badge>
                    ) : (
                      <Badge variant="outline">Locked</Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your personal information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        First Name
                      </label>
                      <Input defaultValue="Sarah" />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        Last Name
                      </label>
                      <Input defaultValue="Chen" />
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Email
                    </label>
                    <Input defaultValue={mockUser.email} />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Username
                    </label>
                    <Input defaultValue={mockUser.username} />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Location
                    </label>
                    <Input defaultValue={mockUser.location} />
                  </div>
                  <Button>Save Changes</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Preferences</CardTitle>
                  <CardDescription>Customize your experience</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-muted-foreground text-sm">
                        Receive updates about your projects
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Enable
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Public Profile</p>
                      <p className="text-muted-foreground text-sm">
                        Make your profile visible to everyone
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Public
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Dark Mode</p>
                      <p className="text-muted-foreground text-sm">
                        Switch to dark theme
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Toggle
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
