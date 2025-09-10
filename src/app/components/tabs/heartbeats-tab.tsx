"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Heart,
  MessageCircle,
  Share,
  MoreHorizontal,
  Search,
  ImageIcon,
  Video,
  Bookmark,
  Flag,
  Edit,
  Trash2,
  Send,
  TrendingUp,
  Clock,
  Users,
} from "lucide-react";
import { CreateHeartbeatModal } from "../modals/create-heartbeat-modal";
import { CommentsModal } from "../modals/comments-modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock data - replace with your actual data fetching
const mockHeartbeats = [
  {
    id: 1,
    user: {
      name: "Sarah Chen",
      avatar: "/sarah-avatar.png",
      username: "@sarahc",
      id: "sarah123",
    },
    content:
      "Just shipped the first version of our AI task manager! The natural language processing is working better than expected. Can't wait to get feedback from the community! #AI #TaskManagement #Launch",
    images: ["/ai-dashboard-screenshot.jpg"],
    video: null,
    timestamp: "2 hours ago",
    likes: 24,
    comments: 8,
    shares: 3,
    saves: 12,
    isLiked: false,
    isSaved: false,
    isOwner: false,
    hashtags: ["AI", "TaskManagement", "Launch"],
    mentions: [],
    projectId: 1,
    projectTitle: "AI-Powered Task Manager",
  },
  {
    id: 2,
    user: {
      name: "Alex Rodriguez",
      avatar: "/alex-avatar.png",
      username: "@alexr",
      id: "alex456",
    },
    content:
      "Working late on the sustainable fashion marketplace. The vendor onboarding flow is coming together nicely. Here's a sneak peek at the new design system we're building. @mayap thanks for the design feedback! #SustainableFashion #Design",
    images: ["/fashion-marketplace-design.jpg"],
    video: null,
    timestamp: "4 hours ago",
    likes: 18,
    comments: 5,
    shares: 2,
    saves: 8,
    isLiked: true,
    isSaved: false,
    isOwner: false,
    hashtags: ["SustainableFashion", "Design"],
    mentions: ["@mayap"],
    projectId: 2,
    projectTitle: "Sustainable Fashion Marketplace",
  },
  {
    id: 3,
    user: {
      name: "Maya Patel",
      avatar: "/maya-avatar.jpg",
      username: "@mayap",
      id: "maya789",
    },
    content:
      "Amazing progress on the Community Garden Network! We now have 50+ gardens registered and the mapping feature is live. The community response has been incredible. #CommunityGarden #SocialImpact #Milestone",
    images: [],
    video: null,
    timestamp: "1 day ago",
    likes: 42,
    comments: 12,
    shares: 8,
    saves: 15,
    isLiked: false,
    isSaved: true,
    isOwner: true,
    hashtags: ["CommunityGarden", "SocialImpact", "Milestone"],
    mentions: [],
    projectId: 3,
    projectTitle: "Community Garden Network",
  },
];

