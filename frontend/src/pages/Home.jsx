// src/pages/Home.jsx (Example)
import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">
        Welcome to the School Management System
      </h1>
      <p>
        This is the homepage. You can add information about your system here.
      </p>
      <Link
        to="/login"
        className="bg-primary hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Login
      </Link>
    </div>
  );
}
export default Home;
