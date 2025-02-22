// src/pages/NotFound.jsx
import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background">
      <h1 className="text-4xl font-bold text-gray-700">404</h1>
      <p className="text-xl text-gray-600 mt-2">Page Not Found</p>
      <Link
        to="/"
        className="mt-4 bg-primary hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Go to Home
      </Link>
    </div>
  );
}

export default NotFound;
