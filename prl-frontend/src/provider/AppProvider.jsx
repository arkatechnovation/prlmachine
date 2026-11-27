import React, { Suspense } from "react";

const AppProvider = ({ children }) => {
  return (
    <Suspense fallback={<h2>Loading...</h2>}>{children}</Suspense>
  );
};

export default AppProvider;
