import express from "express";
import dotenv from "dotenv";
import cors from "cors"; // Add this import
import connectDB from "./config/connectDB.js";
import userRouter from "./routes/userRoute.js";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser"; // Add this import
import { notFoundHandler, errorHandler } from "./middlewares/errorHandler.js";


dotenv.config();

const app = express();
app.use(helmet());
// app.use(compression());
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
app.use(cookieParser());


app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api/v1/auth", userRouter);

app.use(notFoundHandler);
app.use(errorHandler);

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
