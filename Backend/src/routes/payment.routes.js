import { Router } from "express";
import { 
    getPatientPaymentsByMethod,
    payPayment,
    updatePaymentStatus,
    getPaymentByStatus,
    getPaymentHistoryByPatient,
    getAllPayments } from "../controllers/payment.controller.js";
import {upload} from "../middelwares/multer.middelwares.js"
import { verifyJWT } from "../middelwares/auth.middelwares.js";

const router = Router()
 
router.route("/pay/:id").post(payPayment);
router.route("/history/:id").get(getPaymentHistoryByPatient);
router.route("/method").get(getPatientPaymentsByMethod);
router.route("/status").get(getPaymentByStatus);
router.route("/update/:id").patch(updatePaymentStatus);
router.route("/all/:id").get(verifyJWT, getAllPayments);
export default router