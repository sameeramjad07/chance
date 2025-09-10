"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Trophy,
  Star,
  Users,
  Calendar,
  Award,
  Flame,
  Heart,
  MessageCircle,
  Rocket,
  TrendingUp,
  Zap,
} from "lucide-react";

interface User {
  id: number;
  rank: number;
  previousRank: number;
  user: { name: string; avatar: string; username: string; id: string };
  influence: number;
  weeklyGain: number;
  projectsCompleted: number;
  projectsCreated: number;
  heartbeats: number;
  badge: string;
  achievements: string[];
  joinedDate: string;
  streak: number;
  level: number;
  nextLevelProgress: number;
}

interface UserProfileModalProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Mock additional user data
const mockUserStats = {
  totalLikes: 1247,
  totalComments: 389,
  totalShares: 156,
  followersCount: 892,
  followingCount: 234,
  projectCategories: [
    { name: "AI/ML", count: 8, percentage: 40 },
    { name: "Web Dev", count: 6, percentage: 30 },
    { name: "Design", count: 4, percentage: 20 },
    { name: "Mobile", count: 2, percentage: 10 },
  ],
  recentActivity: [
    {
      type: "project",
      title: "Completed AI Task Manager",
      date: "2 days ago",
      points: 150,
    },
    {
      type: "heartbeat",
      title: "Shared project milestone",
      date: "3 days ago",
      points: 25,
    },
    {
      type: "achievement",
      title: "Earned 'Innovation Driver' badge",
      date: "1 week ago",
      points: 100,
    },
    {
      type: "project",
      title: "Joined Sustainable Fashion Marketplace",
      date: "1 week ago",
      points: 50,
    },
  ],
};

export function UserProfileModal({
  user,
  open,
  onOpenChange,
}: UserProfileModalProps) {
  const joinedDate = new Date(user.joinedDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "project":
        return <Rocket className="h-4 w-4 text-blue-500" />;
      case "heartbeat":
        return <Heart className="h-4 w-4 text-red-500" />;
      case "achievement":
        return <Award className="h-4 w-4 text-yellow-500" />;
      default:
        return <Star className="h-4 w-4 text-gray-500" />;
    }
  };

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
              <div className="relative">
                <Avatar className="border-primary h-24 w-24 border-4">
                  <AvatarImage src={user.user.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="text-2xl">
                    {user.user.name[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="bg-primary text-primary-foreground absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold">
                  #{user.rank}
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold">{user.user.name}</h2>
                <p className="text-muted-foreground">{user.user.username}</p>
                <Badge variant="default" className="mt-2">
                  {user.badge}
                </Badge>
              </div>
            </div>

            <div className="flex-1 space-y-4">
              {/* Level and Progress */}
              <Card>
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">Level {user.level}</span>
                      <span className="text-muted-foreground text-sm">
                        {user.nextLevelProgress}% to Level {user.level + 1}
                      </span>
                    </div>
                    <Progress value={user.nextLevelProgress} className="h-3" />
                    <div className="text-center">
                      <span className="text-primary text-2xl font-bold">
                        {user.influence.toLocaleString()}
                      </span>
                      <p className="text-muted-foreground text-sm">
                        Total Influence Points
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <div className="text-center">
                  <div className="text-lg font-bold">
                    {user.projectsCompleted}
                  </div>
                  <div className="text-muted-foreground text-xs">
                    Projects Completed
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold">
                    {user.projectsCreated}
                  </div>
                  <div className="text-muted-foreground text-xs">
                    Projects Created
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold">{user.heartbeats}</div>
                  <div className="text-muted-foreground text-xs">
                    Heartbeats
                  </div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-lg font-bold">
                    <Flame className="h-4 w-4 text-orange-500" />
                    {user.streak}
                  </div>
                  <div className="text-muted-foreground text-xs">
                    Day Streak
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="stats">Statistics</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Social Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Social Engagement</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Heart className="h-4 w-4 text-red-500" />
                        <span className="text-sm">Total Likes Received</span>
                      </div>
                      <span className="font-semibold">
                        {mockUserStats.totalLikes.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MessageCircle className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">Comments Received</span>
                      </div>
                      <span className="font-semibold">
                        {mockUserStats.totalComments}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Followers</span>
                      </div>
                      <span className="font-semibold">
                        {mockUserStats.followersCount}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-purple-500" />
                        <span className="text-sm">Weekly Growth</span>
                      </div>
                      <span className="font-semibold text-green-600">
                        +{user.weeklyGain}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Project Categories */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Project Categories
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {mockUserStats.projectCategories.map((category) => (
                      <div key={category.name} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">{category.name}</span>
                          <span className="text-sm font-semibold">
                            {category.count} projects
                          </span>
                        </div>
                        <Progress value={category.percentage} className="h-2" />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Member Since */}
              <Card>
                <CardContent className="pt-4">
                  <div className="text-muted-foreground flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4" />
                    <span>Member since {joinedDate}</span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="achievements" className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {user.achievements.map((achievement, index) => (
                  <Card key={achievement} className="text-center">
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        <div className="bg-primary/10 mx-auto flex h-12 w-12 items-center justify-center rounded-full">
                          {index === 0 && (
                            <Trophy className="h-6 w-6 text-yellow-500" />
                          )}
                          {index === 1 && (
                            <Users className="h-6 w-6 text-blue-500" />
                          )}
                          {index === 2 && (
                            <Zap className="h-6 w-6 text-purple-500" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold">{achievement}</h3>
                          <p className="text-muted-foreground text-xs">
                            Earned recently
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="activity" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Latest contributions and achievements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockUserStats.recentActivity.map((activity, index) => (
                      <div
                        key={index}
                        className="bg-muted/30 flex items-center gap-3 rounded-lg p-3"
                      >
                        {getActivityIcon(activity.type)}
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {activity.title}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            {activity.date}
                          </p>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          +{activity.points} pts
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="stats" className="space-y-4">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Influence Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Project Contributions</span>
                      <span className="font-semibold">1,847 pts</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Social Engagement</span>
                      <span className="font-semibold">623 pts</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Community Help</span>
                      <span className="font-semibold">377 pts</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Performance Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Avg. Project Rating</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">4.8</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Completion Rate</span>
                      <span className="font-semibold">94%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Response Time</span>
                      <span className="font-semibold">2.3 hours</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button className="flex-1">Follow</Button>
            <Button variant="outline">Message</Button>
            <Button variant="outline">View Projects</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
