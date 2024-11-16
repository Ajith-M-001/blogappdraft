import express from "express";
import dotenv from "dotenv";
import cors from "cors"; // Add this import
import connectDB from "./config/connectDB.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;



const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? process.env.FRONTEND_URL_PRODUCTION
      : process.env.FRONTEND_URL_DEVELOPMENT,
  credentials: true, // Important for cookies/authentication
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
// Enable pre-flight requests for all routes
app.options("*", cors(corsOptions));


app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

app.get("/", (req, res) => {
  res.send("Hello World");
});

const start = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Server is running on port http://localhost:${port}`);
    });
  } catch (error) {
    console.log("Error starting server:", error);
    process.exit(1);
  }
};

start();
