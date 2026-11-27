import React, { Suspense, lazy, useEffect, useRef, useState } from "react";

const LazyReCAPTCHA = lazy(() => import("react-google-recaptcha"));
const RECAPTCHA_SITE_KEY = "6LeHo-csAAAAAA-RUUtC-xmee5YqI4LMF75xMXuV";

const RecaptchaField = ({ onChange }) => {
  const containerRef = useRef(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (shouldLoad) return undefined;
    const node = containerRef.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setShouldLoad(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "250px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [shouldLoad]);

  return (
    <div ref={containerRef} className="min-h-[78px]">
      {shouldLoad ? (
        <Suspense fallback={<div className="h-[78px]" />}>
          <LazyReCAPTCHA
            sitekey={RECAPTCHA_SITE_KEY}
            onChange={(token) => onChange(token || "")}
            onExpired={() => onChange("")}
          />
        </Suspense>
      ) : null}
    </div>
  );
};

export default RecaptchaField;
