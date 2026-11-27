import React, { Suspense, lazy, useEffect, useState } from "react";
import LazySection from "../../components/LazySection";
import About from "../Home/About";
import Landingpage from "./Landingpage";

const EnquiryForm = lazy(() => import("../../components/EnquiryForm"));
const ProductShowcase = lazy(() => import("./ProductShowcase"));
const PRL_Journey = lazy(() => import("./Our-journey"));
const HeroSection = lazy(() => import("./HeroSection"));
const OurPartners = lazy(() => import("./TrustedSlider"));
const TestimonialSlider = lazy(() => import("./Testimonial"));
const WhyChooseUs = lazy(() => import("./WhyChooseUs"));
const FeaturesSection = lazy(() => import("./Feature"));
const TeamSection = lazy(() => import("./Our-leadership"));
const ValuedClients = lazy(() => import("./Our-Clients"));
const NewsletterSection = lazy(() => import("./NewsLetter"));

const HomeEnquiry = () => {
  const [openAt, setOpenAt] = useState(null);

  useEffect(() => {
    const deadline = performance.now() + 7000;
    const timer = window.setTimeout(() => setOpenAt(deadline), 5500);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <Suspense fallback={null}>
      {openAt !== null && <EnquiryForm openAt={openAt} />}
    </Suspense>
  );
};

const Home = () => {
  return (
    <div>
      <HomeEnquiry />
      <Landingpage />
      <About />
      <LazySection className="hidden md:block" minHeight={480}>
        <ProductShowcase />
      </LazySection>
      <LazySection minHeight={420}>
        <PRL_Journey />
      </LazySection>
      <LazySection minHeight={480}>
        <HeroSection />
      </LazySection>
      <LazySection minHeight={360}>
        <OurPartners />
      </LazySection>
      <LazySection minHeight={420}>
        <TestimonialSlider />
      </LazySection>
      <LazySection minHeight={420}>
        <WhyChooseUs />
      </LazySection>
      <LazySection minHeight={480}>
        <FeaturesSection />
      </LazySection>
      <LazySection minHeight={480}>
        <TeamSection />
      </LazySection>
      <LazySection minHeight={420}>
        <ValuedClients />
      </LazySection>
      <LazySection minHeight={320}>
        <NewsletterSection />
      </LazySection>
    </div>
  );
};

export default Home;
