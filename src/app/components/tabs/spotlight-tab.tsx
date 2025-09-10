"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Trophy,
  TrendingUp,
  Star,
  Users,
  Zap,
  Award,
  Target,
  Flame,
  Crown,
  ChevronUp,
  ChevronDown,
  Eye,
  BarChart3,
} from "lucide-react";
import { UserProfileModal } from "../modals/user-profile-modal";

// Mock data with enhanced user information
const mockLeaderboardData = {
  weekly: [
    {
      id: 1,
      rank: 1,
      previousRank: 3,
      user: {
        name: "Maya Patel",
        avatar: "/maya-avatar.jpg",
        username: "@mayap",
        id: "maya789",
      },
      influence: 2847,
      weeklyGain: 156,
      projectsCompleted: 12,
      projectsCreated: 8,
      heartbeats: 45,
      badge: "Community Leader",
      achievements: ["Project Master", "Social Butterfly", "Innovation Driver"],
      joinedDate: "2023-08-15",
      streak: 28,
      level: 15,
      nextLevelProgress: 75,
    },
    {
      id: 2,
      rank: 2,
      previousRank: 1,
      user: {
        name: "Sarah Chen",
        avatar: "/sarah-avatar.png",
        username: "@sarahc",
        id: "sarah123",
      },
      influence: 2634,
      weeklyGain: 89,
      projectsCompleted: 15,
      projectsCreated: 5,
      heartbeats: 32,
      badge: "AI Pioneer",
      achievements: ["Tech Innovator", "Mentor", "Problem Solver"],
      joinedDate: "2023-07-20",
      streak: 21,
      level: 14,
      nextLevelProgress: 45,
    },
    {
      id: 3,
      rank: 3,
      previousRank: 2,
      user: {
        name: "Alex Rodriguez",
        avatar: "/alex-avatar.png",
        username: "@alexr",
        id: "alex456",
      },
      influence: 2401,
      weeklyGain: 124,
      projectsCompleted: 9,
      projectsCreated: 11,
      heartbeats: 28,
      badge: "Innovation Driver",
      achievements: [
        "Creative Catalyst",
        "Team Player",
        "Sustainability Champion",
      ],
      joinedDate: "2023-09-10",
      streak: 15,
      level: 13,
      nextLevelProgress: 80,
    },
    {
      id: 4,
      rank: 4,
      previousRank: 5,
      user: {
        name: "Jordan Kim",
        avatar: "/jordan-avatar.jpg",
        username: "@jordank",
        id: "jordan123",
      },
      influence: 2156,
      weeklyGain: 67,
      projectsCompleted: 18,
      projectsCreated: 3,
      heartbeats: 41,
      badge: "Collaboration Expert",
      achievements: [
        "Team Builder",
        "Reliable Contributor",
        "Community Helper",
      ],
      joinedDate: "2023-06-05",
      streak: 42,
      level: 12,
      nextLevelProgress: 30,
    },
    {
      id: 5,
      rank: 5,
      previousRank: 4,
      user: {
        name: "Taylor Swift",
        avatar: "/taylor-avatar.jpg",
        username: "@taylors",
        id: "taylor456",
      },
      influence: 1987,
      weeklyGain: 203,
      projectsCompleted: 7,
      projectsCreated: 9,
      heartbeats: 38,
      badge: "Creative Catalyst",
      achievements: ["Design Master", "Trendsetter", "Content Creator"],
      joinedDate: "2023-10-01",
      streak: 12,
      level: 11,
      nextLevelProgress: 60,
    },
  ],
  monthly: [
    // Similar structure with different rankings for monthly
  ],
  allTime: [
    // Similar structure with different rankings for all-time
  ],
};

const achievements = [
  {
    name: "Project Master",
    icon: Trophy,
    color: "text-yellow-500",
    description: "Completed 10+ projects",
  },
  {
    name: "Social Butterfly",
    icon: Users,
    color: "text-blue-500",
    description: "High community engagement",
  },
  {
    name: "Innovation Driver",
    icon: Zap,
    color: "text-purple-500",
    description: "Created innovative solutions",
  },
  {
    name: "Tech Innovator",
    icon: Star,
    color: "text-green-500",
    description: "Advanced technical contributions",
  },
  {
    name: "Mentor",
    icon: Award,
    color: "text-orange-500",
    description: "Helped other community members",
  },
  {
    name: "Problem Solver",
    icon: Target,
    color: "text-red-500",
    description: "Solved complex challenges",
  },
];

