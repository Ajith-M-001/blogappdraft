import User from "../models/userSchema.js";
import { generateUserName } from "../utils/generateUserName.js";
import { errorResponse, successResponse } from "../utils/responseHandler.js";
import bcrypt from "bcrypt";
import { generateTokens } from "../utils/generateTokens.js";
import jwt from "jsonwebtoken";
import {
  sendVerificationCode,
  sendWelcomeEmail,
} from "../middlewares/Email.js";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
};

export const signUp = async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
      return errorResponse(res, 400, "Required fields are missing");
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse(res, 400, "Email already registered");
    }
    const username = await generateUserName(fullName);
    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationOTP = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // Add OTP expiry time (10 minutes from now)
    // const verificationOTPExpiry = new Date(Date.now() + 10 * 60 * 1000);
    const verificationOTPExpiry = new Date(Date.now() + 2 * 60 * 1000);

    const user = new User({
      fullName,
      email,
      password: hashedPassword,
      username,
      verificationOTP,
      verificationOTPExpiry,
    });
    await user.save();
    sendVerificationCode(user.email, verificationOTP);
    const responseObject = {
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      profilePicture: user.profilePicture,
      isVerified: user.isVerified,
      username: user.username,
    };
    // Return success response with updated format
    return successResponse(
      res,
      201,
      "User created successfully and verification code sent to email",
      responseObject
    );
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return errorResponse(res, 400, "Required fields are missing");
    }
    const user = await User.findOne({ email });
    if (!user) {
      return errorResponse(res, 400, "User not found");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return errorResponse(res, 400, "Invalid password");
    }
    const { accessToken, refreshToken } = await generateTokens(user._id);
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    res.cookie("refreshToken", refreshToken, cookieOptions);
    res.cookie("accessToken", accessToken, cookieOptions);
    const responseObject = {
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      profilePicture: user.profilePicture,
      isVerified: user.isVerified,
      username: user.username,
    };
    return successResponse(res, 200, "Sign in successful", responseObject);
  } catch (error) {
    next(error);
  }
};

export const signOut = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return errorResponse(res, 404, "User not found");
    }

    user.refreshToken = null;
    await user.save({ validateBeforeSave: false });

    res.clearCookie("refreshToken", { ...cookieOptions, maxAge: 0 });
    res.clearCookie("accessToken", { ...cookieOptions, maxAge: 0 });

    return successResponse(res, 200, "Sign out successful", {});
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const incomingRefreshToken =
      req.cookies?.refreshToken || req.headers?.authorization?.split(" ")[1];
    if (!incomingRefreshToken) {
      return errorResponse(res, 401, "Refresh token is missing");
    }
    // Verify the refresh token
    const decoded = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const userId = decoded.userId;
    const user = await User.findById(userId);
    if (!user) {
      return errorResponse(res, 401, "User not found");
    }
    if (user.refreshToken !== incomingRefreshToken) {
      return errorResponse(res, 401, "Invalid refresh token");
    }
    const { accessToken, refreshToken: newRefreshToken } = await generateTokens(
      user._id
    );
    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });

    res.cookie("refreshToken", newRefreshToken, cookieOptions);
    res.cookie("accessToken", accessToken, cookieOptions);

    return successResponse(res, 200, "Token refreshed successfully", {});
  } catch (error) {
    // Handle specific token expiration error
    if (error.name === "TokenExpiredError") {
      return errorResponse(
        res,
        403,
        "Refresh token expired, please sign in again"
      );
    }
    next(error);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const { email, verificationOTP } = req.body;
    if (!email || !verificationOTP) {
      return errorResponse(res, 400, "Required fields are missing");
    }
    // Find user with valid OTP and non-expired OTP
    const user = await User.findOne({
      email,
      verificationOTP,
      verificationOTPExpiry: { $gt: new Date() },
    }).select("email fullName isVerified");
    if (!user) {
      return errorResponse(res, 400, "Invalid or expired OTP");
    }
    // Update user's verification status and clear OTP fields
    await User.findByIdAndUpdate(user._id, {
      $set: { isVerified: true },
      $unset: { verificationOTP: 1, verificationOTPExpiry: 1 },
    });

    // Send welcome email asynchronously without blocking response
    sendWelcomeEmail(user.email, user.fullName).catch((err) => {
      console.error(`Failed to send welcome email to ${user.email}:`, err);
    });
    return successResponse(res, 200, "Email verified successfully", user);
  } catch (error) {
    next(error);
  }
};

export const resendOTP = async (req, res, next) => {
  const { email, isPasswordReset = false } = req.body;
  try {
    if (!email) {
      return errorResponse(res, 400, "Email is required");
    }
    const user = await User.findOne({ email });
    if (!user) {
      return errorResponse(res, 404, "email not found");
    }
    const verificationOTP = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // Set new expiry time (10 minutes)
    const OTPExpiry = new Date(Date.now() + 2 * 60 * 1000);

    if (user.isVerified) {
      return errorResponse(res, 400, "Email already verified");
    }

    await User.findByIdAndUpdate(user._id, {
      $set: { verificationOTP, verificationOTPExpiry: OTPExpiry },
    });
    sendVerificationCode(email, verificationOTP);
    return successResponse(res, 200, "OTP resent successfully", {});
  } catch (error) {
    next(error);
  }
};
