import { LandingPage } from "./components/landing-page";
import { AuthenticatedApp } from "./components/authenticated-app";
import { auth } from "@/server/auth";

export default async function HomePage() {
  const session = await auth();
  if (session) {
    return <AuthenticatedApp />;
  }
  return <LandingPage />;
}
