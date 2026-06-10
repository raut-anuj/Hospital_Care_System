import mongoose, { Schema} from "mongoose";
import jwt from "jsonwebtoken";

const doctorSpecializationSchema = new mongoose.Schema({
    name:{
        type: mongoose.Schema.Types.ObjectId ,
        ref: "Doctor"
    },
    qualification:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor"
    },
    experince:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor"
    },
    specialization:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Specialization"
    }
}, {timestamps:true})

export const DoctorSpecialization = mongoose.model("DoctorSpecialization", doctorSpecializationSchema)