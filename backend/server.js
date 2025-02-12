// server.js (or your main entry file)
import "dotenv/config"; // Load environment variables first
import app from "./app.js";
import connectDB from "./utils/db.js";

const PORT = process.env.PORT || 6001;

// Connect to MongoDB first
connectDB()
  .then(() => {
    // Start server after successful DB connection
    const server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV}`);
      console.log(`Frontend URL: ${process.env.FRONTEND_URL}`);
    });

    // Handle unhandled promise rejections
    process.on("unhandledRejection", (err) => {
      console.error("Unhandled Rejection:", err);
      server.close(() => {
        console.log("Server closed due to unhandled rejection");
        process.exit(1);
      });
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
    process.exit(1);
  });
