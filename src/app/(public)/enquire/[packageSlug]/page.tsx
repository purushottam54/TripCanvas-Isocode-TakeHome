import { notFound } from "next/navigation";
import { getPackageBySlug } from "@/lib/db/store";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { EnquiryForm } from "@/components/public/EnquiryForm";
import { Sparkles } from "lucide-react";

interface PackageEnquiryPageProps {
  params: Promise<{ packageSlug: string }>;
}

export default async function PackageEnquiryPage({ params }: PackageEnquiryPageProps) {
  const { packageSlug } = await params;
  const pkg = await getPackageBySlug(packageSlug);

  if (!pkg || !pkg.publishedVersion) {
    notFound();
  }

  const version = pkg.publishedVersion;

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F5EF]">
      <Header />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#173F35]/10 text-xs font-semibold text-[#173F35]">
            <Sparkles className="w-3.5 h-3.5 text-[#C58B63]" />
            Direct Package Enquiry
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#173F35] tracking-tight">
            Reserve Your Itinerary
          </h1>
          <p className="text-xs sm:text-sm text-[#252A27]/70 leading-relaxed">
            Submit your travel details for <strong>{version.title}</strong>. Our Kochi desk will check seasonal accommodation allocations and child bed policies.
          </p>
        </div>

        <EnquiryForm
          packageId={pkg.id}
          packageSlug={pkg.slug}
          packageTitle={version.title}
          defaultDestination={version.destination}
        />
      </main>

      <Footer />
    </div>
  );
}

