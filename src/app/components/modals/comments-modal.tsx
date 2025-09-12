"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
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
import { toast } from "sonner";
import { api } from "@/trpc/react";
import Error from "next/error";

interface CommentsModalProps {
  heartbeat: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommentsModal({
  heartbeat,
  open,
  onOpenChange,
}: CommentsModalProps) {
  const { data: session } = useSession();
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");

  const { data: comments, refetch } = api.heartbeat.getComments.useQuery(
    heartbeat.id,
    {
      enabled: open,
    },
  );

  const commentMutation = api.heartbeat.comment.useMutation({
    onSuccess: () => {
      refetch();
      setNewComment("");
      toast("Success! Comment posted successfully");
    },
    onError: (error: Error) => {
      toast("Error");
    },
  });

  const deleteCommentMutation = api.heartbeat.deleteComment.useMutation({
    onSuccess: () => {
      refetch();
      toast("Success! Comment deleted successfully");
    },
    onError: (error: Error) => {
      toast("Error");
    },
  });

  const likeCommentMutation = api.heartbeat.likeComment.useMutation({
    onSuccess: () => {
      refetch();
    },
    onError: (error: Error) => {
      toast("Error");
    },
  });

  const handleAddComment = () => {
    if (!session) {
      toast("You need to be signed in to comment");
      return;
    }

    if (newComment.trim()) {
      commentMutation.mutate({
        heartbeatId: heartbeat.id,
        content: newComment,
      });
    }
  };

  const handleAddReply = (commentId: string) => {
    if (!session) {
      toast("You need to be signed in to reply");
      return;
    }

    if (replyContent.trim()) {
      commentMutation.mutate({
        heartbeatId: heartbeat.id,
        content: replyContent,
        parentCommentId: commentId,
      });
      setReplyContent("");
      setReplyingTo(null);
    }
  };

  const handleLikeComment = (commentId: string) => {
    if (!session) {
      toast("You need to be signed in to like comments");
      return;
    }
    likeCommentMutation.mutate(commentId);
  };

  const handleDeleteComment = (commentId: string) => {
    if (!session) {
      toast("You need to be signed in to delete comments");
      return;
    }
    deleteCommentMutation.mutate(commentId);
  };

  const CommentComponent = ({
    comment,
    isReply = false,
  }: {
    comment: any;
    isReply?: boolean;
  }) => {
    const isOwner = session?.user.id === comment.user.id;
    const isLiked = comment.likes.some(
      (like: any) => like.userId === session?.user.id,
    );

    return (
      <div
        className={`space-y-3 ${isReply ? "border-muted ml-8 border-l-2 pl-4" : ""}`}
      >
        <div className="flex gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={comment.user.profileImageUrl ?? "/placeholder.svg"}
            />
            <AvatarFallback>{comment.user.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <div className="bg-muted rounded-lg p-3">
              <div className="mb-1 flex items-center gap-2">
                <p className="text-sm font-semibold">{comment.user.name}</p>
                <p className="text-muted-foreground text-xs">
                  {comment.user.username}
                </p>
                {isOwner && (
                  <Badge variant="secondary" className="text-xs">
                    Author
                  </Badge>
                )}
              </div>
              <p className="text-sm">{comment.comment.content}</p>
            </div>

            <div className="text-muted-foreground flex items-center justify-between text-xs">
              <div className="flex items-center gap-4">
                <span>
                  {new Date(comment.comment.createdAt).toLocaleString()}
                </span>
                <button
                  onClick={() => handleLikeComment(comment.comment.id)}
                  className={`hover:text-foreground flex items-center gap-1 transition-colors ${
                    isLiked ? "text-red-500" : ""
                  }`}
                >
                  <Heart
                    className={`h-3 w-3 ${isLiked ? "fill-current" : ""}`}
                  />
                  {comment.comment.likes > 0 && comment.comment.likes}
                </button>
                {!isReply && (
                  <button
                    onClick={() =>
                      setReplyingTo(
                        replyingTo === comment.comment.id
                          ? null
                          : comment.comment.id,
                      )
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
                  {isOwner ? (
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => handleDeleteComment(comment.comment.id)}
                    >
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
            {replyingTo === comment.comment.id && (
              <div className="mt-2 flex gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage
                    src={session?.user.image ?? "/placeholder.svg"}
                  />
                  <AvatarFallback>
                    {session?.user.name?.[0] ?? "U"}
                  </AvatarFallback>
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
                      onClick={() => handleAddReply(comment.comment.id)}
                      disabled={
                        !replyContent.trim() || commentMutation.isPending
                      }
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
          </div>
        </div>
      </div>
    );
  };

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
                  src={heartbeat.user.profileImageUrl ?? "/placeholder.svg"}
                />
                <AvatarFallback>{heartbeat.user.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold">{heartbeat.user.name}</p>
                <p className="text-muted-foreground text-xs">
                  {new Date(heartbeat.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
            <p className="mb-3 text-sm">{heartbeat.content}</p>
            {heartbeat.imageUrl && (
              <img
                src={heartbeat.imageUrl}
                alt="Post content"
                className="mb-3 h-32 w-full rounded-lg object-cover"
              />
            )}
            <div className="text-muted-foreground flex items-center gap-4 text-xs">
              <span>{heartbeat.likeCount} likes</span>
              <span>{heartbeat.commentCount} comments</span>
            </div>
          </div>

          <Separator />

          {/* Add Comment */}
          <div className="flex gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={session?.user.image ?? "/placeholder.svg"} />
              <AvatarFallback>{session?.user.name?.[0] ?? "U"}</AvatarFallback>
            </Avatar>
            <div className="flex flex-1 gap-2">
              <Textarea
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[80px] resize-none"
              />
              <Button
                onClick={handleAddComment}
                disabled={!newComment.trim() || commentMutation.isPending}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Separator />

          {/* Comments List */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">
              Comments ({comments?.length || 0})
            </h3>
            {comments?.map((comment) => (
              <CommentComponent key={comment.comment.id} comment={comment} />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
