import { Router } from "express";
import { 
    generateAccessandRefreshToken,
    refreshAccessToken,
    registerUser,
    changeCurrentPassword,
    loginUser,
    logout,
    createAppointment,
    getProfile,
    updateProfile,
    forgotPassword,

    //advance functions
    cancelAppointment,
    getAppointments,
    appointment,
    getMyBills,
    getPaymentHistory
} from "../controllers/patient.controller.js";
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
router.route("/appointment").post(appointment)
router.route("/createAppointment").post(createAppointment);
router.route("/getAppointments").get(getAppointments)
router.route("/changeCurrentPassword").put(verifyJWT, changeCurrentPassword)
router.route("/forgotPassword").put(forgotPassword)


export default router


// GET → data laane ke liye fron DB
// POST → naya data banane ke liye
// PUT / PATCH → update ke liye
// DELETE → delete ke liye 