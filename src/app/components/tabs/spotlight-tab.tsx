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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, BarChart3, Loader2 } from "lucide-react";
import { api } from "@/trpc/react";

// Define the expected leaderboard user type
interface LeaderboardUser {
  id: string;
  rank: number;
  influence: number;
  projectsCompleted: number;
  heartbeats: number;
  user: {
    name: string;
    username: string;
    avatar: string | null;
  };
}

export function SpotlightTab() {
  // Remove unused setTimeframe and selectedUser for now
  const [timeframe] = useState<"weekly" | "monthly" | "allTime">("allTime");

  const { data: leaderboard, isLoading } = api.spotlight.getRankings.useQuery({
    limit: 20,
    timeframe,
  });

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

      <Tabs defaultValue="leaderboard" className="w-full">
        <TabsList className="grid h-10 w-full grid-cols-1 md:h-9">
          <TabsTrigger value="leaderboard" className="text-xs md:text-sm">
            Leaderboard
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="leaderboard"
          className="mt-4 space-y-4 md:mt-6 md:space-y-6"
        >
          {/* Top 3 Podium */}
          {leaderboard && leaderboard.length > 0 && (
            <Card>
              <CardHeader className="px-4 md:px-6">
                <CardTitle className="text-center text-lg md:text-xl">
                  Top Contributors
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 md:px-6">
                <div className="mb-6 flex items-end justify-center gap-4 md:mb-8 md:gap-8">
                  {/* 2nd Place */}
                  {leaderboard[1] && (
                    <div className="text-center">
                      <div className="relative mb-3 md:mb-4">
                        <Avatar className="mx-auto h-12 w-12 border-2 border-gray-400 md:h-16 md:w-16 md:border-4">
                          <AvatarImage src={leaderboard[1].user.avatar ?? ""} />
                          <AvatarFallback>
                            {leaderboard[1].user.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-gray-400 text-xs font-bold text-white md:-top-2 md:-right-2 md:h-8 md:w-8 md:text-sm">
                          2
                        </div>
                      </div>
                      <p className="text-xs font-semibold md:text-sm">
                        {leaderboard[1].user.name}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {leaderboard[1].influence.toLocaleString()} Influence
                      </p>
                    </div>
                  )}

                  {/* 1st Place */}
                  {leaderboard[0] && (
                    <div className="text-center">
                      <div className="relative mb-3 md:mb-4">
                        <Avatar className="mx-auto h-16 w-16 border-2 border-yellow-500 md:h-20 md:w-20 md:border-4">
                          <AvatarImage src={leaderboard[0].user.avatar ?? ""} />
                          <AvatarFallback>
                            {leaderboard[0].user.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-yellow-500 font-bold text-white md:-top-2 md:-right-2 md:h-8 md:w-8">
                          <Trophy className="h-3 w-3 md:h-4 md:w-4" />
                        </div>
                      </div>
                      <p className="text-sm font-semibold md:text-base">
                        {leaderboard[0].user.name}
                      </p>
                      <p className="text-muted-foreground text-xs md:text-sm">
                        {leaderboard[0].influence.toLocaleString()} Influence
                      </p>
                    </div>
                  )}

                  {/* 3rd Place */}
                  {leaderboard[2] && (
                    <div className="text-center">
                      <div className="relative mb-3 md:mb-4">
                        <Avatar className="mx-auto h-12 w-12 border-2 border-amber-600 md:h-16 md:w-16 md:border-4">
                          <AvatarImage src={leaderboard[2].user.avatar ?? ""} />
                          <AvatarFallback>
                            {leaderboard[2].user.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-amber-600 text-xs font-bold text-white md:-top-2 md:-right-2 md:h-8 md:w-8 md:text-sm">
                          3
                        </div>
                      </div>
                      <p className="text-xs font-semibold md:text-sm">
                        {leaderboard[2].user.name}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {leaderboard[2].influence.toLocaleString()} Influence
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Detailed Leaderboard */}
          <Card>
            <CardHeader className="px-4 md:px-6">
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                <BarChart3 className="text-primary h-4 w-4 md:h-5 md:w-5" />
                Detailed Rankings
              </CardTitle>
              <CardDescription className="text-sm">
                Complete leaderboard with influence points and contribution
                stats.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 md:px-6">
              {isLoading ? (
                <div className="flex min-h-[60vh] items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                  Loading Rankings...
                </div>
              ) : (
                <div className="space-y-3 md:space-y-4">
                  {leaderboard?.map((user: LeaderboardUser) => (
                    <div
                      key={user.id}
                      className={`hover:bg-muted/50 flex cursor-pointer items-center justify-between rounded-lg border p-3 transition-colors md:p-4 ${
                        user.rank <= 3 ? "bg-muted/30" : "bg-card"
                      }`}
                    >
                      <div className="flex min-w-0 flex-1 items-center gap-2 md:gap-4">
                        {/* Rank */}
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
                        </div>

                        {/* User Info */}
                        <div className="flex min-w-0 flex-1 items-center gap-2 md:gap-3">
                          <Avatar className="h-8 w-8 flex-shrink-0 md:h-12 md:w-12">
                            <AvatarImage src={user.user.avatar ?? ""} />
                            <AvatarFallback>{user.user.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold md:text-base">
                              {user.user.name}
                            </p>
                            <p className="text-muted-foreground truncate text-xs md:text-sm">
                              {user.user.username}
                            </p>
                            <div className="text-muted-foreground mt-1 flex items-center gap-2 text-xs md:gap-4">
                              <span>
                                {user.projectsCompleted} Projects Completed
                              </span>
                              <span>{user.heartbeats} Heartbeats</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex-shrink-0 text-right">
                        <div className="flex items-center justify-end gap-1 md:gap-2">
                          <span className="text-primary text-sm font-bold md:text-lg">
                            {user.influence.toLocaleString()}
                          </span>
                          <span className="text-muted-foreground text-xs">
                            Influence
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
