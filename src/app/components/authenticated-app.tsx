"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import {
  Plus,
  Rocket,
  Heart,
  Trophy,
  Settings,
  Bell,
  Search,
  Filter,
  LogOut,
} from "lucide-react";
import { ProjectsTab } from "@/app/components/tabs/projects-tab";
import { HeartbeatsTab } from "@/app/components/tabs/heartbeats-tab";
import { SpotlightTab } from "@/app/components/tabs/spotlight-tab";
import { CreateModal } from "@/app/components/modals/create-modal";

type TabType = "projects" | "heartbeats" | "spotlight";

export function AuthenticatedApp() {
  const [activeTab, setActiveTab] = useState<TabType>("projects");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { data: session, status } = useSession(); // Get session data

  const tabs = [
    { id: "projects" as TabType, label: "Projects", icon: Rocket },
    { id: "heartbeats" as TabType, label: "Heartbeats", icon: Heart },
    { id: "spotlight" as TabType, label: "Spotlight", icon: Trophy },
  ];

  // Function to handle sign-out
  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/signin" });
  };

  // Fallback for loading state
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-background min-h-screen">
      <header className="border-border bg-card/50 sticky top-0 z-50 border-b backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <span className="text-gradient text-2xl font-bold">CHANCE</span>
            </div>

            <div className="mx-8 hidden max-w-md flex-1 items-center gap-2 lg:flex">
              <div className="relative flex-1">
                <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                <input
                  type="text"
                  placeholder="Search projects, users, or heartbeats..."
                  className="bg-muted focus:ring-ring w-full rounded-lg border-0 py-2 pr-4 pl-10 text-sm focus:ring-2"
                />
              </div>
              <Button size="sm" variant="outline">
                <Filter className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <Button
                size="sm"
                variant="outline"
                className="hidden bg-transparent sm:flex"
              >
                <Bell className="h-4 w-4" />
              </Button>
              <Link href="/profile">
                <Button
                  size="sm"
                  variant="outline"
                  className="hidden cursor-pointer bg-transparent sm:flex"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </Link>
              <div className="relative flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={session?.user?.image ?? "/diverse-user-avatars.png"}
                  />
                  <AvatarFallback>
                    {session?.user?.name?.slice(0, 2).toUpperCase() ?? "JD"}
                  </AvatarFallback>
                </Avatar>
                <span className="text-foreground hidden text-sm sm:inline">
                  {session?.user?.name ?? "User"}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-transparent"
                  onClick={handleSignOut}
                  title="Sign out"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-4 hidden items-center justify-between md:flex">
            <nav className="flex items-center gap-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>

            <Button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Create
            </Button>
          </div>
        </div>
      </header>

      <div className="border-border bg-card/30 border-b backdrop-blur-sm lg:hidden">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-muted focus:ring-ring w-full rounded-lg border-0 py-2 pr-4 pl-10 text-sm focus:ring-2"
              />
            </div>
            <Button size="sm" variant="outline">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 pb-24 md:pb-6">
        {activeTab === "projects" && (
          <ProjectsTab onCreate={() => setShowCreateModal(true)} />
        )}
        {activeTab === "heartbeats" && <HeartbeatsTab />}
        {activeTab === "spotlight" && <SpotlightTab />}
      </main>

      {/* Create Modal */}
      <CreateModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onCreate={() => {
          // Optional: refetch or trigger update here if needed globally
        }}
      />

      <div className="bg-card/95 border-border fixed right-0 bottom-0 left-0 z-50 border-t backdrop-blur-sm md:hidden">
        <div className="grid grid-cols-4 gap-1 p-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center gap-1 rounded-lg p-3 text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs">{tab.label}</span>
              </button>
            );
          })}
          <button
            onClick={() => setShowCreateModal(true)}
            className="text-muted-foreground hover:text-foreground hover:bg-muted flex flex-col items-center gap-1 rounded-lg p-3 text-xs font-medium transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span className="text-xs">Create</span>
          </button>
        </div>
      </div>
    </div>
  );
}
