import React, { Suspense, lazy, useEffect, useState } from "react";
import AppProvider from "./provider/AppProvider";
import Routing from "./routes/Routing";

const LazyToastContainer = lazy(async () => {
  await import("react-toastify/dist/ReactToastify.css");
  const mod = await import("react-toastify");
  return { default: mod.ToastContainer };
});

const App = () => {
  const [showToasts, setShowToasts] = useState(false);

  useEffect(() => {
    const enable = () => setShowToasts(true);
    const events = ["pointerdown", "keydown", "touchstart"];
    events.forEach((ev) =>
      window.addEventListener(ev, enable, { once: true, passive: true }),
    );
    const t = window.setTimeout(enable, 9500);
    return () => {
      window.clearTimeout(t);
      events.forEach((ev) => window.removeEventListener(ev, enable));
    };
  }, []);

  return (
    <>
      <AppProvider>
        <Routing />
      </AppProvider>
      {showToasts && (
        <Suspense fallback={null}>
          <LazyToastContainer
            position="top-right"
            autoClose={2500}
            hideProgressBar
            newestOnTop
            closeOnClick
            pauseOnHover
            theme="light"
          />
        </Suspense>
      )}
    </>
  );
};

export default App;
