import Navbar from "@/Components/navbar/Navbar";
import Hero from "@/Components/home/Hero";
import Stats from "@/Components/home/Stats";
import About from "@/Components/home/About";
import Services from "@/Components/home/Servvices";
import Rankings from "@/Components/home/Rankings";
import UpcomingTournaments from "@/Components/home/UpcomingTournaments";
import Notices from "@/Components/home/Notices";
import CTA from "@/Components/home/CTA";
import Footer from "@/Components/footer/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Stats />
      <About />
      <Services />
      <Rankings />
      <UpcomingTournaments />
      <Notices />
      <CTA />
      <Footer />
    </>
  );
}
