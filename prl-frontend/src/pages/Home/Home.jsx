import React, { Suspense, lazy, useEffect, useRef, useState } from "react";
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

/**
 * Mounts heavy below-the-fold sections only when approaching the viewport so
 * initial load stays fast without changing layout, looks, or data.
 */
const LazySection = ({ children, className = "", minHeight = 320 }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (visible) return undefined;
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "120px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [visible]);

  return (
    <div
      ref={ref}
      className={className}
      style={visible ? undefined : { minHeight }}
    >
      {visible ? <Suspense fallback={null}>{children}</Suspense> : null}
    </div>
  );
};

const Home = () => {
  return (
    <div>
      <Suspense fallback={null}>
        <EnquiryForm />
      </Suspense>
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
