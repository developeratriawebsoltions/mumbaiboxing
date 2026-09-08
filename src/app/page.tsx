import Navbar from "@/Components/navbar/Navbar";
import Hero from "@/Components/home/Hero";
import Stats from "@/Components/home/Stats";
import About from "@/Components/home/About";
import Rankings from "@/Components/home/Rankings";
import UpcomingTournaments from "@/Components/home/UpcomingTournaments";
import News from "@/Components/home/News";
import Footer from "@/Components/footer/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7f8fa] text-slate-950">
      <Navbar />

      <Hero />

      <Stats />

      <About />

      <Rankings />

      <UpcomingTournaments />

      <News />

      <Footer />
    </main>
  );
}