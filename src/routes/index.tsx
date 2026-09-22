import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/home/hero";
import { TrustBar } from "@/components/home/trust-bar";
import { ServicesGrid } from "@/components/home/services-grid";
import { WhyChoose } from "@/components/home/why-choose";
import { AboutPreview } from "@/components/home/about-preview";
import { ProjectsShowcase } from "@/components/home/projects-showcase";
import { Testimonials } from "@/components/home/testimonials";
import { FAQ } from "@/components/home/faq";
import { BlogPreview } from "@/components/home/blog-preview";
import { ContactPreview } from "@/components/home/contact-preview";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <>
      <Hero />
      <TrustBar />
      <ServicesGrid />
      <WhyChoose />
      <AboutPreview />
      <ProjectsShowcase />
      <Testimonials />
      <FAQ />
      <BlogPreview />
      <ContactPreview />
    </>
  );
}
