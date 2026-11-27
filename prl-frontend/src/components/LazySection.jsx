import React, { Suspense, useEffect, useRef, useState } from "react";

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
      {visible ? (
        <Suspense fallback={<div style={{ minHeight }} />}>{children}</Suspense>
      ) : null}
    </div>
  );
};

export default LazySection;
