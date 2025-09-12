"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { api } from "@/trpc/react";
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
  Trash2,
  Send,
  TrendingUp,
  Clock,
  Users,
} from "lucide-react";
import { CreateHeartbeatModal } from "@/app/components/modals/create-heartbeat-modal";
import { CommentsModal } from "@/app/components/modals/comments-modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import Error from "next/error";

export function HeartbeatsTab() {
  const { data: session } = useSession();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [feedFilter, setFeedFilter] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedHeartbeat, setSelectedHeartbeat] = useState<any | null>(null);
  const [showComments, setShowComments] = useState(false);
  const [quickPostContent, setQuickPostContent] = useState("");

  const { data, fetchNextPage, hasNextPage, isFetching } =
    api.heartbeat.getAll.useInfiniteQuery(
      { limit: 20 },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    );

  const heartbeats = data?.pages.flatMap((page) => page.heartbeats) || [];

  const likeMutation = api.heartbeat.like.useMutation({
    onSuccess: () => {
      api.heartbeat.getAll.invalidate();
    },
    onError: (error: Error) => {
      toast("Error");
    },
  });

  const deleteMutation = api.heartbeat.delete.useMutation({
    onSuccess: () => {
      toast("Success! Post deleted successfully");
      api.heartbeat.getAll.invalidate();
    },
    onError: (error: Error) => {
      toast("Error");
    },
  });

  const shareMutation = api.heartbeat.share.useMutation({
    onSuccess: ({ shareUrl }, { shareType }) => {
      if (shareType === "copy") {
        navigator.clipboard.write(shareUrl);
        toast("Link copied");
      } else {
        const shareUrls = {
          instagram: `https://www.instagram.com/?url=${encodeURIComponent(shareUrl)}`,
          facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
          whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareUrl)}`,
        };
        window.open(shareUrls[shareType], "_blank");
      }
    },
    onError: (error: Error) => {
      toast("Error");
    },
  });

  const filteredHeartbeats = heartbeats.filter((heartbeat) => {
    const matchesSearch =
      heartbeat.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (heartbeat.user.username &&
        heartbeat.user.username
          .toLowerCase()
          .includes(searchQuery.toLowerCase()));

    switch (feedFilter) {
      case "trending":
        return matchesSearch && heartbeat.likeCount > 20;
      case "following":
        return matchesSearch; // Add following logic if implemented
      case "projects":
        return matchesSearch; // Add project-related logic if implemented
      default:
        return matchesSearch;
    }
  });

  const handleLike = (heartbeatId: string) => {
    if (!session) {
      toast("You need to be signed in to like posts");
      return;
    }
    likeMutation.mutate(heartbeatId);
  };

  const handleShare = (
    heartbeatId: string,
    shareType: "instagram" | "facebook" | "whatsapp" | "copy",
  ) => {
    if (!session) {
      toast("You need to be signed in to share posts");
      return;
    }
    shareMutation.mutate({ heartbeatId, shareType });
  };

  const handleDelete = (heartbeatId: string) => {
    if (!session) {
      toast("You need to be signed in to delete posts");
      return;
    }
    deleteMutation.mutate(heartbeatId);
  };

  const handleQuickPost = () => {
    if (quickPostContent.trim()) {
      setShowCreateModal(true);
      // Quick post will be handled in CreateHeartbeatModal
    }
  };

  const openComments = (heartbeat: any) => {
    setSelectedHeartbeat(heartbeat);
    setShowComments(true);
  };

  const extractHashtags = (content: string) => {
    return content.match(/#[^\s#]+/g) || [];
  };

  const extractMentions = (content: string) => {
    return content.match(/@[^\s@]+/g) || [];
  };

  return (
    <div className="space-y-4 px-4 md:space-y-6 md:px-0">
      {/* Search and Filter Bar */}
      <div className="space-y-3 md:space-y-4">
        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
          <Input
            placeholder="Search heartbeats, hashtags, or users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 pl-10 md:h-9"
          />
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex gap-2">
            <Select value={feedFilter} onValueChange={setFeedFilter}>
              <SelectTrigger className="h-10 flex-1 md:h-9 md:w-[140px]">
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
          <Button
            onClick={() => {
              if (!session) {
                toast("You need to be signed in to create posts");
                return;
              }
              setShowCreateModal(true);
            }}
            size="sm"
            className="h-10 w-full md:h-9 md:w-auto"
          >
            Create Post
          </Button>
        </div>
      </div>

      {/* Quick Post */}
      <Card>
        <CardContent className="px-4 pt-4 md:px-6 md:pt-6">
          <div className="flex gap-3">
            <Avatar className="h-8 w-8 flex-shrink-0 md:h-10 md:w-10">
              <AvatarImage src={session?.user.image ?? "/placeholder.svg"} />
              <AvatarFallback>{session?.user.name?.[0] ?? "U"}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-3">
              <Textarea
                placeholder="Share your progress, celebrate wins, or ask for help..."
                value={quickPostContent}
                onChange={(e) => setQuickPostContent(e.target.value)}
                className="min-h-[80px] resize-none text-sm md:text-base"
              />
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 flex-1 md:flex-none"
                    onClick={() => setShowCreateModal(true)}
                  >
                    <ImageIcon className="mr-2 h-4 w-4" />
                    Photo
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 flex-1 md:flex-none"
                    onClick={() => setShowCreateModal(true)}
                  >
                    <Video className="mr-2 h-4 w-4" />
                    Video
                  </Button>
                </div>
                <Button
                  size="sm"
                  onClick={handleQuickPost}
                  disabled={!quickPostContent.trim() || !session}
                  className="h-9 w-full md:w-auto"
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
      {filteredHeartbeats.map((heartbeat) => {
        const isOwner = session?.user.id === heartbeat.userId;
        const isLiked = heartbeatLikes.some(
          (like) =>
            like.heartbeatId === heartbeat.id &&
            like.userId === session?.user.id,
        );

        return (
          <Card
            key={heartbeat.id}
            className="transition-shadow hover:shadow-md"
          >
            <CardHeader className="px-4 pb-3 md:px-6">
              <div className="flex items-center justify-between">
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <Avatar className="h-8 w-8 flex-shrink-0 md:h-10 md:w-10">
                    <AvatarImage
                      src={heartbeat.user.profileImageUrl ?? "/placeholder.svg"}
                    />
                    <AvatarFallback>
                      {heartbeat.user.name?.[0] ?? "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-sm font-semibold md:text-base">
                        {heartbeat.user.name}
                      </p>
                    </div>
                    <p className="text-muted-foreground truncate text-xs md:text-sm">
                      {heartbeat.user.username} •{" "}
                      {new Date(heartbeat.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 flex-shrink-0 p-0"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {isOwner ? (
                      <>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDelete(heartbeat.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Post
                        </DropdownMenuItem>
                      </>
                    ) : (
                      <>
                        <DropdownMenuItem>
                          <Flag className="mr-2 h-4 w-4" />
                          Report Post
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="px-4 pt-0 md:px-6">
              <div className="space-y-3">
                {/* Content with hashtags and mentions highlighted */}
                <div className="text-sm leading-relaxed md:text-base">
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

                {/* Media */}
                {heartbeat.imageUrl && (
                  <div className="overflow-hidden rounded-lg">
                    <img
                      src={heartbeat.imageUrl}
                      alt="Heartbeat content"
                      className="h-auto max-h-80 w-full cursor-pointer object-cover transition-opacity hover:opacity-95 md:max-h-96"
                    />
                  </div>
                )}

                {/* Hashtags */}
                {extractHashtags(heartbeat.content).length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {extractHashtags(heartbeat.content).map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="hover:bg-secondary/80 cursor-pointer text-xs"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Engagement Stats */}
                <div className="text-muted-foreground flex items-center justify-between pt-2 text-xs md:text-sm">
                  <div className="flex items-center gap-3 md:gap-4">
                    <span>{heartbeat.likeCount} likes</span>
                    <span>{heartbeat.commentCount} comments</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="border-border flex items-center justify-between border-t pt-2">
                  <div className="flex items-center gap-0 md:gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`h-9 gap-1 px-2 text-xs md:gap-2 md:px-3 md:text-sm ${isLiked ? "text-red-500" : ""}`}
                      onClick={() => handleLike(heartbeat.id)}
                    >
                      <Heart
                        className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`}
                      />
                      <span className="hidden md:inline">Like</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-9 gap-1 px-2 text-xs md:gap-2 md:px-3 md:text-sm"
                      onClick={() => openComments(heartbeat)}
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span className="hidden md:inline">Comment</span>
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-9 gap-1 px-2 text-xs md:gap-2 md:px-3 md:text-sm"
                        >
                          <Share className="h-4 w-4" />
                          <span className="hidden md:inline">Share</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() => handleShare(heartbeat.id, "copy")}
                        >
                          Copy Link
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleShare(heartbeat.id, "instagram")}
                        >
                          Share to Instagram
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleShare(heartbeat.id, "facebook")}
                        >
                          Share to Facebook
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleShare(heartbeat.id, "whatsapp")}
                        >
                          Share to WhatsApp
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Load More */}
      {hasNextPage && (
        <div className="text-center">
          <Button
            variant="outline"
            className="w-full bg-transparent md:w-auto"
            onClick={() => fetchNextPage()}
            disabled={isFetching}
          >
            {isFetching ? "Loading..." : "Load More Heartbeats"}
          </Button>
        </div>
      )}

      {/* Modals */}
      <CreateHeartbeatModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        initialContent={quickPostContent}
        onSuccess={() => {
          setQuickPostContent("");
          api.heartbeat.getAll.invalidate();
        }}
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
