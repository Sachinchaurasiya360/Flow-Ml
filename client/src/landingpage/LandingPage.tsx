import React from "react";
import Navbar from "./Navbar";
import Hero from "./Hero";
import StatsSection from "./StatsSection";
import GenAISection from "./GenAISection";
import Features from "./Features";
import TestimonialsSection from "./TestimonialsSection";
import Footer from "./Footer";

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F4F6FF]">
      <Navbar />
      <Hero />
      <StatsSection />
      <GenAISection />
      <Features />
      <TestimonialsSection />
      <Footer />
    </div>
  );
};

export default LandingPage;
