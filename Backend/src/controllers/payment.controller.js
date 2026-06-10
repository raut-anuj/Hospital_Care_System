import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Staff } from "../models/staff.model.js";
import jwt from "jsonwebtoken"
import { Doctor } from "../models/doctor.model.js";
import { Appointment } from "../models/appointment.model.js";
import { Admin } from "../models/admin.model.js";
import { Patient } from "../models/patient.model.js"
import { Payment } from "../models/payment.model.js";
import { Bill } from "../models/bill.model.js"

const updatePaymentStatus = asyncHandler(async(req,res)=>{
    const patientId = req.params.id; 
    const patient = await Patient.findById(patientId);
    if(!patient)
        throw new ApiError(404, "Invalid Patient Id.")

    const { status } = req.body
    if(!status)
        throw new ApiError(400, "Status is required.")
    const payment = await Payment.find({
        status: status,
        patientId: patient._id
    });
    if (payment.length === 0)
        throw new ApiError(404, "No Patient found.");

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Status updated of that patient."));
});

const getPaymentHistoryByPatient = asyncHandler(async(req,res)=>{
    const patientId = req.params.id; 
    const patient = await Patient.findById(patientId);
    if(!patient)
        throw new ApiError(404, "Invalid Patient Id.")
    const payment = await Payment.find({
        patientId: patient._id
    });
    if (payment.length === 0)
        throw new ApiError(404, "No Payment found.");

    return res
        .status(200)
        .json(new ApiResponse(200, payment, "All Payments"));
});

const getAllPayments= asyncHandler(async(req,res)=>{
    const patientId = req.params.id; 
    const patient = await Patient.findById(patientId);

    if(!patient)
        throw new ApiError(404, "Invalid Patient Id.")
    const payment = await Payment.find({
        patientId: patient._id,
    });
     if (payment.length === 0)
        throw new ApiError(404, "No Payment found.");

    return res
        .status(200)
        .json(new ApiResponse(200, payment, "Payment"));
});
// const { date } = req.body;
    // if (!date)
    //     throw new ApiError(400, "Date is required");

    // const startDate = new Date(date);
    // startDate.setHours(0, 0, 0, 0);

    // const endDate = new Date(date);
    // endDate.setHours(23, 59, 59, 999);

const getPaymentByStatus = asyncHandler(async(req,res)=>{
    const patientId = req.params.id; 
    const patient = await Patient.findById(patientId);

    if(!patient)
        throw new ApiError(404, "Invalid Patient Id.")

    const { status } = req.body;
    if (!status)
        throw new ApiError(400, "Status is required");
    const payment = await Payment.find({
        status: status
    });
    if (payment.length === 0)
        throw new ApiError(404, "No Payment found on that Status.");

    return res
        .status(200)
        .json(new ApiResponse(200, payment, "Payment with given Status"));

});

const payPayment = asyncHandler(async(req,res)=>{

    const patientId = req.params.id;

    const patient = await Patient.findById(patientId);
    if(!patient)
        throw new ApiError(404,"Invalid Patient Id");

    const { amount, method } = req.body;

    if(!amount || !method)
        throw new ApiError(400,"Amount and method required");

    if(amount <= 0)
        throw new ApiError(400,"Invalid payment amount");

    const bill = await Bill.findOne({
        patientId: patient._id,
        // billStatus: { $ne: "PAID" }
    });

    if(!bill)
        throw new ApiError(404,"No unpaid bill found");

    // const remaining = bill.totalAmount - bill.paidAmount;

    // if(amount > remaining)
    //     throw new ApiError(400,`Payment exceeds remaining amount ${remaining}`);

    const payment = await Payment.create({
        patientId,
        amount,
        method,
        status:"SUCCESS"
    });

    bill.paidAmount = bill.paidAmount ? Number(bill.paidAmount) : 0;
    bill.paidAmount += Number(amount);

    if (bill.paidAmount >= bill.totalAmount) {
        bill.billStatus = "PAID";
    } else {
        bill.billStatus = "PARTIAL";
    }

    await bill.save();

    const remainingAmount = bill.totalAmount - bill.paidAmount;

    return res.status(200).json({
        payment,
        bill,
        remainingAmount
});

});

const getPatientPaymentsByMethod = asyncHandler(async(req,res)=>{
      const patient = await Patient.findById(req.params.id);
        if (!patient)
            throw new ApiError(404, "Invalid Patient Id.");

        const payment = await Payment.find({
                 patientId: patient._id  });

        if ( payment.length === 0)
            throw new ApiError(404, "No Payment found.");

        return res
        .status(200)
        .json(new ApiResponse(200, payment, "Payment History."))     
});

export{ 
    getPatientPaymentsByMethod,
    payPayment,
    updatePaymentStatus,
    getPaymentByStatus,
    getPaymentHistoryByPatient,
    getAllPayments 
}