export function SpotlightTab() {
  const [timeframe, setTimeframe] = useState("weekly");
  const [category, setCategory] = useState("all");
  const [selectedUser, setSelectedUser] = useState<
    (typeof mockLeaderboardData.weekly)[0] | null
  >(null);

  const currentLeaderboard = mockLeaderboardData.weekly; // In real app, switch based on timeframe

  const getRankChange = (current: number, previous: number) => {
    if (current < previous) return { type: "up", change: previous - current };
    if (current > previous) return { type: "down", change: current - previous };
    return { type: "same", change: 0 };
  };

  const getRankIcon = (rankChange: { type: string; change: number }) => {
    if (rankChange.type === "up")
      return <ChevronUp className="h-4 w-4 text-green-500" />;
    if (rankChange.type === "down")
      return <ChevronDown className="h-4 w-4 text-red-500" />;
    return <div className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4 text-center">
        <div className="flex items-center justify-center gap-2">
          <Trophy className="text-primary h-8 w-8" />
          <h1 className="text-3xl font-bold">Community Spotlight</h1>
        </div>
        <p className="text-muted-foreground mx-auto max-w-2xl">
          Celebrating our most influential contributors who drive innovation and
          collaboration across the platform.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex gap-3">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">This Week</SelectItem>
              <SelectItem value="monthly">This Month</SelectItem>
              <SelectItem value="allTime">All Time</SelectItem>
            </SelectContent>
          </Select>

          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="projects">Project Leaders</SelectItem>
              <SelectItem value="social">Social Contributors</SelectItem>
              <SelectItem value="innovation">Innovators</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Badge variant="secondary" className="flex items-center gap-1">
          <Flame className="h-4 w-4" />
          Live Rankings
        </Badge>
      </div>

      <Tabs defaultValue="leaderboard" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="leaderboard" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Influence
                </CardTitle>
                <Zap className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">47,892</div>
                <p className="text-muted-foreground text-xs">
                  +12% from last week
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Contributors
                </CardTitle>
                <Users className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,247</div>
                <p className="text-muted-foreground text-xs">
                  +8% from last week
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Projects Completed
                </CardTitle>
                <Star className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">342</div>
                <p className="text-muted-foreground text-xs">
                  +23% from last week
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  New Achievements
                </CardTitle>
                <Award className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">89</div>
                <p className="text-muted-foreground text-xs">This week</p>
              </CardContent>
            </Card>
          </div>

          {/* Top 3 Podium */}
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Top Contributors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-8 flex items-end justify-center gap-8">
                {/* 2nd Place */}
                <div className="text-center">
                  <div className="relative mb-4">
                    <Avatar className="mx-auto h-16 w-16 border-4 border-gray-400">
                      <AvatarImage
                        src={
                          currentLeaderboard[1]?.user.avatar ||
                          "/placeholder.svg"
                        }
                      />
                      <AvatarFallback>
                        {currentLeaderboard[1]?.user.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-gray-400 text-sm font-bold text-white">
                      2
                    </div>
                  </div>
                  <p className="text-sm font-semibold">
                    {currentLeaderboard[1]?.user.name}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {currentLeaderboard[1]?.influence.toLocaleString()}
                  </p>
                </div>

                {/* 1st Place */}
                <div className="text-center">
                  <div className="relative mb-4">
                    <Avatar className="mx-auto h-20 w-20 border-4 border-yellow-500">
                      <AvatarImage
                        src={
                          currentLeaderboard[0]?.user.avatar ||
                          "/placeholder.svg"
                        }
                      />
                      <AvatarFallback>
                        {currentLeaderboard[0]?.user.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500 font-bold text-white">
                      <Crown className="h-4 w-4" />
                    </div>
                  </div>
                  <p className="font-semibold">
                    {currentLeaderboard[0]?.user.name}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {currentLeaderboard[0]?.influence.toLocaleString()}
                  </p>
                  <Badge variant="default" className="mt-1">
                    {currentLeaderboard[0]?.badge}
                  </Badge>
                </div>

                {/* 3rd Place */}
                <div className="text-center">
                  <div className="relative mb-4">
                    <Avatar className="mx-auto h-16 w-16 border-4 border-amber-600">
                      <AvatarImage
                        src={
                          currentLeaderboard[2]?.user.avatar ||
                          "/placeholder.svg"
                        }
                      />
                      <AvatarFallback>
                        {currentLeaderboard[2]?.user.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-amber-600 text-sm font-bold text-white">
                      3
                    </div>
                  </div>
                  <p className="text-sm font-semibold">
                    {currentLeaderboard[2]?.user.name}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {currentLeaderboard[2]?.influence.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Leaderboard */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="text-primary h-5 w-5" />
                Detailed Rankings
              </CardTitle>
              <CardDescription>
                Complete leaderboard with detailed statistics and progress
                tracking.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currentLeaderboard.map((user) => {
                  const rankChange = getRankChange(
                    user.rank,
                    user.previousRank,
                  );
                  return (
                    <div
                      key={user.id}
                      className={`hover:bg-muted/50 flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-colors ${
                        user.rank <= 3 ? "bg-muted/30" : "bg-card"
                      }`}
                      onClick={() => setSelectedUser(user)}
                    >
                      <div className="flex items-center gap-4">
                        {/* Rank with change indicator */}
                        <div className="flex items-center gap-2">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${
                              user.rank === 1
                                ? "bg-yellow-500 text-white"
                                : user.rank === 2
                                  ? "bg-gray-400 text-white"
                                  : user.rank === 3
                                    ? "bg-amber-600 text-white"
                                    : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {user.rank}
                          </div>
                          {getRankIcon(rankChange)}
                        </div>

                        {/* User Info */}
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12">
                            <AvatarImage
                              src={user.user.avatar || "/placeholder.svg"}
                            />
                            <AvatarFallback>{user.user.name[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-semibold">{user.user.name}</p>
                              <Badge variant="secondary" className="text-xs">
                                Level {user.level}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {user.badge}
                              </Badge>
                            </div>
                            <p className="text-muted-foreground text-sm">
                              {user.user.username}
                            </p>
                            <div className="text-muted-foreground mt-1 flex items-center gap-4 text-xs">
                              <span>{user.projectsCompleted} projects</span>
                              <span>{user.heartbeats} heartbeats</span>
                              <span className="flex items-center gap-1">
                                <Flame className="h-3 w-3" />
                                {user.streak} day streak
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Stats and Progress */}
                      <div className="space-y-2 text-right">
                        <div className="flex items-center gap-2">
                          <span className="text-primary text-lg font-bold">
                            {user.influence.toLocaleString()}
                          </span>
                          <span className="text-muted-foreground text-sm">
                            influence
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-green-600">
                          <TrendingUp className="h-3 w-3" />+{user.weeklyGain}{" "}
                          this week
                        </div>
                        <div className="w-24">
                          <Progress
                            value={user.nextLevelProgress}
                            className="h-2"
                          />
                          <p className="text-muted-foreground mt-1 text-xs">
                            Level {user.level + 1}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="text-primary h-5 w-5" />
                Achievement System
              </CardTitle>
              <CardDescription>
                Unlock badges and achievements by contributing to projects and
                engaging with the community.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {achievements.map((achievement) => {
                  const Icon = achievement.icon;
                  return (
                    <Card
                      key={achievement.name}
                      className="transition-shadow hover:shadow-md"
                    >
                      <CardContent className="pt-6">
                        <div className="space-y-3 text-center">
                          <div
                            className={`bg-muted mx-auto flex h-12 w-12 items-center justify-center rounded-full`}
                          >
                            <Icon className={`h-6 w-6 ${achievement.color}`} />
                          </div>
                          <div>
                            <h3 className="font-semibold">
                              {achievement.name}
                            </h3>
                            <p className="text-muted-foreground text-sm">
                              {achievement.description}
                            </p>
                          </div>
                          <div className="text-muted-foreground text-xs">
                            Earned by {Math.floor(Math.random() * 200) + 50}{" "}
                            members
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Influence Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Top 1%</span>
                    <span className="text-sm font-semibold">
                      2,500+ influence
                    </span>
                  </div>
                  <Progress value={5} className="h-2" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Top 10%</span>
                    <span className="text-sm font-semibold">
                      1,000+ influence
                    </span>
                  </div>
                  <Progress value={25} className="h-2" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Top 50%</span>
                    <span className="text-sm font-semibold">
                      250+ influence
                    </span>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Weekly Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">New Contributors</span>
                    <span className="text-sm font-semibold text-green-600">
                      +47
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Projects Launched</span>
                    <span className="text-sm font-semibold text-blue-600">
                      +23
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Heartbeats Posted</span>
                    <span className="text-sm font-semibold text-purple-600">
                      +156
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Achievements Earned</span>
                    <span className="text-sm font-semibold text-orange-600">
                      +89
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Call to Action */}
      <Card className="text-center">
        <CardContent className="pt-6">
          <h3 className="mb-2 text-lg font-semibold">
            Ready to Climb the Rankings?
          </h3>
          <p className="text-muted-foreground mb-4">
            Start contributing to projects, create your own, and build your
            influence in the community.
          </p>
          <Button>
            <Eye className="mr-2 h-4 w-4" />
            View My Profile
          </Button>
        </CardContent>
      </Card>

      {/* User Profile Modal */}
      {selectedUser && (
        <UserProfileModal
          user={selectedUser}
          open={!!selectedUser}
          onOpenChange={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
}
