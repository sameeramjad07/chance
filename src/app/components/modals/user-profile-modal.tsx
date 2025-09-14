"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "lucide-react";
import { api } from "@/trpc/react";

interface UserProfileModalProps {
  user: {
    id: string;
    user: { id: string; name: string; username: string; avatar: string };
    influence: number;
    projectsCompleted: number;
    heartbeats: number;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserProfileModal({
  user,
  open,
  onOpenChange,
}: UserProfileModalProps) {
  const { data: userData } = api.spotlight.getUserProfile.useQuery(user.id, {
    enabled: open,
  });

  const joinedDate = userData?.createdAt
    ? new Date(userData.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      })
    : "Unknown";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">User Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Profile Header */}
          <div className="flex flex-col items-start gap-6 md:flex-row">
            <div className="flex flex-col items-center space-y-4 text-center">
              <Avatar className="border-primary h-24 w-24 border-4">
                <AvatarImage src={user.user.avatar} />
                <AvatarFallback className="text-2xl">
                  {user.user.name[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold">{user.user.name}</h2>
                <p className="text-muted-foreground">{user.user.username}</p>
              </div>
            </div>

            <div className="flex-1 space-y-4">
              {/* Stats */}
              <Card>
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    <div className="text-center">
                      <span className="text-primary text-2xl font-bold">
                        {(
                          userData?.influence ?? user.influence
                        ).toLocaleString()}
                      </span>
                      <p className="text-muted-foreground text-sm">
                        Total Influence Points
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                <div className="text-center">
                  <div className="text-lg font-bold">
                    {userData?.projectsCompleted ?? user.projectsCompleted}
                  </div>
                  <div className="text-muted-foreground text-xs">
                    Projects Completed
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold">
                    {userData?.heartbeats ?? user.heartbeats}
                  </div>
                  <div className="text-muted-foreground text-xs">
                    Heartbeats
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold">{joinedDate}</div>
                  <div className="text-muted-foreground text-xs">
                    Member Since
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Member Since */}
          <Card>
            <CardContent className="pt-4">
              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4" />
                <span>Member since {joinedDate}</span>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button className="flex-1" disabled>
              Follow (Coming Soon)
            </Button>
            <Button variant="outline" disabled>
              Message (Coming Soon)
            </Button>
            <Button variant="outline" disabled>
              View Projects (Coming Soon)
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
