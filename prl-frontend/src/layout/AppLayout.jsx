import React, { Suspense, lazy, useEffect, useState } from "react";
import { Outlet, ScrollRestoration, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import RouteSeo from "../common/seo/RouteSeo";
import { scrollToHash } from "../utils/hashScroll";

const Footer = lazy(() => import("../components/Footer"));
const GetQuoteModal = lazy(() => import("../common/GetAquote/Getaquote"));
const ParidaRedLionChatbot = lazy(() => import("../chatbot/Chatbot"));
const CatalogDownload = lazy(
  () => import("../common/downloadcatelog/CatalogDownload"),
);
const SideButtons = lazy(() => import("../common/Sidebaar/SideBar"));

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
      <Suspense fallback={null}>
        <SideButtons />
        <ParidaRedLionChatbot />
        <CatalogDownload />
      </Suspense>

      <main id="main-content">
        <Outlet />
      </main>
      <Suspense fallback={<div className="min-h-[300px]" />}>
        <Footer />
      </Suspense>
    </>
  );
};

export default AppLayout;
