import mongoose, { Schema} from "mongoose";
import jwt from "jsonwebtoken";

const mediaclRecordSchema = new mongoose.Schema({
   patientId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient"
   },
   doctorId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor"
   },
   diagnosedWith:{
        type:String,
        required:true
   },
   notes:{
        type:String,
        required:true
   },
   prescriptionFile:{
        type:String,
        required:true
   },
   date:{
        type:Date,
        required:true   
}
},{timestamps:true})

export const MedicalRecord=mongoose.model("MedicalRecord",mediaclRecordSchema);