import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { Patient } from "../models/patient.model.js";
import { Doctor } from "../models/doctor.model.js";
import { Admin } from "../models/admin.model.js";

// 1️⃣ [ "Getting the token" ]
export const verifyJWT = asyncHandler(async(req, res, next) => {
        try {
            // 1️⃣ Token get karo
        const token =
            req.cookies?.accessToken ||
            req.header("Authorization")?.replace("Bearer ", "")

        if (!token) {
            throw new ApiError(401, "Unauthorized request")
        }

        // 2️⃣ Token verify karo
        const decodedToken = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET
        )

        let user;
        
        // 3️⃣ Role ke basis par database check karo
        if (decodedToken.role === "patient") {
            user = await Patient.findById(decodedToken._id)
                .select("-password -refreshToken")
        }

        else if (decodedToken.role === "doctor") {
            user = await Doctor.findById(decodedToken._id)
                .select("-password -refreshToken")
        }

        else if (decodedToken.role === "admin") {
            user = await Admin.findById(decodedToken._id)
                .select("-password -refreshToken")
        }

        // 4️⃣ Agar user nahi mila
        if (!user) {
            throw new ApiError(401, "Invalid Access Token")
        }

        // 5️⃣ Request me user attach karo
        req.user = user

        // 6️⃣ Next middleware
        next()
//         app.get("/profile", verifyJWT, (req, res) => {
//         res.json(req.user); // direct mil gaya
//          });

    }
     catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
    
})

// Login → Server token banata hai → Cookie me bhejta hai
// → Next request → Browser token bhejta hai
// → jwt.verify(token, secret) → User authenticated