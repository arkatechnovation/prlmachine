import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AppProvider from "./provider/AppProvider";
import Routing from "./routes/Routing";

const App = () => {
  return (
    <>
      <AppProvider>
        <Routing />
      </AppProvider>
      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="light"
      />
    </>
  );
};

export default App;
