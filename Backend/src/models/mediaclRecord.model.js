import mongoose, {Schema}  from "mongoose"
import jwt from "jsonwebtoken";


const medicalRecordSchema = new mongoose.Schema({
    patient_id:{
        required : true,
        ref : "Patient"
    },
    doctor_id:{
        required : true,
        ref : "Doctor"
    },
    report:{
        type:String,
        required:true
 },
    date:{
        type: Date,
        default: Date.now
    }
}, {timesStamps:true} )

export const MedicalRecord = mongoose.model("MedicalRecord",medicalRecordSchema)