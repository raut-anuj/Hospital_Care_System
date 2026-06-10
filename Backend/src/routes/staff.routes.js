import { Router } from "express";
import { 
    generateAccessAndRefreshToken,
    refreshAccessToken,
    registerUser,
    loginUser,
    logout,
    getProfile,
    updateProfile,
    changeCurrentPassword,
    getAllStaff,
    getStaffByRole,
    updateStaffRole,
    deleteStaff
} from "../controllers/staff.controller.js";
import {upload} from "../middelwares/multer.middelwares.js"
import { verifyJWT } from "../middelwares/auth.middelwares.js";

const router = Router()
 
// router.route("/register").post(
//     upload.fields([
//         {
//             name: "avatar",
//             maxCount: 1
//         }, 
//         {
//             name: "coverImage",
//             maxCount: 1
//         }
//     ]),
//     registerUser
//     )

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT, logout)

export default router


// GET → data laane ke liye fron DB
// POST → naya data banane ke liye
// PUT / PATCH → update ke liye
// DELETE → delete ke liye 