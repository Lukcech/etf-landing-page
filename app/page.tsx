import EtfCards from "@/components/EtfCards";
import FeeCalculator from "@/components/FeeCalculator";
import Hero from "@/components/Hero";
import LeadForm from "@/components/LeadForm";

export default function Home() {
  return (
    <>
      <Hero />
      <FeeCalculator />
      <EtfCards />
      <LeadForm />
    </>
  );
}
