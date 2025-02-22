// src/App.jsx
import React from "react";

import Navbar from "./components/common/Navbar";
import Routes from "./routes/Router";

function App() {
  return (
    <>
      <Navbar /> {/* Add the Navbar */}
      <Routes />
    </>
  );
}

export default App;
