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
    <>
      <div className="relative">
        <Navbar />
        <Hero />
      </div>
      <Stats />
      <About />
      <Services />
      <Rankings />
      <UpcomingTournaments />
      <Notices />
      <Footer />
    </>
  );
}
