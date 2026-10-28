import EtfCards from "@/components/EtfCards";
import FeeCalculator from "@/components/FeeCalculator";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import LeadForm from "@/components/LeadForm";

export default function Home() {
  return (
    <>
      <Hero />
      <FeeCalculator />
      <EtfCards />
      <LeadForm />
      <Footer />
    </>
  );
}
