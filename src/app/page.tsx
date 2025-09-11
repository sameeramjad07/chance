import { LandingPage } from "./components/landing-page";
import { AuthenticatedApp } from "./components/authenticated-app";
import { auth } from "@/server/auth";

export default async function HomePage() {
  const session = await auth();
  console.log("Session:", session);

  if (session?.user?.id) {
    return <AuthenticatedApp />;
  }

  return <LandingPage />;
}
