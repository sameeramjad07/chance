// src/app/components/auth/signin-form.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, ArrowLeft, Zap, Mail } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export function SignInForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      const result = await signIn("google", {
        callbackUrl: "/dashboard",
        redirect: false,
      });
      if (result?.error) {
        toast(`Error: ${result.error}`);
      } else if (result?.url) {
        router.push(result.url);
      }
    } catch (error) {
      toast("Error: Failed to sign in with Google");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: "/",
      });
      if (result?.error) {
        toast(`Error: ${result.error}`);
      } else if (result?.url) {
        router.push(result.url);
      }
    } catch (error) {
      toast("Error: Failed to sign in");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background relative flex min-h-screen items-center justify-center overflow-hidden p-4">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center select-none">
        <div className="text-accent/5 text-[20rem] leading-none font-black tracking-tighter md:text-[25rem] lg:text-[30rem]">
          CHANCE
        </div>
      </div>

      <div className="from-accent/10 to-accent/5 animate-float absolute top-20 left-10 h-72 w-72 rounded-full bg-gradient-to-r blur-3xl"></div>
      <div
        className="from-accent/5 to-accent/10 animate-float absolute right-10 bottom-20 h-96 w-96 rounded-full bg-gradient-to-r blur-3xl"
        style={{ animationDelay: "2s" }}
      ></div>

      <Link href="/" className="absolute top-6 left-6 z-20">
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
      </Link>

      <Card className="border-border/50 bg-card/80 relative z-10 w-full max-w-md shadow-2xl backdrop-blur-xl">
        <CardHeader className="space-y-4 text-center">
          <div className="mb-2 flex items-center justify-center gap-3">
            <div className="from-accent to-accent/80 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <span className="text-gradient text-3xl font-bold">Chance</span>
          </div>
          <CardTitle className="text-foreground text-2xl font-bold">
            Welcome back
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Sign in to your account to continue your creative journey
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <Button
              variant="outline"
              className="border-border/50 hover:border-accent/30 w-full bg-transparent"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              <Mail className="mr-2 h-4 w-4" />
              Sign in with Google
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card text-muted-foreground px-2">
                Or continue with email
              </span>
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-foreground text-sm font-medium"
              >
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-input border-border/50 focus:border-accent focus:ring-accent/20"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-foreground text-sm font-medium"
              >
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-input border-border/50 focus:border-accent focus:ring-accent/20 pr-10"
                  required
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="text-muted-foreground h-4 w-4" />
                  ) : (
                    <Eye className="text-muted-foreground h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                  id="remember"
                  type="checkbox"
                  className="text-accent bg-input border-border focus:ring-accent h-4 w-4 rounded focus:ring-2"
                  disabled={isLoading}
                />
                <Label
                  htmlFor="remember"
                  className="text-muted-foreground text-sm"
                >
                  Remember me
                </Label>
              </div>
              <Link
                href="/forgot-password"
                className="text-accent hover:text-accent/80 text-sm font-medium"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              className="bg-accent hover:bg-accent/90 w-full py-2.5 font-semibold text-white"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="text-muted-foreground text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-accent hover:text-accent/80 font-medium"
            >
              Sign up for free
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
