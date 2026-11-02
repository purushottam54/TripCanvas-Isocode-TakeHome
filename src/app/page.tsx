import { getPublishedPackages } from "@/lib/db/store";
import { Header } from "@/components/public/Header";
import { Hero } from "@/components/public/Hero";
import { Destinations } from "@/components/public/Destinations";
import { FeaturedPackages } from "@/components/public/FeaturedPackages";
import { Experiences } from "@/components/public/Experiences";
import { Footer } from "@/components/public/Footer";

export const revalidate = 60; // ISR cache revalidation

export default async function HomePage() {
  const publishedPackages = await getPublishedPackages();

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F5EF]">
      <Header />
      <main className="flex-1">
        <Hero />
        <Destinations />
        <FeaturedPackages packages={publishedPackages} />
        <Experiences />
      </main>
      <Footer />
    </div>
  );
}
