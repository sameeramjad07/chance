"use client";

import type React from "react";

import { useState } from "react";
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

interface CreateHeartbeatModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateHeartbeatModal({
  open,
  onOpenChange,
}: CreateHeartbeatModalProps) {
  const [content, setContent] = useState("");
  const [selectedProject, setSelectedProject] = useState("none");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [newHashtag, setNewHashtag] = useState("");
  const [mentions, setMentions] = useState<string[]>([]);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploadedVideo, setUploadedVideo] = useState<string | null>(null);

  const mockProjects = [
    { id: "1", title: "AI-Powered Task Manager" },
    { id: "2", title: "Sustainable Fashion Marketplace" },
    { id: "3", title: "Community Garden Network" },
  ];

  const addHashtag = () => {
    if (newHashtag.trim() && !hashtags.includes(newHashtag.trim())) {
      setHashtags([...hashtags, newHashtag.trim()]);
      setNewHashtag("");
    }
  };

  const removeHashtag = (tagToRemove: string) => {
    setHashtags(hashtags.filter((tag) => tag !== tagToRemove));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      // Mock image upload - in real app, upload to your storage service
      const newImages = Array.from(files).map((file) =>
        URL.createObjectURL(file),
      );
      setUploadedImages([...uploadedImages, ...newImages]);
    }
  };

  const removeImage = (imageToRemove: string) => {
    setUploadedImages(uploadedImages.filter((img) => img !== imageToRemove));
  };

  const handlePost = () => {
    const postData = {
      content,
      projectId: selectedProject,
      hashtags,
      mentions,
      images: uploadedImages,
      video: uploadedVideo,
    };
    console.log("Creating heartbeat:", postData);
    onOpenChange(false);
    // Reset form
    setContent("");
    setSelectedProject("none");
    setHashtags([]);
    setMentions([]);
    setUploadedImages([]);
    setUploadedVideo(null);
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
              <AvatarImage src="/diverse-user-avatars.png" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold">John Doe</p>
              <p className="text-muted-foreground text-xs">@johndoe</p>
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
            />
            <div className="text-muted-foreground text-right text-xs">
              {content.length}/500 characters
            </div>
          </div>

          {/* Project Association */}
          <div className="space-y-2">
            <Label>Associate with Project (Optional)</Label>
            <Select value={selectedProject} onValueChange={setSelectedProject}>
              <SelectTrigger>
                <SelectValue placeholder="Select a project to associate this post with" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No project association</SelectItem>
                {mockProjects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    <div className="flex items-center gap-2">
                      <Rocket className="h-4 w-4" />
                      {project.title}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Media Upload */}
          <div className="space-y-3">
            <Label>Media (Optional)</Label>

            {/* Image Upload */}
            <div className="flex gap-2">
              <Label htmlFor="image-upload" className="cursor-pointer">
                <div className="border-border hover:bg-muted flex items-center gap-2 rounded-lg border px-3 py-2 transition-colors">
                  <ImageIcon className="h-4 w-4" />
                  <span className="text-sm">Add Photos</span>
                </div>
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </Label>

              <Label htmlFor="video-upload" className="cursor-pointer">
                <div className="border-border hover:bg-muted flex items-center gap-2 rounded-lg border px-3 py-2 transition-colors">
                  <Video className="h-4 w-4" />
                  <span className="text-sm">Add Video</span>
                </div>
                <Input
                  id="video-upload"
                  type="file"
                  accept="video/*"
                  className="hidden"
                />
              </Label>
            </div>

            {/* Uploaded Images Preview */}
            {uploadedImages.length > 0 && (
              <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                {uploadedImages.map((image, index) => (
                  <div key={index} className="group relative">
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`Upload ${index + 1}`}
                      className="h-24 w-full rounded-lg object-cover"
                    />
                    <button
                      onClick={() => removeImage(image)}
                      className="bg-destructive text-destructive-foreground absolute top-1 right-1 rounded-full p-1 opacity-0 transition-opacity group-hover:opacity-100"
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
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addHashtag())
                  }
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
          {(content || uploadedImages.length > 0 || hashtags.length > 0) && (
            <Card>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/diverse-user-avatars.png" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold">John Doe</p>
                      <p className="text-muted-foreground text-xs">Preview</p>
                    </div>
                  </div>
                  {content && <p className="text-sm">{content}</p>}
                  {uploadedImages.length > 0 && (
                    <div className="grid grid-cols-2 gap-2">
                      {uploadedImages.slice(0, 4).map((image, index) => (
                        <img
                          key={index}
                          src={image || "/placeholder.svg"}
                          alt={`Preview ${index + 1}`}
                          className="h-20 w-full rounded object-cover"
                        />
                      ))}
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
            <Button onClick={handlePost} disabled={!content.trim()}>
              Post Heartbeat
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
