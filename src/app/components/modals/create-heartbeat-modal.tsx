"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { X, Plus, Hash } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/trpc/react";
import { UploadButton } from "@/lib/uploadthing";

interface CreateHeartbeatModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialContent?: string;
  onSuccess?: () => void;
}

export function CreateHeartbeatModal({
  open,
  onOpenChange,
  initialContent = "",
  onSuccess,
}: CreateHeartbeatModalProps) {
  const { data: session } = useSession();
  const [content, setContent] = useState(initialContent);
  const [visibility, setVisibility] = useState<"public" | "private">("public");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [newHashtag, setNewHashtag] = useState("");
  const [mediaUrl, setMediaUrl] = useState<string | undefined>();
  const [mediaType, setMediaType] = useState<"image" | "video" | undefined>();
  const [isUploading, setIsUploading] = useState(false);

  const createMutation = api.heartbeat.create.useMutation({
    onSuccess: () => {
      toast.success("Heartbeat posted successfully!");
      setContent("");
      setHashtags([]);
      setMediaUrl(undefined);
      setMediaType(undefined);
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  const addHashtag = () => {
    const cleanTag = newHashtag.trim().replace(/^#/, "");
    if (cleanTag && !hashtags.includes(cleanTag)) {
      setHashtags([...hashtags, cleanTag]);
      setNewHashtag("");
    }
  };

  const removeHashtag = (tagToRemove: string) => {
    setHashtags(hashtags.filter((tag) => tag !== tagToRemove));
  };

  const handlePost = () => {
    if (!session) {
      toast.error("You need to be signed in to create posts");
      return;
    }

    if (!content.trim()) {
      toast.error("Content is required");
      return;
    }

    const finalContent =
      `${content} ${hashtags.map((tag) => `#${tag}`).join(" ")}`.trim();

    createMutation.mutate({
      userId: session.user.id,
      content: finalContent,
      visibility,
      ...(mediaType === "image" && mediaUrl ? { image: mediaUrl } : {}),
      ...(mediaType === "video" && mediaUrl ? { video: mediaUrl } : {}),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create a Heartbeat</DialogTitle>
          <DialogDescription>
            Share your progress, celebrate wins, or connect with the community.
            You can add one image or one video per post.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {/* User Info */}
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={session?.user.image ?? "/placeholder.svg"} />
              <AvatarFallback>{session?.user.name?.[0] ?? "U"}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold">
                {session?.user.name ?? "User"}
              </p>
              <p className="text-muted-foreground text-xs">
                {session?.user.username ?? "@user"}
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="heartbeat-content">What&apos;s happening?</Label>
            <Textarea
              id="heartbeat-content"
              placeholder="Share your thoughts, progress, or ask the community for help..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[120px] resize-none"
              maxLength={500}
            />
            <div className="text-muted-foreground text-right text-xs">
              {content.length}/500 characters
            </div>
          </div>

          {/* Media Upload */}
          <div className="space-y-3">
            <Label>Media (Optional - Choose one)</Label>
            <div className="flex gap-3">
              <div className="flex">
                <UploadButton
                  endpoint="imageUploader"
                  appearance={{
                    button:
                      "bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg flex items-center gap-2 shadow",
                  }}
                  onClientUploadComplete={(res) => {
                    if (mediaType && mediaType !== "image") {
                      toast.error(
                        "You can only upload either an image OR a video, not both.",
                      );
                      return;
                    }
                    if (res && res.length > 0) {
                      const file = res[0]!;
                      setMediaUrl(file.url);
                      setMediaType("image");
                      toast.success("Image uploaded successfully!");
                    }
                    setIsUploading(false);
                  }}
                  onUploadError={(error) => {
                    setIsUploading(false);
                    toast.error(`Image upload failed: ${error.message}`);
                  }}
                  onUploadBegin={() => setIsUploading(true)}
                  onUploadAborted={() => setIsUploading(false)}
                  disabled={isUploading || !!mediaUrl}
                />
              </div>

              <div className="flex">
                <UploadButton
                  endpoint="videoUploader"
                  appearance={{
                    button:
                      "bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg flex items-center gap-2 shadow",
                  }}
                  onClientUploadComplete={(res) => {
                    if (mediaType && mediaType !== "video") {
                      toast.error(
                        "You can only upload either a video OR an image, not both.",
                      );
                      return;
                    }
                    if (res && res.length > 0) {
                      const file = res[0]!;
                      setMediaUrl(file.url);
                      setMediaType("video");
                      toast.success("Video uploaded successfully!");
                    }
                    setIsUploading(false);
                  }}
                  onUploadError={(error) => {
                    setIsUploading(false);
                    toast.error(`Video upload failed: ${error.message}`);
                  }}
                  onUploadBegin={() => setIsUploading(true)}
                  onUploadAborted={() => setIsUploading(false)}
                  disabled={isUploading || !!mediaUrl}
                />
              </div>
            </div>

            {/* Uploaded Media Preview */}
            {mediaUrl && (
              <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                <div className="group relative">
                  {mediaType === "video" ? (
                    <video
                      src={mediaUrl}
                      className="h-24 w-full rounded-lg object-cover"
                      controls
                    />
                  ) : (
                    <img
                      src={mediaUrl}
                      alt="Uploaded media"
                      className="h-24 w-full rounded-lg object-cover"
                    />
                  )}
                  <button
                    onClick={() => {
                      setMediaUrl(undefined);
                      setMediaType(undefined);
                    }}
                    className="bg-destructive text-destructive-foreground absolute top-1 right-1 rounded-full p-1 opacity-0 transition-opacity group-hover:opacity-100"
                    disabled={isUploading}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Hashtags */}
          <div className="space-y-2">
            <Label>Hashtags</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Hash className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                <Input
                  value={newHashtag}
                  onChange={(e) => setNewHashtag(e.target.value)}
                  placeholder="Add hashtag (e.g., AI, WebDev, Design)"
                  className="pl-10"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addHashtag();
                    }
                  }}
                />
              </div>
              <Button type="button" variant="outline" onClick={addHashtag}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {hashtags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {hashtags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => removeHashtag(tag)}
                      className="hover:text-destructive ml-1"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Preview */}
          {(content ?? mediaUrl ?? hashtags.length > 0) && (
            <Card>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={session?.user.image ?? "/placeholder.svg"}
                      />
                      <AvatarFallback>
                        {session?.user.name?.[0] ?? "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold">
                        {session?.user.name ?? "User"}
                      </p>
                      <p className="text-muted-foreground text-xs">Preview</p>
                    </div>
                  </div>
                  {content && <p className="text-sm">{content}</p>}
                  {mediaUrl && (
                    <div className="grid grid-cols-2 gap-2">
                      {mediaType === "video" ? (
                        <video
                          src={mediaUrl}
                          className="h-20 w-full rounded object-cover"
                          controls
                        />
                      ) : (
                        <img
                          src={mediaUrl}
                          alt="Preview media"
                          className="h-20 w-full rounded object-cover"
                        />
                      )}
                    </div>
                  )}
                  {hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {hashtags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs"
                        >
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={handlePost}
              disabled={
                !content.trim() || createMutation.isPending || isUploading
              }
            >
              {createMutation.isPending ? "Posting..." : "Post Heartbeat"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
