import logoVideo from "../../assets/videos/prllogovideo.mp4";
import redLionVideo from "../../assets/videos/parida-red-lion-video.mp4";
import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const HERO_POSTER = "/assets/vedios/prllogovideo-poster.webp";

// --- Desktop Data ---
const SLIDE_DATA_DESKTOP = [
  { id: 1, type: "video", src: logoVideo, poster: HERO_POSTER },
  { id: 2, type: "video", src: redLionVideo, poster: "/assets/banners/prlhomepagebanner.jpg" },
  { id: 3, type: "image", src: "/assets/banners/prlhomepagebanner.jpg" },
  { id: 4, type: "image", src: "/assets/banners/slider/homepagebanner2.jpg" },
  { id: 5, type: "image", src: "/assets/banners/PARIDA2.jpg" },
];

// --- Mobile Data ---
const SLIDE_DATA_MOBILE = [
  { id: 1, type: "video", src: logoVideo, poster: HERO_POSTER },
  { id: 2, type: "video", src: redLionVideo, poster: "/assets/banners/mobile-view-banners/mobile-view-bannerprl.jpg" },
  {
    id: 3,
    type: "image",
    src: "/assets/banners/mobile-view-banners/mobile-view-bannerprl.jpg",
  },
  {
    id: 4,
    type: "image",
    src: "/assets/banners/mobile-view-banners/mobile-view-bannerprl2.jpg",
  },
  {
    id: 5,
    type: "image",
    src: "/assets/banners/mobile-view-banners/mobile-view-bannerprl3.jpg",
  },
];

const Landingpage = () => {
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(min-width: 768px)").matches
      : true,
  );

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = (e) => setIsDesktop(e.matches);
    setIsDesktop(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <div className="mt-10 bg-gray-900 text-white">
      {isDesktop ? (
        <DesktopBanner slides={SLIDE_DATA_DESKTOP} />
      ) : (
        <MobileBanner slides={SLIDE_DATA_MOBILE} />
      )}
    </div>
  );
};

