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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { ImageIcon, Video, X, Plus, Hash, Rocket } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/trpc/react";
import Error from "next/error";
import { useUploadThing } from "@/utils/uploadthing";
import type { FileWithPath } from "@uploadthing/react";

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
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const { startUpload } = useUploadThing("mediaUploader");

  const createMutation = api.heartbeat.create.useMutation({
    onSuccess: () => {
      toast("Success! Heartbeat posted successfully");
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast("Error");
    },
  });

  // Sync initialContent when it changes
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

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;
    if (!files) return;

    setIsUploading(true);
    try {
      const uploaded = await startUpload(Array.from(files) as FileWithPath[]);
      if (uploaded) {
        const urls = uploaded.map((file) => file.url);
        setUploadedFiles([...uploadedFiles, ...urls]);
      }
    } catch (error) {
      toast("Error! Failed to upload files");
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = (fileUrl: string) => {
    setUploadedFiles(uploadedFiles.filter((url) => url !== fileUrl));
  };

  const handlePost = () => {
    if (!session) {
      toast("You need to be signed in to create posts");
      return;
    }

    if (!content.trim()) {
      toast("Error! Content is required");
      return;
    }

    const finalContent =
      `${content} ${hashtags.map((tag) => `#${tag}`).join(" ")}`.trim();

    createMutation.mutate({
      content: finalContent,
      visibility,
      image: uploadedFiles[0], // Using first file as per schema (imageUrl field)
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create a Heartbeat</DialogTitle>
          <DialogDescription>
            Share your progress, celebrate wins, or connect with the community.
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

          {/* Visibility */}
          <div className="space-y-2">
            <Label>Visibility</Label>
            <Select
              value={visibility}
              onValueChange={(value: "public" | "private") =>
                setVisibility(value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="private">Private</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Media Upload */}
          <div className="space-y-3">
            <Label>Media (Optional)</Label>
            <div className="flex gap-2">
              <Label htmlFor="media-upload" className="cursor-pointer">
                <div className="border-border hover:bg-muted flex items-center gap-2 rounded-lg border px-3 py-2 transition-colors">
                  <ImageIcon className="h-4 w-4" />
                  <span className="text-sm">Add Media</span>
                </div>
                <Input
                  id="media-upload"
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  className="hidden"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                />
              </Label>
            </div>

            {/* Uploaded Files Preview */}
            {uploadedFiles.length > 0 && (
              <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                {uploadedFiles.map((url, index) => (
                  <div key={index} className="group relative">
                    {url.includes(".mp4") || url.includes(".webm") ? (
                      <video
                        src={url}
                        className="h-24 w-full rounded-lg object-cover"
                        controls
                      />
                    ) : (
                      <img
                        src={url}
                        alt={`Upload ${index + 1}`}
                        className="h-24 w-full rounded-lg object-cover"
                      />
                    )}
                    <button
                      onClick={() => removeFile(url)}
                      className="bg-destructive text-destructive-foreground absolute top-1 right-1 rounded-full p-1 opacity-0 transition-opacity group-hover:opacity-100"
                      disabled={isUploading}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
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
          {(content || uploadedFiles.length > 0 || hashtags.length > 0) && (
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
                  {uploadedFiles.length > 0 && (
                    <div className="grid grid-cols-2 gap-2">
                      {uploadedFiles
                        .slice(0, 4)
                        .map((url, index) =>
                          url.includes(".mp4") || url.includes(".webm") ? (
                            <video
                              key={index}
                              src={url}
                              className="h-20 w-full rounded object-cover"
                              controls
                            />
                          ) : (
                            <img
                              key={index}
                              src={url}
                              alt={`Preview ${index + 1}`}
                              className="h-20 w-full rounded object-cover"
                            />
                          ),
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
