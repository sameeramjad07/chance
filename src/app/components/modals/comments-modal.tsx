"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Heart, Reply, MoreHorizontal, Send, Flag, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Heartbeat {
  id: number;
  user: { name: string; avatar: string; username: string; id: string };
  content: string;
  images?: string[];
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  isLiked: boolean;
  isSaved: boolean;
  isOwner: boolean;
  hashtags: string[];
  mentions: string[];
  projectId?: number;
  projectTitle?: string;
}

interface Comment {
  id: number;
  user: { name: string; avatar: string; username: string; id: string };
  content: string;
  timestamp: string;
  likes: number;
  replies: Comment[];
  isLiked: boolean;
  isOwner: boolean;
}

interface CommentsModalProps {
  heartbeat: Heartbeat;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Mock comments data
const mockComments: Comment[] = [
  {
    id: 1,
    user: {
      name: "Alice Johnson",
      avatar: "/alice-avatar.jpg",
      username: "@alicej",
      id: "alice123",
    },
    content:
      "This looks amazing! The UI is so clean and intuitive. Can't wait to try it out!",
    timestamp: "1 hour ago",
    likes: 5,
    replies: [
      {
        id: 11,
        user: {
          name: "Sarah Chen",
          avatar: "/sarah-avatar.png",
          username: "@sarahc",
          id: "sarah123",
        },
        content:
          "Thanks Alice! We put a lot of effort into the user experience. Let me know what you think when you try it!",
        timestamp: "45 minutes ago",
        likes: 2,
        replies: [],
        isLiked: false,
        isOwner: true,
      },
    ],
    isLiked: true,
    isOwner: false,
  },
  {
    id: 2,
    user: {
      name: "Bob Smith",
      avatar: "/bob-avatar.jpg",
      username: "@bobsmith",
      id: "bob456",
    },
    content:
      "Great work on the natural language processing! How did you handle the context understanding?",
    timestamp: "2 hours ago",
    likes: 3,
    replies: [],
    isLiked: false,
    isOwner: false,
  },
  {
    id: 3,
    user: {
      name: "Emma Wilson",
      avatar: "/emma-avatar.jpg",
      username: "@emmaw",
      id: "emma789",
    },
    content:
      "This is exactly what I've been looking for! Is there a beta version available?",
    timestamp: "3 hours ago",
    likes: 1,
    replies: [],
    isLiked: false,
    isOwner: false,
  },
];

export function CommentsModal({
  heartbeat,
  open,
  onOpenChange,
}: CommentsModalProps) {
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState("");

  const handleAddComment = () => {
    if (newComment.trim()) {
      console.log("Adding comment:", newComment);
      setNewComment("");
    }
  };

  const handleAddReply = (commentId: number) => {
    if (replyContent.trim()) {
      console.log("Adding reply to comment", commentId, ":", replyContent);
      setReplyContent("");
      setReplyingTo(null);
    }
  };

  const handleLikeComment = (commentId: number) => {
    console.log("Liking comment:", commentId);
  };

  const CommentComponent = ({
    comment,
    isReply = false,
  }: {
    comment: Comment;
    isReply?: boolean;
  }) => (
    <div
      className={`space-y-3 ${isReply ? "border-muted ml-8 border-l-2 pl-4" : ""}`}
    >
      <div className="flex gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={comment.user.avatar || "/placeholder.svg"} />
          <AvatarFallback>{comment.user.name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-2">
          <div className="bg-muted rounded-lg p-3">
            <div className="mb-1 flex items-center gap-2">
              <p className="text-sm font-semibold">{comment.user.name}</p>
              <p className="text-muted-foreground text-xs">
                {comment.user.username}
              </p>
              {comment.isOwner && (
                <Badge variant="secondary" className="text-xs">
                  Author
                </Badge>
              )}
            </div>
            <p className="text-sm">{comment.content}</p>
          </div>

          <div className="text-muted-foreground flex items-center justify-between text-xs">
            <div className="flex items-center gap-4">
              <span>{comment.timestamp}</span>
              <button
                onClick={() => handleLikeComment(comment.id)}
                className={`hover:text-foreground flex items-center gap-1 transition-colors ${
                  comment.isLiked ? "text-red-500" : ""
                }`}
              >
                <Heart
                  className={`h-3 w-3 ${comment.isLiked ? "fill-current" : ""}`}
                />
                {comment.likes > 0 && comment.likes}
              </button>
              {!isReply && (
                <button
                  onClick={() =>
                    setReplyingTo(replyingTo === comment.id ? null : comment.id)
                  }
                  className="hover:text-foreground flex items-center gap-1 transition-colors"
                >
                  <Reply className="h-3 w-3" />
                  Reply
                </button>
              )}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="hover:text-foreground transition-colors">
                  <MoreHorizontal className="h-3 w-3" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {comment.isOwner ? (
                  <DropdownMenuItem className="text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Comment
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem className="text-destructive">
                    <Flag className="mr-2 h-4 w-4" />
                    Report Comment
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Reply Input */}
          {replyingTo === comment.id && (
            <div className="mt-2 flex gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src="/diverse-user-avatars.png" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="flex flex-1 gap-2">
                <Textarea
                  placeholder={`Reply to ${comment.user.name}...`}
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  className="min-h-[60px] resize-none text-sm"
                />
                <div className="flex flex-col gap-1">
                  <Button
                    size="sm"
                    onClick={() => handleAddReply(comment.id)}
                    disabled={!replyContent.trim()}
                  >
                    <Send className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setReplyingTo(null)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Replies */}
          {comment.replies.length > 0 && (
            <div className="mt-3 space-y-3">
              {comment.replies.map((reply) => (
                <CommentComponent
                  key={reply.id}
                  comment={reply}
                  isReply={true}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Comments</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Original Post */}
          <div className="bg-muted/30 rounded-lg p-4">
            <div className="mb-3 flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={heartbeat.user.avatar || "/placeholder.svg"}
                />
                <AvatarFallback>{heartbeat.user.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold">{heartbeat.user.name}</p>
                <p className="text-muted-foreground text-xs">
                  {heartbeat.timestamp}
                </p>
              </div>
            </div>
            <p className="mb-3 text-sm">{heartbeat.content}</p>
            {heartbeat.images && heartbeat.images.length > 0 && (
              <img
                src={heartbeat.images[0] || "/placeholder.svg"}
                alt="Post content"
                className="mb-3 h-32 w-full rounded-lg object-cover"
              />
            )}
            <div className="text-muted-foreground flex items-center gap-4 text-xs">
              <span>{heartbeat.likes} likes</span>
              <span>{heartbeat.comments} comments</span>
              <span>{heartbeat.shares} shares</span>
            </div>
          </div>

          <Separator />

          {/* Add Comment */}
          <div className="flex gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/diverse-user-avatars.png" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="flex flex-1 gap-2">
              <Textarea
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[80px] resize-none"
              />
              <Button onClick={handleAddComment} disabled={!newComment.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Separator />

          {/* Comments List */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">
              Comments ({mockComments.length})
            </h3>
            {mockComments.map((comment) => (
              <CommentComponent key={comment.id} comment={comment} />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
