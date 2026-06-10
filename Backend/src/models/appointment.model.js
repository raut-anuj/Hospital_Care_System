import mongoose, {Schema} from "mongoose";

const appointmentSchema = new mongoose.Schema({
        patientId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Patient",
            required: "true"
        },
        status: {
            type: String,
            enum: ["scheduled", "completed", "cancelled"],
            default: "scheduled"
            },
        amount: {
            type: Number,
            required: true
        },
        doctorId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Doctor",
            required: true,
        },
        date:{
            type: Date,
            required:true
            },
        time: {
  type: String,
  required: true,
},
}, {timestamps: true});

export const Appointment = mongoose.model("Appointment", appointmentSchema);