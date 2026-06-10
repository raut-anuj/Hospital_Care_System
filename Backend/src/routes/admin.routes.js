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
    deleteUser,
     
    aboutPaitent,
    aboutDoctor,
    aboutStaff,
    
    Appointments,
    allDocSpec,
    
    allDoctorsList,
    allStaffsList,
    allPatientsList,
    
    getHospitalRevenue,
    getPaymentsByMethod,
    getDailyRevenue,
    getMonthlyRevenue,
    getAllBills,
    dateWiseBills
} from "../controllers/admin.controller.js";
import {upload} from "../middelwares/multer.middelwares.js"
import { verifyJWT } from "../middelwares/auth.middelwares.js";

const router = Router()
 
router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT, logout)
router.route("/doctorsList").get(allDoctorsList)
router.route("/staffsList").get(allStaffsList)
router.route("/patientsList").get(allPatientsList)
router.route("/aboutpaitent").get(aboutPaitent)
router.route("/aboutdoctor").get(aboutDoctor)
router.route("/aboutstaff").get(aboutStaff)
 
export default router