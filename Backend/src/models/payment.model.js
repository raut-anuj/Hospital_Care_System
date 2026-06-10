import mongoose, {Schema, Types} from "mongoose";

const paymentSchema = new mongoose.Schema({
    patientId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Patient",
        required: true
    },
    // date:{
    //     type: Date,
    //     default: Date.now
    // },
    amount:{
        type: Number,
        required: true
    },
    method:{
        type:String,
        enum:["UPI","CASH","CARD"],
        required: true
    },
//     status:{
//         type:String,
//         enum:["PENDING", "SUCCESS", "FAILED"],
//         required: true
//     },
//     paidAt: {
//         type: Date,
//         default: Date.now
// }
},{timestamps:true})

export const Payment = mongoose.model("Payment", paymentSchema);