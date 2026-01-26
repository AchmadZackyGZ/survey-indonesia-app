import Hero from "@/components/home/Hero";
import LatestPublications from "@/components/home/LatestPublications";
import LatestSurveys from "@/components/home/LatestSurveys";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex-1">
        <Hero />
        <LatestSurveys />
        <LatestPublications />
      </main>
    </div>
  );
}
