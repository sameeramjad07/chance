"use client";

import { useParams } from "next/navigation";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  MessageCircle,
  Calendar,
  Eye,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

export default function HeartbeatDetailPage() {
  const { id } = useParams<{ id: string }>();

  // Fetch heartbeat
  const {
    data: heartbeat,
    isLoading,
    error,
  } = api.heartbeat.getById.useQuery(id, {
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="text-accent h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <AlertCircle className="text-destructive mx-auto h-12 w-12" />
          <p className="text-foreground mt-4 text-lg">{error.message}</p>
          <Link href="/projects">
            <Button
              variant="outline"
              className="border-accent/30 text-accent hover:bg-accent/5 mt-4"
            >
              Back to Projects
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!heartbeat) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <AlertCircle className="text-destructive mx-auto h-12 w-12" />
          <p className="text-foreground mt-4 text-lg">Heartbeat not found</p>
          <Link href="/projects">
            <Button
              variant="outline"
              className="border-accent/30 text-accent hover:bg-accent/5 mt-4"
            >
              Back to Projects
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen px-4 py-16 sm:px-6 sm:py-24">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <Link href="/projects">
            <Button
              variant="outline"
              className="border-accent/30 text-accent hover:bg-accent/5"
            >
              See All Projects
            </Button>
          </Link>
          <Badge
            variant="secondary"
            className="bg-accent/10 text-accent border-accent/20"
          >
            {heartbeat.visibility}
          </Badge>
        </div>

        {/* Heartbeat Card */}
        <div className="group from-card to-muted/50 border-border/50 hover:border-accent/30 relative overflow-hidden rounded-3xl border bg-gradient-to-br p-6 sm:p-8">
          <div className="from-accent/20 to-secondary/20 absolute top-0 right-0 h-32 w-32 rounded-full bg-gradient-to-br blur-2xl transition-transform duration-700 group-hover:scale-150"></div>
          <div className="relative z-10">
            {/* User Info */}
            <div className="mb-4 flex items-center gap-3">
              {heartbeat.user.profileImageUrl ? (
                <img
                  src={heartbeat.user.profileImageUrl}
                  alt={heartbeat.user.name ?? heartbeat.user.username ?? "User"}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              ) : (
                <div className="from-accent to-secondary flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br">
                  <span className="text-sm font-semibold text-white">
                    {(heartbeat.user.name ?? heartbeat.user.username ?? "U")
                      .slice(0, 2)
                      .toUpperCase()}
                  </span>
                </div>
              )}
              <div>
                <p className="text-foreground font-semibold">
                  {heartbeat.user.name ??
                    heartbeat.user.username ??
                    "Anonymous"}
                </p>
                {heartbeat.user.username && (
                  <p className="text-muted-foreground text-sm">
                    @{heartbeat.user.username}
                  </p>
                )}
              </div>
            </div>

            {/* Content */}
            <p className="text-foreground mb-4 text-lg leading-relaxed">
              {heartbeat.content}
            </p>

            {/* Media */}
            {heartbeat.imageUrl && (
              <div className="mb-4">
                <img
                  src={heartbeat.imageUrl}
                  alt="Heartbeat media"
                  width={600}
                  height={400}
                  className="rounded-lg object-cover"
                />
              </div>
            )}
            {heartbeat.videoUrl && (
              <div className="mb-4">
                <video
                  src={heartbeat.videoUrl}
                  controls
                  className="w-full rounded-lg"
                />
              </div>
            )}

            {/* Meta Info */}
            <div className="text-muted-foreground mb-4 flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{new Date(heartbeat.createdAt).toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span>{heartbeat.visibility}</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                <span>{heartbeat.likes} likes</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                <span>{heartbeat.comments} comments</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
