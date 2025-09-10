import { LandingPage } from "./components/landing-page";
import { AuthenticatedApp } from "./components/authenticated-app";

// Mock session check - replace with your actual auth logic
const getSession = async () => {
  // This would typically check your auth provider (NextAuth, Clerk, etc.)
  return null; // Return user session or null
};

export default async function HomePage() {
  const session = false;

  if (session) {
    return <AuthenticatedApp />;
  }

  return <LandingPage />;
}
