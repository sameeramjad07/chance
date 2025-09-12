"use client";

import { useState, useEffect } from "react";
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
import { Heart, Calendar, Edit } from "lucide-react";
import { api } from "@/trpc/react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

export function UserProfile() {
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    bio: "",
    school: "",
    instagram: "",
    whatsappNumber: "",
    profileImageUrl: "",
  });

  const { data: user, isLoading: userLoading } = api.user.getProfile.useQuery(
    undefined,
    {
      enabled: !!session,
    },
  );

  useEffect(() => {
    if (user && !isEditing) {
      setFormData({
        firstName: user.firstName ?? "",
        lastName: user.lastName ?? "",
        username: user.username ?? "",
        bio: user.bio ?? "",
        school: user.school ?? "",
        instagram: user.instagram ?? "",
        whatsappNumber: user.whatsappNumber ?? "",
        profileImageUrl: user.profileImageUrl ?? "",
      });
    }
  }, [user, isEditing]);

  const { data: projects, isLoading: projectsLoading } =
    api.user.getMyProjects.useQuery(undefined, {
      enabled: !!session,
    });

  const { data: heartbeats, isLoading: heartbeatsLoading } =
    api.user.getMyHeartbeats.useQuery(undefined, {
      enabled: !!session,
    });

  const updateProfile = api.user.updateProfile.useMutation({
    onSuccess: () => {
      setIsEditing(false);
      toast("Your profile has been successfully updated.");
    },
    onError: (error) => {
      toast("Error");
    },
  });

  const handleSave = () => {
    updateProfile.mutate(formData);
  };

  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      })
    : "Unknown";

  if (!session) {
    return (
      <div className="container mx-auto px-6 py-8 text-center">
        <p className="text-muted-foreground">
          Please sign in to view your profile.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      {/* Profile Header */}
      <div className="relative">
        <div className="container mx-auto px-6">
          <div className="relative z-10 -mt-16 flex flex-col items-start gap-6 md:flex-row md:items-end">
            <div className="relative">
              <Avatar className="border-background h-32 w-32 border-4 shadow-xl">
                <AvatarImage
                  src={user?.profileImageUrl || "/placeholder.svg"}
                />
                <AvatarFallback className="text-2xl">
                  {(user?.firstName?.[0] ?? "") + (user?.lastName?.[0] ?? "")}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <Input
                  type="text"
                  placeholder="Profile Image URL"
                  value={formData.profileImageUrl}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      profileImageUrl: e.target.value,
                    })
                  }
                  className="mt-2"
                />
              )}
            </div>

            <div className="flex-1 pb-6">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                  <h1 className="text-foreground mb-1 text-3xl font-bold">
                    {userLoading
                      ? "Loading..."
                      : `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() ||
                        "Unknown User"}
                  </h1>
                  <p className="text-muted-foreground mb-2">
                    @{user?.username ?? "unknown"}
                  </p>
                  <div className="text-muted-foreground flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Joined {joinedDate}
                    </div>
                    {user?.school && (
                      <div className="flex items-center gap-1">
                        <span>🏫</span>
                        {user.school}
                      </div>
                    )}
                    {user?.instagram && (
                      <div className="flex items-center gap-1">
                        <span>📸</span>
                        <a
                          href={`https://instagram.com/${user.instagram}`}
                          className="text-accent hover:underline"
                        >
                          {user.instagram}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    onClick={() => {
                      if (!isEditing)
                        setFormData({
                          firstName: user?.firstName ?? "",
                          lastName: user?.lastName ?? "",
                          username: user?.username ?? "",
                          bio: user?.bio ?? "",
                          school: user?.school ?? "",
                          instagram: user?.instagram ?? "",
                          whatsappNumber: user?.whatsappNumber ?? "",
                          profileImageUrl: user?.profileImageUrl ?? "",
                        });
                      setIsEditing(!isEditing);
                    }}
                  >
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
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
            <div className="text-center">
              <div className="text-accent mb-1 text-2xl font-bold">
                {userLoading ? "..." : (user?.influence ?? 0).toLocaleString()}
              </div>
              <div className="text-muted-foreground text-sm">Influence</div>
            </div>
            <div className="text-center">
              <div className="text-foreground mb-1 text-2xl font-bold">
                {projectsLoading ? "..." : (projects?.length ?? 0)}
              </div>
              <div className="text-muted-foreground text-sm">Projects</div>
            </div>
            <div className="text-center">
              <div className="text-foreground mb-1 text-2xl font-bold">
                {heartbeatsLoading ? "..." : (heartbeats?.length ?? 0)}
              </div>
              <div className="text-muted-foreground text-sm">Heartbeats</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8 grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="heartbeats">Heartbeats</TabsTrigger>
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
                        value={formData.bio}
                        onChange={(e) =>
                          setFormData({ ...formData, bio: e.target.value })
                        }
                        placeholder="Tell us about yourself..."
                        className="min-h-24"
                      />
                    ) : (
                      <p className="text-muted-foreground leading-relaxed">
                        {user?.bio || "No bio provided."}
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Recent Heartbeats */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Heartbeats</CardTitle>
                    <CardDescription>
                      Your latest updates and contributions
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {heartbeatsLoading ? (
                      <p className="text-muted-foreground">Loading...</p>
                    ) : heartbeats && heartbeats.length > 0 ? (
                      heartbeats.slice(0, 3).map((heartbeat) => (
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
                            <span>
                              {new Date(heartbeat.createdAt).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground">
                        No heartbeats posted yet.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Info</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {isEditing ? (
                      <div className="space-y-3">
                        <Input
                          placeholder="Instagram handle"
                          value={formData.instagram}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              instagram: e.target.value,
                            })
                          }
                        />
                        <Input
                          placeholder="WhatsApp number"
                          value={formData.whatsappNumber}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              whatsappNumber: e.target.value,
                            })
                          }
                        />
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {user?.instagram && (
                          <a
                            href={`https://instagram.com/${user.instagram}`}
                            className="text-muted-foreground hover:text-foreground flex items-center gap-3 transition-colors"
                          >
                            <span>📸</span>
                            {user.instagram}
                          </a>
                        )}
                        {user?.whatsappNumber && (
                          <div className="text-muted-foreground flex items-center gap-3">
                            <span>📱</span>
                            {user.whatsappNumber}
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projectsLoading ? (
                <p className="text-muted-foreground">Loading...</p>
              ) : projects && projects.length > 0 ? (
                projects.map((project) => (
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
                        <p className="text-muted-foreground text-sm">
                          {project.description}
                        </p>
                        <div className="text-muted-foreground flex items-center justify-between text-sm">
                          <span className="flex items-center gap-1">
                            <span>👥</span>
                            {project.teamSize} members
                          </span>
                          <Button variant="outline" size="sm" disabled>
                            View Project (Coming Soon)
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-muted-foreground">No projects joined yet.</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="heartbeats" className="space-y-6">
            <div className="space-y-4">
              {heartbeatsLoading ? (
                <p className="text-muted-foreground">Loading...</p>
              ) : heartbeats && heartbeats.length > 0 ? (
                heartbeats.map((heartbeat) => (
                  <Card key={heartbeat.id}>
                    <CardContent className="pt-6">
                      <div className="flex gap-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={user?.profileImageUrl || "/placeholder.svg"}
                          />
                          <AvatarFallback>
                            {(user?.firstName?.[0] ?? "") +
                              (user?.lastName?.[0] ?? "")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="mb-2 flex items-center gap-2">
                            <span className="font-semibold">
                              {`${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() ||
                                "Unknown User"}
                            </span>
                            <span className="text-muted-foreground text-sm">
                              {new Date(heartbeat.createdAt).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-foreground mb-3">
                            {heartbeat.content}
                          </p>
                          <div className="text-muted-foreground flex items-center gap-6 text-sm">
                            <span className="flex items-center gap-1">
                              <Heart className="h-4 w-4" />
                              {heartbeat.likes}
                            </span>
                            <span>{heartbeat.comments} comments</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-muted-foreground">
                  No heartbeats posted yet.
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
