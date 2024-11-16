import express from "express";
import dotenv from "dotenv";
import cors from "cors"; // Add this import

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

app.listen(port, () => {
  console.log(`Server started on port http://localhost:${port}`);
});