export function HeartbeatsTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [feedFilter, setFeedFilter] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedHeartbeat, setSelectedHeartbeat] = useState<
    (typeof mockHeartbeats)[0] | null
  >(null);
  const [showComments, setShowComments] = useState(false);
  const [quickPostContent, setQuickPostContent] = useState("");

  const filteredHeartbeats = mockHeartbeats.filter((heartbeat) => {
    const matchesSearch =
      heartbeat.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      heartbeat.hashtags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      ) ||
      heartbeat.user.name.toLowerCase().includes(searchQuery.toLowerCase());

    switch (feedFilter) {
      case "trending":
        return matchesSearch && heartbeat.likes > 20;
      case "following":
        return matchesSearch && heartbeat.user.id !== "current-user"; // Mock following logic
      case "projects":
        return matchesSearch && heartbeat.projectId;
      default:
        return matchesSearch;
    }
  });

  const handleLike = (heartbeatId: number) => {
    console.log("Liking heartbeat:", heartbeatId);
  };

  const handleSave = (heartbeatId: number) => {
    console.log("Saving heartbeat:", heartbeatId);
  };

  const handleShare = (heartbeatId: number) => {
    console.log("Sharing heartbeat:", heartbeatId);
  };

  const handleQuickPost = () => {
    if (quickPostContent.trim()) {
      console.log("Creating quick post:", quickPostContent);
      setQuickPostContent("");
    }
  };

  const openComments = (heartbeat: (typeof mockHeartbeats)[0]) => {
    setSelectedHeartbeat(heartbeat);
    setShowComments(true);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Search and Filter Bar */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
          <Input
            placeholder="Search heartbeats, hashtags, or users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Select value={feedFilter} onValueChange={setFeedFilter}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    All Posts
                  </div>
                </SelectItem>
                <SelectItem value="trending">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Trending
                  </div>
                </SelectItem>
                <SelectItem value="following">
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4" />
                    Following
                  </div>
                </SelectItem>
                <SelectItem value="projects">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Projects
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={() => setShowCreateModal(true)} size="sm">
            Create Post
          </Button>
        </div>
      </div>

      {/* Quick Post */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src="/diverse-user-avatars.png" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-3">
              <Textarea
                placeholder="Share your progress, celebrate wins, or ask for help..."
                value={quickPostContent}
                onChange={(e) => setQuickPostContent(e.target.value)}
                className="min-h-[80px] resize-none"
              />
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <ImageIcon className="mr-2 h-4 w-4" />
                    Photo
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Video className="mr-2 h-4 w-4" />
                    Video
                  </Button>
                </div>
                <Button
                  size="sm"
                  onClick={handleQuickPost}
                  disabled={!quickPostContent.trim()}
                >
                  <Send className="mr-2 h-4 w-4" />
                  Post
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Heartbeats Feed */}
      {filteredHeartbeats.map((heartbeat) => (
        <Card key={heartbeat.id} className="transition-shadow hover:shadow-md">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={heartbeat.user.avatar || "/placeholder.svg"}
                  />
                  <AvatarFallback>{heartbeat.user.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold">
                      {heartbeat.user.name}
                    </p>
                    {heartbeat.projectId && (
                      <Badge variant="outline" className="text-xs">
                        {heartbeat.projectTitle}
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground text-xs">
                    {heartbeat.user.username} • {heartbeat.timestamp}
                  </p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {heartbeat.isOwner ? (
                    <>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Post
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Post
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem
                        onClick={() => handleSave(heartbeat.id)}
                      >
                        <Bookmark className="mr-2 h-4 w-4" />
                        {heartbeat.isSaved ? "Unsave" : "Save Post"}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        <Flag className="mr-2 h-4 w-4" />
                        Report Post
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {/* Content with hashtags and mentions highlighted */}
              <div className="text-sm leading-relaxed">
                {heartbeat.content.split(/(\s+)/).map((word, index) => {
                  if (word.startsWith("#")) {
                    return (
                      <span
                        key={index}
                        className="text-primary cursor-pointer font-medium hover:underline"
                      >
                        {word}
                      </span>
                    );
                  } else if (word.startsWith("@")) {
                    return (
                      <span
                        key={index}
                        className="text-accent cursor-pointer font-medium hover:underline"
                      >
                        {word}
                      </span>
                    );
                  }
                  return word;
                })}
              </div>

              {/* Images */}
              {heartbeat.images && heartbeat.images.length > 0 && (
                <div className="overflow-hidden rounded-lg">
                  {heartbeat.images.length === 1 ? (
                    <img
                      src={heartbeat.images[0] || "/placeholder.svg"}
                      alt="Heartbeat content"
                      className="h-auto max-h-96 w-full cursor-pointer object-cover transition-opacity hover:opacity-95"
                    />
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      {heartbeat.images.slice(0, 4).map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={image || "/placeholder.svg"}
                            alt={`Heartbeat content ${index + 1}`}
                            className="h-32 w-full cursor-pointer object-cover transition-opacity hover:opacity-95"
                          />
                          {index === 3 && heartbeat.images.length > 4 && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50 font-semibold text-white">
                              +{heartbeat.images.length - 4}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Hashtags */}
              {heartbeat.hashtags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {heartbeat.hashtags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="hover:bg-secondary/80 cursor-pointer text-xs"
                    >
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Engagement Stats */}
              <div className="text-muted-foreground flex items-center justify-between pt-2 text-sm">
                <div className="flex items-center gap-4">
                  <span>{heartbeat.likes} likes</span>
                  <span>{heartbeat.comments} comments</span>
                  <span>{heartbeat.shares} shares</span>
                </div>
                <span>{heartbeat.saves} saves</span>
              </div>

              {/* Actions */}
              <div className="border-border flex items-center justify-between border-t pt-2">
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`gap-2 ${heartbeat.isLiked ? "text-red-500" : ""}`}
                    onClick={() => handleLike(heartbeat.id)}
                  >
                    <Heart
                      className={`h-4 w-4 ${heartbeat.isLiked ? "fill-current" : ""}`}
                    />
                    Like
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2"
                    onClick={() => openComments(heartbeat)}
                  >
                    <MessageCircle className="h-4 w-4" />
                    Comment
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2"
                    onClick={() => handleShare(heartbeat.id)}
                  >
                    <Share className="h-4 w-4" />
                    Share
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`gap-2 ${heartbeat.isSaved ? "text-primary" : ""}`}
                  onClick={() => handleSave(heartbeat.id)}
                >
                  <Bookmark
                    className={`h-4 w-4 ${heartbeat.isSaved ? "fill-current" : ""}`}
                  />
                  {heartbeat.isSaved ? "Saved" : "Save"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Load More */}
      <div className="text-center">
        <Button variant="outline">Load More Heartbeats</Button>
      </div>

      {/* Modals */}
      <CreateHeartbeatModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
      />

      {selectedHeartbeat && (
        <CommentsModal
          heartbeat={selectedHeartbeat}
          open={showComments}
          onOpenChange={setShowComments}
        />
      )}
    </div>
  );
}
