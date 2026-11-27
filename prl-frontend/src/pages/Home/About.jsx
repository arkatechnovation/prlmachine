import React from "react";
import { Link } from "react-router-dom";

const AboutSection = () => {
  return (
    <section className="relative py-8 text-white overflow-hidden bg-gray-900">
      <img
        src="/assets/Aboutimg/about-for-bg.webp"
        alt=""
        aria-hidden="true"
        loading="eager"
        fetchPriority="high"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      {/* Optional dark overlay */}
      <div className="absolute inset-0 bg-black/50 z-0"></div>

      {/* Content */}
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Image Column */}
            <div className="lg:w-1/2 w-full">
              <div className="relative group cursor-pointer">
                <div className="absolute -inset-4 bg-gradient-to-r from-red-400 to-red-600 rounded-2xl blur-md opacity-0 group-hover:opacity-30 transition-all duration-500"></div>
                <img
                  src="/assets/Aboutimg/about.webp"
                  alt="Red Lion Manufacturing"
                  loading="lazy"
                  decoding="async"
                  className="relative w-full h-[300px] sm:h-[400px] md:h-[450px] lg:h-[500px] object-cover rounded-2xl shadow-lg border border-white/20 transform transition-all duration-500 group-hover:scale-[1.02]"
                />
              </div>
            </div>

            {/* Text Column */}
            <div className="lg:w-1/2 w-full text-center lg:text-left">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold mb-6">
                <span className="font-normal">About</span>{" "}
                <span className="text-red-500 font-medium">Red</span> Lion
              </h2>

              <div className="mb-6">
                <div className="w-16 h-[2px] bg-red-500 mb-6 mx-auto lg:mx-0"></div>
                <div className="space-y-4 leading-relaxed text-gray-200">
                  <p>
                    PARIDA RED LION INDIA PVT LTD (PRL) is a leading
                    manufacturer of uPVC Aluminium window-making machines,
                    dedicated to delivering innovative, high-quality solutions
                    for the fabrication industry.
                  </p>
                  <p>
                    Established in 2017 & entered uPVC & Aluminium Machine
                    Manufacturing in 2022, our manufacturing facility is located
                    in Greater Noida, focusing on innovation and sustainability.
                  </p>
                </div>
              </div>

              <Link to="/ourcompany/about">
                <button className="mt-6 px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 active:scale-95">
                  Learn More About Us
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
