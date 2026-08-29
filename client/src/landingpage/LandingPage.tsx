import React from "react";
import Navbar from "./Navbar";
import Hero from "./Hero";
import Features from "./Features";
import TestimonialsSection from "./TestimonialsSection";
import FAQ from "./FAQ";
import Footer from "./Footer";

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F4F6FF]">
      <Navbar />
      <Hero />
      <Features />
      <TestimonialsSection />
      <FAQ />
      <Footer />
    </div>
  );
};

export default LandingPage;
