import { Router } from "express";
import { 
    createBill,
    getStatus,
    getBillByDate,
    getBillByPatient,
    getBillHistory
} from "../controllers/bill.controller.js";
import {upload} from "../middelwares/multer.middelwares.js"
import { verifyJWT } from "../middelwares/auth.middelwares.js";

const router = Router()
 
router.route("/create/:id").post(createBill)
router.route("/status").get(getStatus)
router.route("/date").get(getBillByDate)
router.route("/patient").get(getBillByPatient)
router.route("/history").get(getBillHistory)

export default router