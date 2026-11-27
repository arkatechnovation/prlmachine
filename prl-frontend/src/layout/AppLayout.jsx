import React, { Suspense, lazy, useEffect, useState } from "react";
import { Outlet, ScrollRestoration, useLocation } from "react-router-dom";
import LazySection from "../components/LazySection";
import Navbar from "../components/Navbar";
import RouteSeo from "../common/seo/RouteSeo";
import { scrollToHash } from "../utils/hashScroll";
import ParidaRedLionChatbot from "../chatbot/Chatbot";
import CatalogDownload from "../common/downloadcatelog/CatalogDownload";
import SideButtons from "../common/Sidebaar/SideBar";

const Footer = lazy(() => import("../components/Footer"));
const GetQuoteModal = lazy(() => import("../common/GetAquote/Getaquote"));
const HashScrollManager = () => {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;

    let timeoutId;
    let attempts = 0;
    const maxAttempts = 50;

    const tryScroll = () => {
      attempts += 1;
      const didScroll = scrollToHash(location.hash);
      if (didScroll || attempts >= maxAttempts) return;
      timeoutId = window.setTimeout(tryScroll, 100);
    };

    timeoutId = window.setTimeout(tryScroll, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [location.pathname, location.hash]);

  return null;
};

const AppLayout = () => {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  const handleOpenQuote = () => {
    setIsQuoteModalOpen(true);
  };

  const handleCloseQuote = () => {
    setIsQuoteModalOpen(false);
  };

  return (
    <>
      <RouteSeo />
      <ScrollRestoration />
      <HashScrollManager />
      <Navbar onOpenQuote={handleOpenQuote} />
      {isQuoteModalOpen && (
        <Suspense fallback={null}>
          <GetQuoteModal isOpen={isQuoteModalOpen} onClose={handleCloseQuote} />
        </Suspense>
      )}
      <SideButtons />
      <ParidaRedLionChatbot />
      <CatalogDownload />

      <main id="main-content" className="min-w-0 max-w-full overflow-x-clip md:overflow-x-visible">
        <Outlet />
      </main>
      <LazySection minHeight={300}>
        <Footer />
      </LazySection>
    </>
  );
};

export default AppLayout;
