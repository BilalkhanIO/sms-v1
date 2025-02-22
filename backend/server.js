// server.js
import "dotenv/config";
import app from "./app.js";
import connectDB from "./utils/db.js";

const PORT = process.env.PORT || 6001;

// Connect to MongoDB
connectDB()
  .then(() => {
    // Start server after successful DB connection
    const server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV}`);
      console.log(`Frontend URL: ${process.env.FRONTEND_URL}`);
    });

    // Handle unhandled promise rejections (e.g., database connection errors)
    process.on("unhandledRejection", (err) => {
      console.error("Unhandled Rejection:", err);
      server.close(() => {
        console.log("Server closed due to unhandled rejection");
        process.exit(1); // Exit the process with an error code
      });
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
    process.exit(1); // Exit if database connection fails
  });
