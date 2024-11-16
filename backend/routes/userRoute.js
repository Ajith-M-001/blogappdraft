import express from "express";
import {
  signUp,
  signIn,
  signOut,
  refreshToken,
  verifyEmail,
  resendOTP,
} from "../controllers/userControllers.js";
import { protect } from "../middlewares/verifyJWT.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/refresh-token", refreshToken);
router.post("/signout", protect, signOut);
router.put("/verify-email", verifyEmail);
router.post("/resend-otp", resendOTP);

export default router;
