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
import { UserProfileModal } from "@/app/components/modals/user-profile-modal";

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
    <div className="space-y-4 px-4 md:space-y-6 md:px-0">
      {/* Header */}
      <div className="space-y-2 text-center md:space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Trophy className="text-primary h-6 w-6 md:h-8 md:w-8" />
          <h1 className="text-2xl font-bold md:text-3xl">
            Community Spotlight
          </h1>
        </div>
        <p className="text-muted-foreground mx-auto max-w-2xl px-4 text-sm md:px-0 md:text-base">
          Celebrating our most influential contributors who drive innovation and
          collaboration across the platform.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-4">
        <div className="flex gap-2 md:gap-3">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="h-10 flex-1 md:h-9 md:w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">This Week</SelectItem>
              <SelectItem value="monthly">This Month</SelectItem>
              <SelectItem value="allTime">All Time</SelectItem>
            </SelectContent>
          </Select>

          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="h-10 flex-1 md:h-9 md:w-[140px]">
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

        <Badge
          variant="secondary"
          className="flex items-center justify-center gap-1 md:justify-start"
        >
          <Flame className="h-4 w-4" />
          Live Rankings
        </Badge>
      </div>

      <Tabs defaultValue="leaderboard" className="w-full">
        <TabsList className="grid h-10 w-full grid-cols-3 md:h-9">
          <TabsTrigger value="leaderboard" className="text-xs md:text-sm">
            Leaderboard
          </TabsTrigger>
          <TabsTrigger value="achievements" className="text-xs md:text-sm">
            Achievements
          </TabsTrigger>
          <TabsTrigger value="analytics" className="text-xs md:text-sm">
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="leaderboard"
          className="mt-4 space-y-4 md:mt-6 md:space-y-6"
        >
          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 px-3 pt-3 pb-2 md:px-6 md:pt-6">
                <CardTitle className="text-xs font-medium md:text-sm">
                  Total Influence
                </CardTitle>
                <Zap className="text-muted-foreground h-3 w-3 md:h-4 md:w-4" />
              </CardHeader>
              <CardContent className="px-3 pb-3 md:px-6 md:pb-6">
                <div className="text-lg font-bold md:text-2xl">47,892</div>
                <p className="text-muted-foreground text-xs">
                  +12% from last week
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 px-3 pt-3 pb-2 md:px-6 md:pt-6">
                <CardTitle className="text-xs font-medium md:text-sm">
                  Active Contributors
                </CardTitle>
                <Users className="text-muted-foreground h-3 w-3 md:h-4 md:w-4" />
              </CardHeader>
              <CardContent className="px-3 pb-3 md:px-6 md:pb-6">
                <div className="text-lg font-bold md:text-2xl">1,247</div>
                <p className="text-muted-foreground text-xs">
                  +8% from last week
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 px-3 pt-3 pb-2 md:px-6 md:pt-6">
                <CardTitle className="text-xs font-medium md:text-sm">
                  Projects Completed
                </CardTitle>
                <Star className="text-muted-foreground h-3 w-3 md:h-4 md:w-4" />
              </CardHeader>
              <CardContent className="px-3 pb-3 md:px-6 md:pb-6">
                <div className="text-lg font-bold md:text-2xl">342</div>
                <p className="text-muted-foreground text-xs">
                  +23% from last week
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 px-3 pt-3 pb-2 md:px-6 md:pt-6">
                <CardTitle className="text-xs font-medium md:text-sm">
                  New Achievements
                </CardTitle>
                <Award className="text-muted-foreground h-3 w-3 md:h-4 md:w-4" />
              </CardHeader>
              <CardContent className="px-3 pb-3 md:px-6 md:pb-6">
                <div className="text-lg font-bold md:text-2xl">89</div>
                <p className="text-muted-foreground text-xs">This week</p>
              </CardContent>
            </Card>
          </div>

          {/* Top 3 Podium */}
          <Card>
            <CardHeader className="px-4 md:px-6">
              <CardTitle className="text-center text-lg md:text-xl">
                Top Contributors
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 md:px-6">
              <div className="mb-6 flex items-end justify-center gap-4 md:mb-8 md:gap-8">
                {/* 2nd Place */}
                <div className="text-center">
                  <div className="relative mb-3 md:mb-4">
                    <Avatar className="mx-auto h-12 w-12 border-2 border-gray-400 md:h-16 md:w-16 md:border-4">
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
                    <div className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-gray-400 text-xs font-bold text-white md:-top-2 md:-right-2 md:h-8 md:w-8 md:text-sm">
                      2
                    </div>
                  </div>
                  <p className="text-xs font-semibold md:text-sm">
                    {currentLeaderboard[1]?.user.name}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {currentLeaderboard[1]?.influence.toLocaleString()}
                  </p>
                </div>

                {/* 1st Place */}
                <div className="text-center">
                  <div className="relative mb-3 md:mb-4">
                    <Avatar className="mx-auto h-16 w-16 border-2 border-yellow-500 md:h-20 md:w-20 md:border-4">
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
                    <div className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-yellow-500 font-bold text-white md:-top-2 md:-right-2 md:h-8 md:w-8">
                      <Crown className="h-3 w-3 md:h-4 md:w-4" />
                    </div>
                  </div>
                  <p className="text-sm font-semibold md:text-base">
                    {currentLeaderboard[0]?.user.name}
                  </p>
                  <p className="text-muted-foreground text-xs md:text-sm">
                    {currentLeaderboard[0]?.influence.toLocaleString()}
                  </p>
                  <Badge variant="default" className="mt-1 text-xs">
                    {currentLeaderboard[0]?.badge}
                  </Badge>
                </div>

                {/* 3rd Place */}
                <div className="text-center">
                  <div className="relative mb-3 md:mb-4">
                    <Avatar className="mx-auto h-12 w-12 border-2 border-amber-600 md:h-16 md:w-16 md:border-4">
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
                    <div className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-amber-600 text-xs font-bold text-white md:-top-2 md:-right-2 md:h-8 md:w-8 md:text-sm">
                      3
                    </div>
                  </div>
                  <p className="text-xs font-semibold md:text-sm">
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
            <CardHeader className="px-4 md:px-6">
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                <BarChart3 className="text-primary h-4 w-4 md:h-5 md:w-5" />
                Detailed Rankings
              </CardTitle>
              <CardDescription className="text-sm">
                Complete leaderboard with detailed statistics and progress
                tracking.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 md:px-6">
              <div className="space-y-3 md:space-y-4">
                {currentLeaderboard.map((user) => {
                  const rankChange = getRankChange(
                    user.rank,
                    user.previousRank,
                  );
                  return (
                    <div
                      key={user.id}
                      className={`hover:bg-muted/50 flex cursor-pointer items-center justify-between rounded-lg border p-3 transition-colors md:p-4 ${
                        user.rank <= 3 ? "bg-muted/30" : "bg-card"
                      }`}
                      onClick={() => setSelectedUser(user)}
                    >
                      <div className="flex min-w-0 flex-1 items-center gap-2 md:gap-4">
                        {/* Rank with change indicator */}
                        <div className="flex flex-shrink-0 items-center gap-1 md:gap-2">
                          <div
                            className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold md:h-10 md:w-10 md:text-sm ${
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
                          <div className="hidden md:block">
                            {getRankIcon(rankChange)}
                          </div>
                        </div>

                        {/* User Info */}
                        <div className="flex min-w-0 flex-1 items-center gap-2 md:gap-3">
                          <Avatar className="h-8 w-8 flex-shrink-0 md:h-12 md:w-12">
                            <AvatarImage
                              src={user.user.avatar || "/placeholder.svg"}
                            />
                            <AvatarFallback>{user.user.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-1 md:gap-2">
                              <p className="truncate text-sm font-semibold md:text-base">
                                {user.user.name}
                              </p>
                              <Badge
                                variant="secondary"
                                className="flex-shrink-0 text-xs"
                              >
                                Level {user.level}
                              </Badge>
                              <Badge
                                variant="outline"
                                className="hidden text-xs md:inline-flex"
                              >
                                {user.badge}
                              </Badge>
                            </div>
                            <p className="text-muted-foreground truncate text-xs md:text-sm">
                              {user.user.username}
                            </p>
                            <div className="text-muted-foreground mt-1 flex items-center gap-2 text-xs md:gap-4">
                              <span className="hidden md:inline">
                                {user.projectsCompleted} projects
                              </span>
                              <span className="hidden md:inline">
                                {user.heartbeats} heartbeats
                              </span>
                              <span className="flex items-center gap-1">
                                <Flame className="h-3 w-3" />
                                {user.streak}d
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Stats and Progress */}
                      <div className="flex-shrink-0 space-y-1 text-right md:space-y-2">
                        <div className="flex items-center justify-end gap-1 md:gap-2">
                          <span className="text-primary text-sm font-bold md:text-lg">
                            {user.influence.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-end gap-1 text-xs text-green-600">
                          <TrendingUp className="h-3 w-3" />
                          <span className="hidden md:inline">
                            +{user.weeklyGain}
                          </span>
                          <span className="md:hidden">+{user.weeklyGain}</span>
                        </div>
                        <div className="w-16 md:w-24">
                          <Progress
                            value={user.nextLevelProgress}
                            className="h-1 md:h-2"
                          />
                          <p className="text-muted-foreground mt-1 hidden text-xs md:block">
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

        <TabsContent
          value="achievements"
          className="mt-4 space-y-4 md:mt-6 md:space-y-6"
        >
          <Card>
            <CardHeader className="px-4 md:px-6">
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                <Award className="text-primary h-4 w-4 md:h-5 md:w-5" />
                Achievement System
              </CardTitle>
              <CardDescription className="text-sm">
                Unlock badges and achievements by contributing to projects and
                engaging with the community.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 md:px-6">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4 lg:grid-cols-3">
                {achievements.map((achievement) => {
                  const Icon = achievement.icon;
                  return (
                    <Card
                      key={achievement.name}
                      className="transition-shadow hover:shadow-md"
                    >
                      <CardContent className="px-4 pt-4 md:px-6 md:pt-6">
                        <div className="space-y-2 text-center md:space-y-3">
                          <div
                            className={`bg-muted mx-auto flex h-10 w-10 items-center justify-center rounded-full md:h-12 md:w-12`}
                          >
                            <Icon
                              className={`h-5 w-5 md:h-6 md:w-6 ${achievement.color}`}
                            />
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold md:text-base">
                              {achievement.name}
                            </h3>
                            <p className="text-muted-foreground text-xs md:text-sm">
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

        <TabsContent
          value="analytics"
          className="mt-4 space-y-4 md:mt-6 md:space-y-6"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
            <Card>
              <CardHeader className="px-4 md:px-6">
                <CardTitle className="text-lg md:text-xl">
                  Influence Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 md:px-6">
                <div className="space-y-3 md:space-y-4">
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
              <CardHeader className="px-4 md:px-6">
                <CardTitle className="text-lg md:text-xl">
                  Weekly Trends
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 md:px-6">
                <div className="space-y-3 md:space-y-4">
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
        <CardContent className="px-4 pt-4 md:px-6 md:pt-6">
          <h3 className="mb-2 text-lg font-semibold">
            Ready to Climb the Rankings?
          </h3>
          <p className="text-muted-foreground mb-4 text-sm md:text-base">
            Start contributing to projects, create your own, and build your
            influence in the community.
          </p>
          <Button className="w-full md:w-auto">
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
