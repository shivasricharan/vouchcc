import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import ProblemSection from '@/components/ProblemSection';
import ForensicsSection from '@/components/ForensicsSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import DashboardSection from '@/components/DashboardSection';
import PilotSection from '@/components/PilotSection';
import TrustSection from '@/components/TrustSection';
import WhatsAppSection from '@/components/WhatsAppSection';
import LeadForm from '@/components/LeadForm';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-navy-900">
      <Navbar />
      <HeroSection />
      <ProblemSection />
      <ForensicsSection />
      <HowItWorksSection />
      <DashboardSection />
      <PilotSection />
      <TrustSection />
      <WhatsAppSection />
      <LeadForm />
      <Footer />
    </main>
  );
}
