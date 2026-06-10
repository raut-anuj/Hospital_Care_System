import { Router } from "express";
import { 
    logout,
    loginUser,
    registerUser,
    updateProfile,
    getProfile,
    refreshAccessToken,
    changeCurrentPassword,
    generateAccessAndRefreshToken,

    getPatientProfile,
    gettAllpatient,
    getTodayAppointments,
    getAllAppointments

} from "../controllers/doctor.controller.js";
import {upload} from "../middelwares/multer.middelwares.js"
import { verifyJWT } from "../middelwares/auth.middelwares.js";

const router = Router()
  
router.route("/register").post(registerUser)
router.route("/logout").post(verifyJWT, logout)
router.route("/getAllAppointments").get(getAllAppointments)
router.route("/login").post(loginUser)

export default router