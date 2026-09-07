import express from "express";
import { Admin } from "../models/admin.model.js";
import { Doctor } from "../models/doctor.model.js";
import { Patient } from "../models/patient.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

const router = express.Router();

router.post("/login", asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email?.trim() || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const normalizedEmail = email.trim().toLowerCase();
  const accounts = [
    { model: Admin, role: "admin", userKey: "admin" },
    { model: Doctor, role: "doctor", userKey: "doctor" },
    { model: Patient, role: "patient", userKey: "patient" },
  ];

  for (const { model, role, userKey } of accounts) {
    const account = await model.findOne({ email: normalizedEmail });

    if (account && await account.isPasswordCorrect(password)) {
      const token = account.generateAccessToken();
      const user = account.toObject();
      delete user.password;
      delete user.refreshToken;

      return res.status(200).json(
        new ApiResponse(200, { user, [userKey]: user, token, role }, "Login successful")
      );
    }
  }

  throw new ApiError(401, "Invalid email or password");
}));

export default router;