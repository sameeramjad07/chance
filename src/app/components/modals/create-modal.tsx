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
import { Rocket, X, Plus } from "lucide-react";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { z } from "zod";

const projectSchema = z.object({
  title: z.string().min(1, "Title is required").max(256),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required").max(100),
  impact: z.string().min(1, "Impact is required"),
  teamSize: z.number().min(1, "Team size must be at least 1"),
  effort: z.string().min(1, "Effort level is required").max(100),
  peopleInfluenced: z
    .number()
    .min(1, "Number of people influenced is required"),
  visibility: z.enum(["public", "private"]).default("public"),
});

interface CreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: () => void;
}

export function CreateModal({
  open,
  onOpenChange,
  onCreate,
}: CreateModalProps) {
  const [projectTags, setProjectTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    impact: "",
    teamSize: "",
    effort: "",
    peopleInfluenced: "",
    visibility: "public" as "public" | "private",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof typeof formData, string>>
  >({});

  const createProject = api.project.create.useMutation({
    onSuccess: () => {
      toast.success("Project created successfully");
      onCreate();
      onOpenChange(false);
      setFormData({
        title: "",
        description: "",
        category: "",
        impact: "",
        teamSize: "",
        effort: "",
        peopleInfluenced: "",
        visibility: "public",
      });
      setProjectTags([]);
      setErrors({});
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const addTag = () => {
    if (newTag.trim() && !projectTags.includes(newTag.trim())) {
      setProjectTags([...projectTags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setProjectTags(projectTags.filter((tag) => tag !== tagToRemove));
  };

  const handleCreateProject = () => {
    const parsedData = {
      ...formData,
      teamSize: parseInt(formData.teamSize) || 0,
      peopleInfluenced: parseInt(formData.peopleInfluenced) || 0,
    };

    const result = projectSchema.safeParse(parsedData);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        title: fieldErrors.title?.[0],
        description: fieldErrors.description?.[0],
        category: fieldErrors.category?.[0],
        impact: fieldErrors.impact?.[0],
        teamSize: fieldErrors.teamSize?.[0],
        effort: fieldErrors.effort?.[0],
        peopleInfluenced: fieldErrors.peopleInfluenced?.[0],
      });
      toast.error("Please fill in all required fields correctly");
      return;
    }

    createProject.mutate({
      ...parsedData,
      requiredTools: projectTags,
      typeOfPeople: undefined,
      actionPlan: [],
      collaboration: undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Something Amazing</DialogTitle>
          <DialogDescription>
            Start a new project to collaborate with the community.
          </DialogDescription>
        </DialogHeader>

        <Tabs value="project" className="w-full">
          <TabsList className="grid w-full grid-cols-1">
            <TabsTrigger value="project" className="flex items-center gap-2">
              <Rocket className="h-4 w-4" />
              Project
            </TabsTrigger>
          </TabsList>

          <TabsContent value="project" className="space-y-4">
            {/* ---- project form remains unchanged ---- */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="project-title">Project Title</Label>
                <Input
                  id="project-title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g., AI-Powered Task Manager"
                />
                {errors.title && (
                  <p className="text-destructive text-sm">{errors.title}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="project-category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AI/ML">AI/ML</SelectItem>
                    <SelectItem value="Web Development">
                      Web Development
                    </SelectItem>
                    <SelectItem value="Mobile Apps">Mobile Apps</SelectItem>
                    <SelectItem value="E-commerce">E-commerce</SelectItem>
                    <SelectItem value="Social Impact">Social Impact</SelectItem>
                    <SelectItem value="Web3/Blockchain">
                      Web3/Blockchain
                    </SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-destructive text-sm">{errors.category}</p>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="project-description">Description</Label>
              <Textarea
                id="project-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Describe your project, its goals, and what kind of collaborators you're looking for..."
                className="min-h-[100px]"
              />
              {errors.description && (
                <p className="text-destructive text-sm">{errors.description}</p>
              )}
            </div>

            {/* Impact */}
            <div className="space-y-2">
              <Label htmlFor="project-impact">Impact</Label>
              <Textarea
                id="project-impact"
                value={formData.impact}
                onChange={(e) =>
                  setFormData({ ...formData, impact: e.target.value })
                }
                placeholder="What impact will this project have?"
                className="min-h-[80px]"
              />
              {errors.impact && (
                <p className="text-destructive text-sm">{errors.impact}</p>
              )}
            </div>

            {/* People Influenced */}
            <div className="space-y-2">
              <Label htmlFor="project-people-influenced">
                Number of People it will Influence
              </Label>
              <Input
                id="project-people-influenced"
                type="number"
                value={formData.peopleInfluenced}
                onChange={(e) =>
                  setFormData({ ...formData, peopleInfluenced: e.target.value })
                }
                placeholder="e.g., 100"
              />
              {errors.peopleInfluenced && (
                <p className="text-destructive text-sm">
                  {errors.peopleInfluenced}
                </p>
              )}
            </div>

            {/* Tools */}
            <div className="space-y-2">
              <Label>Technologies & Tools</Label>
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tool (e.g., React, Python, Design)"
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

            {/* Effort & Team Size */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="project-effort">Effort Level</Label>
                <Select
                  value={formData.effort}
                  onValueChange={(value) =>
                    setFormData({ ...formData, effort: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select effort level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
                {errors.effort && (
                  <p className="text-destructive text-sm">{errors.effort}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="project-team-size">Team Size Needed</Label>
                <Input
                  id="project-team-size"
                  type="number"
                  value={formData.teamSize}
                  onChange={(e) =>
                    setFormData({ ...formData, teamSize: e.target.value })
                  }
                  placeholder="e.g., 4"
                />
                {errors.teamSize && (
                  <p className="text-destructive text-sm">{errors.teamSize}</p>
                )}
              </div>
            </div>

            {/* Visibility */}
            <div className="space-y-2">
              <Label htmlFor="project-visibility">Visibility</Label>
              <Select
                value={formData.visibility}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    visibility: value as "public" | "private",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select visibility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleCreateProject}
                disabled={createProject.isPending}
              >
                Create Project
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