// ==============================================================
// 1. MOBILE BANNER COMPONENT
// ==============================================================
const MobileBanner = ({ slides }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [videoStreamReady, setVideoStreamReady] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const videoRefs = useRef([]);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const enable = () => setVideoStreamReady(true);
    const events = ["pointerdown", "scroll", "keydown", "touchstart", "mousemove"];
    events.forEach((ev) =>
      window.addEventListener(ev, enable, { once: true, passive: true }),
    );
    const t = window.setTimeout(enable, 9500);
    return () => {
      window.clearTimeout(t);
      events.forEach((ev) => window.removeEventListener(ev, enable));
    };
  }, []);

  const MOBILE_HEIGHT_CLASS = "h-[300px]";
  const MOBILE_WIDTH_CLASS = "w-full";

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };
  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    videoRefs.current.forEach((video) => {
      if (video) {
        video.pause();
      }
    });

    const currentSlide = slides[currentIndex];

    if (currentSlide.type === "video") {
      if (!videoStreamReady) return undefined;
      const video = videoRefs.current[currentIndex];
      if (video) {
        video.currentTime = 0;
        video.play().catch(() => {});
        video.addEventListener("ended", nextSlide, { once: true });
      }
    } else {
      timeoutRef.current = setTimeout(nextSlide, 3000);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [currentIndex, slides, videoStreamReady]);

  const minSwipeDistance = 50;
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) nextSlide();
    if (distance < -minSwipeDistance) prevSlide();
  };

  return (
    <div
      className={`relative ${MOBILE_WIDTH_CLASS} ${MOBILE_HEIGHT_CLASS} overflow-hidden bg-black group`}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div
        className="w-full h-full flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slides.map((slide, index) => {
          const isActive = index === currentIndex;
          return (
            <div key={slide.id} className="min-w-full h-full relative">
              {slide.type === "video" ? (
                <>
                  {slide.poster && (
                    <img
                      src={slide.poster}
                      alt="PRL Window Machinery Banner"
                      fetchPriority="high"
                      className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                    />
                  )}
                  <video
                    ref={(el) => (videoRefs.current[index] = el)}
                    src={isActive && videoStreamReady ? slide.src : undefined}
                    poster={slide.poster}
                    preload={isActive && videoStreamReady ? "metadata" : "none"}
                    onCanPlay={(e) => {
                      e.currentTarget.style.opacity = "1";
                    }}
                    onError={nextSlide}
                    className="relative w-full h-full object-cover opacity-0 transition-opacity duration-300"
                    muted
                    autoPlay={isActive && videoStreamReady}
                    playsInline
                  />
                </>
              ) : (
                <img
                  src={isActive || Math.abs(index - currentIndex) <= 1 && currentIndex > 0 ? slide.src : undefined}
                  alt={`PRL Mobile Banner ${index + 1}`}
                  loading={index === 0 ? "eager" : "lazy"}
                  decoding="async"
                  className="w-full h-full object-cover select-none"
                  draggable="false"
                />
              )}
              <div className="absolute inset-0 bg-black/10" />
            </div>
          );
        })}
      </div>

      {/* Mobile Dots */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex gap-1">
        {slides.map((_, idx) => (
          <button
            key={idx}
            type="button"
            aria-label={`Go to slide ${idx + 1}`}
            onClick={() => setCurrentIndex(idx)}
            className="min-w-[24px] min-h-[24px] flex items-center justify-center p-1"
          >
            <span
              className={`block transition-all duration-300 h-2 rounded-full ${
                currentIndex === idx ? "w-6 bg-red-600" : "w-2 bg-white/60"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

// ==============================================================
// 2. DESKTOP BANNER COMPONENT
// ==============================================================
const DesktopBanner = ({ slides }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [videoStreamReady, setVideoStreamReady] = useState(false);
  const videoRefs = useRef([]);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const enable = () => setVideoStreamReady(true);
    const events = ["pointerdown", "scroll", "keydown", "touchstart", "mousemove"];
    events.forEach((ev) =>
      window.addEventListener(ev, enable, { once: true, passive: true }),
    );
    const t = window.setTimeout(enable, 9500);
    return () => {
      window.clearTimeout(t);
      events.forEach((ev) => window.removeEventListener(ev, enable));
    };
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };
  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    videoRefs.current.forEach((video) => {
      if (video) {
        video.pause();
      }
    });

    const currentSlide = slides[currentIndex];

    if (currentSlide.type === "video") {
      if (!videoStreamReady) return undefined;
      const video = videoRefs.current[currentIndex];
      if (video) {
        video.currentTime = 0;
        video.play().catch(() => {});
        video.addEventListener("ended", nextSlide, { once: true });
      }
    } else {
      timeoutRef.current = setTimeout(nextSlide, 3000);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [currentIndex, slides, videoStreamReady]);

  return (
    <div className="relative w-full h-[575px] group overflow-hidden bg-black">
      <div
        className="w-full h-full flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slides.map((slide, index) => {
          const isActive = index === currentIndex;
          return (
            <div key={slide.id} className="min-w-full h-full relative">
              {slide.type === "video" ? (
                <>
                  {slide.poster && (
                    <img
                      src={slide.poster}
                      alt="PRL Window Machinery Banner"
                      fetchPriority="high"
                      className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                    />
                  )}
                  <video
                    ref={(el) => (videoRefs.current[index] = el)}
                    src={isActive && videoStreamReady ? slide.src : undefined}
                    poster={slide.poster}
                    preload={isActive && videoStreamReady ? "metadata" : "none"}
                    onCanPlay={(e) => {
                      e.currentTarget.style.opacity = "1";
                    }}
                    onError={nextSlide}
                    className="relative w-full h-full object-cover opacity-0 transition-opacity duration-300"
                    muted
                    autoPlay={isActive && videoStreamReady}
                    playsInline
                  />
                </>
              ) : (
                <img
                  src={isActive || (Math.abs(index - currentIndex) <= 1 && currentIndex > 0) ? slide.src : undefined}
                  alt={`PRL Desktop Banner ${index + 1}`}
                  loading={index === 0 ? "eager" : "lazy"}
                  decoding="async"
                  className="w-full h-full object-cover select-none"
                  draggable="false"
                />
              )}
              <div className="absolute inset-0 bg-black/5" />
            </div>
          );
        })}
      </div>

      {/* Arrows */}
      <button
        type="button"
        aria-label="Previous slide"
        onClick={prevSlide}
        className="absolute top-1/2 left-5 -translate-y-1/2 z-30 p-2 rounded-full bg-white/10 hover:bg-white/30 backdrop-blur-md text-white border border-white/20 transition-all opacity-0 group-hover:opacity-100"
      >
        <ChevronLeft size={32} />
      </button>
      <button
        type="button"
        aria-label="Next slide"
        onClick={nextSlide}
        className="absolute top-1/2 right-5 -translate-y-1/2 z-30 p-2 rounded-full bg-white/10 hover:bg-white/30 backdrop-blur-md text-white border border-white/20 transition-all opacity-0 group-hover:opacity-100"
      >
        <ChevronRight size={32} />
      </button>

      {/* Desktop Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-3">
        {slides.map((_, idx) => (
          <button
            key={idx}
            type="button"
            aria-label={`Go to slide ${idx + 1}`}
            onClick={() => setCurrentIndex(idx)}
            className={`cursor-pointer transition-all duration-300 h-3 rounded-full ${
              currentIndex === idx
                ? "w-10 bg-red-600"
                : "w-3 bg-white/50 hover:bg-white"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Landingpage;
