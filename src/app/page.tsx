
import Hero from "@/Components/home/Hero";
import HomeHighlights from "@/Components/home/HomeHighlights";
import About from "@/Components/home/About";
import Rankings from "@/Components/home/Rankings";
import UpcomingTournaments from "@/Components/home/UpcomingTournaments";
import News from "@/Components/home/News";


export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7f8fa] text-slate-950">


      <Hero />

      <HomeHighlights />

      <About />

      <Rankings />

      <News />

      {/* <UpcomingTournaments /> */}

    </main>
  );
}