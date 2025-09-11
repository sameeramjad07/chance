"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Users,
  Zap,
  Trophy,
  Heart,
  Rocket,
  Sparkles,
  Globe,
  Target,
  Calendar,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

export function LandingPage() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const featuredProjects = [
    {
      id: "1",
      title: "EcoTrack - Carbon Footprint App",
      description:
        "Building a mobile app to help individuals track and reduce their carbon footprint through gamified daily challenges.",
      category: "Environment",
      teamSize: 5,
      effort: "3-6 months",
      likes: 234,
      creator: "Sarah Chen",
      creatorAvatar: "/sarah-avatar.png",
      impact: "Help 10,000+ users reduce their carbon footprint by 30%",
    },
    {
      id: "2",
      title: "AI Learning Assistant",
      description:
        "Developing an AI-powered learning platform that adapts to individual learning styles and provides personalized education paths.",
      category: "Education",
      teamSize: 8,
      effort: "6-12 months",
      likes: 189,
      creator: "Alex Rodriguez",
      creatorAvatar: "/diverse-user-avatars.png",
      impact: "Transform education for 50,000+ students globally",
    },
    {
      id: "3",
      title: "Community Garden Network",
      description:
        "Creating a platform to connect urban communities with available spaces for community gardens and sustainable food production.",
      category: "Community",
      teamSize: 4,
      effort: "2-4 months",
      likes: 156,
      creator: "Maya Patel",
      creatorAvatar: "/diverse-user-avatars.png",
      impact: "Establish 100+ community gardens in urban areas",
    },
  ];

  return (
    <div className="bg-background min-h-screen overflow-hidden">
      <header className="glass-effect fixed top-0 z-50 w-full border-b border-white/10">
        <div className="container mx-auto px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-[#6366f1]">CHANCE</span>
              <Badge
                variant="secondary"
                className="hidden border-purple-500 bg-purple-500 text-white sm:flex"
              >
                Beta
              </Badge>
            </div>
            <nav className="hidden items-center gap-8 lg:flex">
              <a
                href="#features"
                className="text-foreground/80 hover:text-foreground transition-colors"
              >
                Features
              </a>
              <a
                href="#projects"
                className="text-foreground/80 hover:text-foreground transition-colors"
              >
                Projects
              </a>
              <a
                href="#spotlight"
                className="text-foreground/80 hover:text-foreground transition-colors"
              >
                Spotlight
              </a>
            </nav>
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Sign In → /signin */}
              <Link href="/signin" passHref>
                <Button
                  asChild
                  variant="ghost"
                  className="text-foreground hover:bg-accent/10 px-2 text-sm sm:px-4 sm:text-base"
                >
                  <span>Sign In</span>
                </Button>
              </Link>

              {/* Get Started → /signup */}
              <Link href="/signup" passHref>
                <Button
                  asChild
                  className="bg-accent hover:bg-accent/90 px-3 text-sm text-white shadow-lg sm:px-4 sm:text-base"
                >
                  <span className="flex items-center">
                    Get Started
                    <ArrowRight className="ml-1 h-3 w-3 sm:ml-2 sm:h-4 sm:w-4" />
                  </span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 sm:px-6">
        {/* Animated background elements */}
        <div className="absolute inset-0 -z-10">
          <div className="from-accent/20 to-secondary/20 animate-float absolute top-20 left-4 h-48 w-48 rounded-full bg-gradient-to-r blur-3xl sm:left-10 sm:h-72 sm:w-72"></div>
          <div
            className="from-secondary/15 to-accent/15 animate-float absolute right-4 bottom-20 h-64 w-64 rounded-full bg-gradient-to-r blur-3xl sm:right-10 sm:h-96 sm:w-96"
            style={{ animationDelay: "2s" }}
          ></div>
          <div className="from-accent/5 to-secondary/5 absolute top-1/2 left-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-gradient-to-r blur-3xl sm:h-[800px] sm:w-[800px]"></div>
        </div>

        <div className="relative z-10 container mx-auto max-w-6xl text-center">
          <div className="animate-float mt-24 mb-6 sm:mb-8">
            <Badge
              variant="secondary"
              className="from-accent/10 to-secondary/10 text-accent border-accent/20 bg-gradient-to-r px-4 py-2 text-xs font-medium sm:px-6 sm:text-sm"
            >
              <Sparkles className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              The Future of Creative Collaboration
            </Badge>
          </div>

          <h1 className="mb-8 text-4xl leading-none font-bold sm:mb-8 sm:text-4xl md:text-5xl lg:text-8xl">
            <span className="text-foreground block">Where</span>
            <span className="text-gradient animate-gradient block">Ideas</span>
            <span className="text-foreground block">Come Alive</span>
          </h1>

          <p className="text-muted-foreground mx-auto mb-8 max-w-3xl px-4 text-lg leading-relaxed font-light sm:mb-12 sm:text-xl md:text-2xl">
            Join the most innovative platform where creators collaborate, share
            progress through heartbeats, and build influence that matters in the
            digital age.
          </p>

          <div className="mb-12 flex flex-col items-center justify-center gap-4 px-4 sm:mb-16 sm:flex-row sm:gap-6">
            <Link href="/signup" passHref>
              <Button
                size="lg"
                className="bg-accent hover:bg-accent/90 hover:shadow-accent/25 w-full transform px-8 py-4 text-base font-semibold text-white shadow-2xl transition-all duration-300 hover:scale-105 sm:w-auto sm:px-12 sm:py-6 sm:text-lg"
              >
                Start Your Journey
                <ArrowRight className="ml-2 h-4 w-4 sm:ml-3 sm:h-5 sm:w-5" />
              </Button>
            </Link>
            <Link href="/projects" passHref>
              <Button
                size="lg"
                variant="outline"
                className="border-accent/30 text-accent hover:bg-accent/5 w-full border-2 bg-transparent px-8 py-4 text-base font-semibold backdrop-blur-sm sm:w-auto sm:px-12 sm:py-6 sm:text-lg"
              >
                Explore Projects
                <Globe className="ml-2 h-4 w-4 sm:ml-3 sm:h-5 sm:w-5" />
              </Button>
            </Link>
          </div>

          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 px-4 sm:grid-cols-3 sm:gap-8">
            <div className="text-center">
              <div className="text-gradient mb-2 text-3xl font-bold sm:text-4xl md:text-5xl">
                10K+
              </div>
              <div className="text-muted-foreground text-sm font-medium sm:text-base">
                Active Creators
              </div>
            </div>
            <div className="text-center">
              <div className="text-gradient mb-2 text-3xl font-bold sm:text-4xl md:text-5xl">
                500+
              </div>
              <div className="text-muted-foreground text-sm font-medium sm:text-base">
                Projects Launched
              </div>
            </div>
            <div className="text-center">
              <div className="text-gradient mb-2 text-3xl font-bold sm:text-4xl md:text-5xl">
                1M+
              </div>
              <div className="text-muted-foreground text-sm font-medium sm:text-base">
                Heartbeats Shared
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="relative px-6 py-32">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-20 text-center">
            <Badge
              variant="outline"
              className="border-accent/30 text-accent mb-6"
            >
              <Target className="mr-2 h-4 w-4" />
              Platform Features
            </Badge>
            <h2 className="text-foreground mb-6 text-5xl font-bold text-balance md:text-6xl">
              Everything You Need to
              <span className="text-gradient"> Succeed</span>
            </h2>
            <p className="text-muted-foreground mx-auto max-w-3xl text-xl leading-relaxed">
              Discover, create, and contribute to groundbreaking projects while
              building your influence in a thriving creative community.
            </p>
          </div>

          {/* Asymmetrical feature grid */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Large feature card */}
            <div className="group lg:col-span-8">
              <div className="from-card to-muted/50 border-border/50 hover:border-accent/30 relative h-full overflow-hidden rounded-3xl border bg-gradient-to-br p-8 transition-all duration-500 md:p-12">
                <div className="from-accent/20 to-secondary/20 absolute top-0 right-0 h-32 w-32 rounded-full bg-gradient-to-br blur-2xl transition-transform duration-700 group-hover:scale-150"></div>
                <div className="relative z-10">
                  <div className="from-accent to-secondary mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br transition-transform duration-300 group-hover:scale-110">
                    <Rocket className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-foreground mb-4 text-3xl font-bold md:text-4xl">
                    Project Hub
                  </h3>
                  <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
                    Discover amazing projects across every category imaginable.
                    Join teams that align with your passion and skills, or start
                    your own revolutionary idea.
                  </p>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="flex items-center gap-3">
                      <div className="bg-accent h-2 w-2 rounded-full"></div>
                      <span className="text-foreground">
                        Smart project matching
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-secondary h-2 w-2 rounded-full"></div>
                      <span className="text-foreground">
                        Real-time collaboration
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-accent h-2 w-2 rounded-full"></div>
                      <span className="text-foreground">
                        Advanced filtering
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-secondary h-2 w-2 rounded-full"></div>
                      <span className="text-foreground">Community voting</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Two smaller cards */}
            <div className="space-y-8 lg:col-span-4">
              <div className="group from-card to-muted/50 border-border/50 hover:border-accent/30 relative overflow-hidden rounded-3xl border bg-gradient-to-br p-8 transition-all duration-500">
                <div className="from-accent/20 to-secondary/20 absolute -top-4 -right-4 h-24 w-24 rounded-full bg-gradient-to-br blur-xl transition-transform duration-500 group-hover:scale-125"></div>
                <div className="relative z-10">
                  <div className="from-accent to-secondary mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br transition-transform duration-300 group-hover:scale-110">
                    <Heart className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-foreground mb-3 text-2xl font-bold">
                    Heartbeats
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Share your journey through heartbeats - progress updates
                    that keep the community engaged and inspired.
                  </p>
                </div>
              </div>

              <div className="group from-card to-muted/50 border-border/50 hover:border-accent/30 relative overflow-hidden rounded-3xl border bg-gradient-to-br p-8 transition-all duration-500">
                <div className="from-secondary/20 to-accent/20 absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-gradient-to-br blur-xl transition-transform duration-500 group-hover:scale-125"></div>
                <div className="relative z-10">
                  <div className="from-secondary to-accent mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br transition-transform duration-300 group-hover:scale-110">
                    <Trophy className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-foreground mb-3 text-2xl font-bold">
                    Spotlight
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Build influence through meaningful contributions and climb
                    the community leaderboard to unlock exclusive opportunities.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="projects" className="relative px-4 py-16 sm:px-6 sm:py-32">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-12 text-center sm:mb-20">
            <Badge
              variant="outline"
              className="border-accent/30 text-accent mb-4 sm:mb-6"
            >
              <Rocket className="mr-2 h-4 w-4" />
              Featured Projects
            </Badge>
            <h2 className="text-foreground mb-4 text-3xl font-bold text-balance sm:mb-6 sm:text-5xl md:text-6xl">
              Discover Amazing
              <span className="text-gradient"> Projects</span>
            </h2>
            <p className="text-muted-foreground mx-auto max-w-3xl text-lg leading-relaxed sm:text-xl">
              Join innovative projects that are making a real impact.
              Collaborate with passionate creators and build something
              extraordinary together.
            </p>
          </div>

          <div className="mb-12 grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.map((project) => (
              <div
                key={project.id}
                className="group from-card to-muted/50 border-border/50 hover:border-accent/30 relative overflow-hidden rounded-2xl border bg-gradient-to-br p-6 transition-all duration-500 sm:rounded-3xl sm:p-8"
              >
                <div className="from-accent/20 to-secondary/20 absolute top-0 right-0 h-20 w-20 rounded-full bg-gradient-to-br blur-2xl transition-transform duration-700 group-hover:scale-150 sm:h-32 sm:w-32"></div>

                <div className="relative z-10">
                  <div className="mb-4 flex items-start justify-between">
                    <Badge
                      variant="secondary"
                      className="bg-accent/10 text-accent border-accent/20 text-xs"
                    >
                      {project.category}
                    </Badge>
                    <div className="text-muted-foreground flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      <span className="text-sm">{project.likes}</span>
                    </div>
                  </div>

                  <h3 className="text-foreground group-hover:text-accent mb-3 text-xl font-bold transition-colors sm:text-2xl">
                    {project.title}
                  </h3>

                  <p className="text-muted-foreground mb-4 line-clamp-3 text-sm leading-relaxed sm:text-base">
                    {project.description}
                  </p>

                  <div className="mb-6 space-y-2">
                    <div className="text-muted-foreground flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4" />
                      <span>Team of {project.teamSize}</span>
                    </div>
                    <div className="text-muted-foreground flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4" />
                      <span>{project.effort}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="from-accent to-secondary flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br">
                        <span className="text-xs font-semibold text-white">
                          {project.creator
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <span className="text-foreground text-sm font-medium">
                        {project.creator}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-accent/30 text-accent hover:bg-accent/5 cursor-pointer bg-transparent"
                    >
                      View Project
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/projects" passHref>
              <Button
                size="lg"
                variant="outline"
                className="border-accent/30 text-accent hover:bg-accent/5 border-2 bg-transparent px-8 py-4 text-base font-semibold backdrop-blur-sm sm:px-12 sm:py-6 sm:text-lg"
              >
                View All Projects
                <ArrowRight className="ml-2 h-4 w-4 sm:ml-3 sm:h-5 sm:w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-border/50 bg-card/30 border-t px-6 py-12 backdrop-blur-sm">
        <div className="container mx-auto">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-3">
              <div className="from-accent to-secondary flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <span className="text-gradient text-xl font-bold">Chance</span>
            </div>
            <div className="text-muted-foreground flex items-center gap-8 text-sm">
              <a href="#" className="hover:text-foreground transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Support
              </a>
            </div>
            <p className="text-muted-foreground text-sm">
              © 2024 Chance. Empowering creative collaboration.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
