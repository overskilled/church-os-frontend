import Hero from "@/components/website/Hero";
import Section1 from "@/components/website/Section1";
import Section2 from "@/components/website/Section2";
import Section3 from "@/components/website/Section3";
import Section4 from "@/components/website/Section4";
import Footer from "@/components/website/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background relative text-muted-foreground capitalize overflow-hidden">
      <Hero />
      
      <Section1 />

      <Section2 />

      <Section3 />

      <Section4 />

      <Footer />
    </div>
  );
}
