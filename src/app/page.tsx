import Navbar from "@/Components/navbar/Navbar";
import Hero from "@/Components/home/Hero";
import Stats from "@/Components/home/Stats";
import About from "@/Components/home/About";
import Services from "@/Components/home/Servvices";
import Rankings from "@/Components/home/Rankings";
import UpcomingTournaments from "@/Components/home/UpcomingTournaments";
import Notices from "@/Components/home/Notices";
import Footer from "@/Components/footer/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7f8fa] text-slate-950">
      {/* Navigation */}
      <Navbar />

      {/* Hero */}
      <Hero />

      {/* Statistics */}
      <Stats />

      {/* About Association */}
      <About />

      {/* Services */}
      <Services />

      {/* Rankings */}
      <Rankings />

      {/* Upcoming Tournaments */}
      <UpcomingTournaments />

      {/* Notices */}
      <Notices />

      {/* Footer / Contact */}
      <Footer />
    </main>
  );
}