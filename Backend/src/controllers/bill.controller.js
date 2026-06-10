import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Patient } from "../models/patient.model.js";
import jwt from "jsonwebtoken"
import { Doctor } from "../models/doctor.model.js";
import { Appointment } from "../models/appointment.model.js";
import { get } from "http";
import { Bill } from "../models/bill.model.js"
import { Payment } from "../models/payment.model.js"

const createBill = asyncHandler(async(req,res)=>{
     
    const patientId = req.params.id;
     const { totalAmount } = req.body;
    const patient = await Patient.findById(patientId);
    if(!patient)
        throw new ApiError(404, "Invalid Patient Id.")

    // const appointment = await Appointment.find(patient._id)
    // if(!appointment)
    //     throw new ApiError(404, "No appointment found for this patient.")

    // const totalAmount = appointment.reduce((sum, app) => sum + (app.amount || 0), 0);

    const bill = await Bill.create({
        patientId: patient._id,
        totalAmount: totalAmount,
        paidAmount: 0,        
        status:"PENDING"
    })
    return res
    .status(200)
    .json(new ApiResponse(200, bill, "Your Bill."))

})

const getStatus = asyncHandler(async(req,res)=>{
    const { status } = req.body
    const patientId = req.params.id;
     
    if(!status)
        throw new ApiError(400, "Status is required")

    const patient = await Patient.findById(patientId);
    if(!patient)
        throw new ApiError(404, "Invalid Patient Id.")

       const payment = await Payment.find({
            patientId: patient._id,
            status: status
        });
    
    return res
    .status(200)
    .json(new ApiResponse(200, payment, "Status of payment."))
})

const getBillByDate = asyncHandler(async (req, res) => {
    const { date } = req.body;

    if (!date)
        throw new ApiError(400, "Date is required");

    const patient = await Patient.findById(req.params.id);
    if (!patient)
        throw new ApiError(400, "Invalid Patient Id.");

    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const payment = await Payment.find({
        patientId: patient._id,
        date: {
            $gte: startDate,
            $lte: endDate
        }
    })

    if (payment.length === 0)
        throw new ApiError(404, "No Bill found.");

    return res
        .status(200)
        .json(new ApiResponse(200, payment, `${date} Bill`));
})

const getBillByPatient = asyncHandler(async (req, res) => {

    const patient = await Patient.findById(req.params.id);
    if (!patient)
        throw new ApiError(400, "Invalid Patient Id.");

    const payment = await Payment.find({
        patientId: patient._id,
    }).select("-status");

    if (payment.length === 0)
        throw new ApiError(404, "No Bill found.");

    return res
        .status(200)
        .json(new ApiResponse(200, payment, " Bill"));
})

const getBillHistory = asyncHandler(async (req, res) => {

    const patient = await Patient.findById(req.params.id);
    if (!patient)
        throw new ApiError(400, "Invalid Patient Id.");

    const payment = await Payment.find({
        patientId: patient._id,
    })

    if (payment.length === 0)
        throw new ApiError(404, "No Bill found.");

    return res
        .status(200)
        .json(new ApiResponse(200, payment, " Payment History."));
})

export{
    createBill,
    getStatus,
    getBillByDate,
    getBillByPatient,
    getBillHistory
}