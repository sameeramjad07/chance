"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Rocket, Heart, X, Plus } from "lucide-react";

interface CreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateModal({ open, onOpenChange }: CreateModalProps) {
  const [projectTags, setProjectTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");

  const addTag = () => {
    if (newTag.trim() && !projectTags.includes(newTag.trim())) {
      setProjectTags([...projectTags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setProjectTags(projectTags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Something Amazing</DialogTitle>
          <DialogDescription>
            Share your progress with a heartbeat or start a new project to
            collaborate with the community.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="heartbeat" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="heartbeat" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Heartbeat
            </TabsTrigger>
            <TabsTrigger value="project" className="flex items-center gap-2">
              <Rocket className="h-4 w-4" />
              Project
            </TabsTrigger>
          </TabsList>

          <TabsContent value="heartbeat" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="heartbeat-content">What's on your mind?</Label>
              <Textarea
                id="heartbeat-content"
                placeholder="Share your progress, celebrate wins, ask for help, or just say hello to the community..."
                className="min-h-[120px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="heartbeat-image">Add an image (optional)</Label>
              <Input
                id="heartbeat-image"
                type="file"
                accept="image/*"
                className="cursor-pointer"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button>Share Heartbeat</Button>
            </div>
          </TabsContent>

          <TabsContent value="project" className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="project-title">Project Title</Label>
                <Input
                  id="project-title"
                  placeholder="e.g., AI-Powered Task Manager"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="project-category">Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ai-ml">AI/ML</SelectItem>
                    <SelectItem value="web-dev">Web Development</SelectItem>
                    <SelectItem value="mobile">Mobile Apps</SelectItem>
                    <SelectItem value="ecommerce">E-commerce</SelectItem>
                    <SelectItem value="social-impact">Social Impact</SelectItem>
                    <SelectItem value="web3">Web3/Blockchain</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="project-description">Description</Label>
              <Textarea
                id="project-description"
                placeholder="Describe your project, its goals, and what kind of collaborators you're looking for..."
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="project-requirements">
                Requirements & Skills Needed
              </Label>
              <Textarea
                id="project-requirements"
                placeholder="What skills, experience, or resources are needed for this project?"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>Technologies & Tags</Label>
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag (e.g., React, Python, Design)"
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addTag())
                  }
                />
                <Button type="button" variant="outline" onClick={addTag}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {projectTags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {projectTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:text-destructive ml-1"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="project-timeline">Expected Timeline</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select timeline" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-2-weeks">1-2 weeks</SelectItem>
                    <SelectItem value="1-month">1 month</SelectItem>
                    <SelectItem value="2-3-months">2-3 months</SelectItem>
                    <SelectItem value="3-6-months">3-6 months</SelectItem>
                    <SelectItem value="6-months-plus">6+ months</SelectItem>
                    <SelectItem value="ongoing">Ongoing</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="project-team-size">Team Size Needed</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select team size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="solo">Just me (solo project)</SelectItem>
                    <SelectItem value="2-3">2-3 people</SelectItem>
                    <SelectItem value="4-6">4-6 people</SelectItem>
                    <SelectItem value="7-10">7-10 people</SelectItem>
                    <SelectItem value="10-plus">10+ people</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button>Create Project</Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
