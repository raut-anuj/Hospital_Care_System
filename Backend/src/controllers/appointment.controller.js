import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken"
import { Patient } from "../models/patient.model.js"
import { Appointment } from "../models/appointment.model.js";

const getAppointmentsByDoctor = asyncHandler(async(req,res)=>{
    const { date } = req.body
    if (!date)
       throw new ApiError(400, "Date is required");
    
    const doctorid = req.params.id
    if(!doctorid)
        throw new ApiError(400, "Doctor not found.")

    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

     const appointment = await Appointment.find({
            doctorId : doctorid,
            date:{
                $gte: startDate,
                $lte: endDate
            }
      })

      if( appointment.length === 0 )
      {
        return res
        .status(200)
        .json(new ApiResponse(200, {}, "No appointments for today."))
      }
     
        return res
        .status(200)
        .json(new ApiResponse(200, appointment, "All todays Appointment."))
      
});

const getAppointmentsByPatient = asyncHandler(async(req,res)=>{
    const { date } = req.body
    if (!date)
            throw new ApiError(400, "Date is required");
    
    const patientid = req.params.id
    if(!patientid)
        throw new ApiError(400, "Patient not found.")

    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

     const appointment = await Appointment.find({
            patientid : patientid,
            date:{
                $gte: startDate,
                $lte: endDate
        }
      })
      if( appointment.length === 0 )
      {
        return res
        .status(200)
        .json(new ApiResponse(200, {}, "No Patient appointments for today."))
      }
     
        return res
        .status(200)
        .json(new ApiResponse(200, appointment, "All todays Appointment."))
      
});

const cancelDoctorAppointments = asyncHandler(async(req,res)=>{
    const { date } = req.body
    const doctorid = req.params.id

    if(!doctorid)
        throw new ApiError(400, "Doctor not found.")

    const cancelapp = await Appointment.deleteMany({
        doctorId: doctorid,
        date: date
    })
    if( cancelapp.deletedCount === 0 ){
        return res
        .status(200)
        .json(new ApiResponse(200, null, " No appointments for today."))
    }
    return res
    .status(200)
    .json(new ApiResponse(200, null, "Appointments cancelled"))
});

const Availability = asyncHandler(async(req,res)=>{
    const { date } = req.body;
    const doctorid = req.params.id;

    //lakin yh dena jaurri nhi ha ku ku automatic date set joh rha ha. Backend mh is liya no need.
    if (!date)
    throw new ApiError(400, "Date is required")

   const availability = await Appointment.find({
    doctorId : doctorid,
    date
   })

   if( availability.length === 0)
    return res
   .status(200)
   .json(new ApiResponse(200, null, "Free"))
   else
   {
    return res
   .status(200)
   .json(new ApiResponse(200, availability, "Busy"))
   }
});

const cancelAppointmentByPatient = asyncHandler(async(req,res)=>{
     const patientid = await Patient.findById(req.params.id);

    if (!patientid)
        throw new ApiError(400, "Invalid Patient Id.");

     const patient = await Appointment.deleteMany({
        patientId: patientid
    })

    if(patient.deletedCount===0) {
        return res
        .status(200)
        .json(new ApiResponse(200, null, " Patient appointment deleted.")) }
});

const getTodayAppointmentsCount = asyncHandler(async(req,res)=>{
    const { date } = req.body
    if (!date)
       throw new ApiError(400, "Date is required");

    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const todayCount = await Appointment.countDocuments({
            date: {
                $gte: startDate,
                $lte: endDate
            }
        });

    return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { todayAppointments: todayCount },
        "Doctor today's appointments count fetched"
      )
    );
});

export{
    Availability,
    getTodayAppointmentsCount,
    cancelDoctorAppointments,
    cancelAppointmentByPatient,
    getAppointmentsByDoctor,
    getAppointmentsByPatient,
}