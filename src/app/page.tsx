import Hero from "@/components/home/Hero";
import Stats from "@/components/home/Stats";
import { Box } from "@mui/material";

export default function Home() {
  return (
    <Box>
      <Hero />
      <Stats />
      {/* Other sections like Discoveries, News, etc. will go here */}
    </Box>
  );
}
