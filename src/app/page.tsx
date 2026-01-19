import Hero from "@/components/home/Hero";
import Stats from "@/components/home/Stats";
import NoticesSection from "@/components/home/NoticesSection";
import EventsSection from "@/components/home/EventsSection";
import SocietySection from "@/components/home/SocietySection";
import { Box } from "@mui/material";

export default function Home() {
  return (
    <Box>
      <Hero />
      <Stats />
      <NoticesSection />
      <EventsSection />
      <SocietySection />
    </Box>
  );
}
