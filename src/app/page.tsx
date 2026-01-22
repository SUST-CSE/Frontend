import Hero from "@/components/home/Hero";
import Stats from "@/components/home/Stats";
import AboutSection from "@/components/home/AboutSection";
import ResearchAreas from "@/components/home/ResearchAreas";
import DepartmentServices from "@/components/home/DepartmentServices";
import NoticesSection from "@/components/home/NoticesSection";
import EventsSection from "@/components/home/EventsSection";
import BlogSection from "@/components/home/BlogSection";
import SocietySection from "@/components/home/SocietySection";
import AchievementsSection from "@/components/home/AchievementsSection";
import { Box } from "@mui/material";

export default function Home() {
  return (
    <Box>
      <Hero />
      <Stats />
      <AboutSection />
      <ResearchAreas />
      <DepartmentServices />
      <NoticesSection />
      <EventsSection />
      <AchievementsSection />
      <BlogSection />
      <SocietySection />
    </Box>
  );
}
