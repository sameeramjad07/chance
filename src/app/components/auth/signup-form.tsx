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
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { z } from "zod";
import { toast } from "sonner";
import { api } from "@/trpc/react";

export function SignUpForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    whatsappNumber: "",
    agreeToTerms: false,
  });

  const signupMutation = api.user.signup.useMutation({
    onSuccess: async () => {
      toast.success("Account created successfully!");
      // Automatically sign in the user after signup
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
        callbackUrl: "/",
      });
      if (result?.error) {
        toast.error(`Sign-in error: ${result.error}`);
      } else if (result?.url) {
        router.push(result.url);
      } else {
        router.push("/");
      }
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreeToTerms) {
      toast.error("You must agree to the Terms of Service and Privacy Policy");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      const validatedData = z
        .object({
          email: z.string().email(),
          firstName: z.string().min(1),
          lastName: z.string().min(1),
          whatsappNumber: z.string().min(10, "WhatsApp number is required"),
          password: z.string().min(6),
        })
        .parse(formData);
      signupMutation.mutate(validatedData);
    } catch (error) {
      toast.error("Error: Invalid input data");
    }
  };

  return (
    <div className="bg-background relative flex min-h-screen items-center justify-center overflow-hidden p-4">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center select-none">
        <div className="text-accent/5 text-[20rem] leading-none font-black tracking-tighter md:text-[25rem] lg:text-[30rem]">
          CHANCE
        </div>
      </div>
      <div className="from-accent/10 to-accent/5 animate-float absolute top-20 right-10 h-72 w-72 rounded-full bg-gradient-to-r blur-3xl"></div>
      <div
        className="from-accent/5 to-accent/10 animate-float absolute bottom-20 left-10 h-96 w-96 rounded-full bg-gradient-to-r blur-3xl"
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
            <span className="text-gradient text-4xl font-bold">CHANCE</span>
          </div>
          <CardTitle className="text-foreground text-2xl font-bold">
            Create your account
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Join thousands of creators building the future together
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="firstName"
                  className="text-foreground text-sm font-medium"
                >
                  First name
                </Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                  className="bg-input border-border/50 focus:border-accent focus:ring-accent/20"
                  required
                  disabled={signupMutation.status === "pending"}
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="lastName"
                  className="text-foreground text-sm font-medium"
                >
                  Last name
                </Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) =>
                    handleInputChange("lastName", e.target.value)
                  }
                  className="bg-input border-border/50 focus:border-accent focus:ring-accent/20"
                  required
                  disabled={signupMutation.status === "pending"}
                />
              </div>
            </div>
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
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="bg-input border-border/50 focus:border-accent focus:ring-accent/20"
                required
                disabled={signupMutation.status === "pending"}
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="whatsappNumber"
                className="text-foreground text-sm font-medium"
              >
                WhatsApp Number
              </Label>
              <Input
                id="whatsappNumber"
                type="tel"
                placeholder="+1234567890"
                value={formData.whatsappNumber}
                onChange={(e) =>
                  handleInputChange("whatsappNumber", e.target.value)
                }
                className="bg-input border-border/50 focus:border-accent focus:ring-accent/20"
                required
                disabled={signupMutation.status === "pending"}
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
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  className="bg-input border-border/50 focus:border-accent focus:ring-accent/20 pr-10"
                  required
                  disabled={signupMutation.status === "pending"}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={signupMutation.status === "pending"}
                >
                  {showPassword ? (
                    <EyeOff className="text-muted-foreground h-4 w-4" />
                  ) : (
                    <Eye className="text-muted-foreground h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="text-foreground text-sm font-medium"
              >
                Confirm password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleInputChange("confirmPassword", e.target.value)
                  }
                  className="bg-input border-border/50 focus:border-accent focus:ring-accent/20 pr-10"
                  required
                  disabled={signupMutation.status === "pending"}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={signupMutation.status === "pending"}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="text-muted-foreground h-4 w-4" />
                  ) : (
                    <Eye className="text-muted-foreground h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <div className="flex h-5 items-center">
                <input
                  id="terms"
                  type="checkbox"
                  checked={formData.agreeToTerms}
                  onChange={(e) =>
                    handleInputChange("agreeToTerms", e.target.checked)
                  }
                  className="text-accent bg-input border-border focus:ring-accent h-4 w-4 rounded focus:ring-2"
                  required
                  disabled={signupMutation.status === "pending"}
                />
              </div>
              <Label
                htmlFor="terms"
                className="text-muted-foreground text-sm leading-5"
              >
                I agree to the{" "}
                <Link
                  href="/terms"
                  className="text-accent hover:text-accent/80 font-medium"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="text-accent hover:text-accent/80 font-medium"
                >
                  Privacy Policy
                </Link>
              </Label>
            </div>
            <Button
              type="submit"
              className="bg-accent hover:bg-accent/90 w-full py-2.5 font-semibold text-white"
              disabled={signupMutation.status === "pending"}
            >
              {signupMutation.status === "pending"
                ? "Creating..."
                : "Create Account"}
            </Button>
          </form>
          <div className="text-muted-foreground text-center text-sm">
            Already have an account?{" "}
            <Link
              href="/signin"
              className="text-accent hover:text-accent/80 font-medium"
            >
              Sign in instead
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
