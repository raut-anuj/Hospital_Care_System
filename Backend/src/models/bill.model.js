import mongoose, {Schema, Types} from "mongoose";

const billSchema = new mongoose.Schema({
    patientId:{
       type:mongoose.Schema.Types.ObjectId,
       ref:"Patient" ,
       required:true
    },
   //  appointmentId:{
   //     type:mongoose.Schema.Types.ObjectId,
   //     ref:"Appointment" ,
   //     required:true
   //  },
    totalAmount:{
       type:Number,
       required:true
    },
    paidAmount:{
        type:Number,
        default:0
      //   required:true
    },
   //  billStatus:{
   //  type:String,
   //  enum:["UNPAID", "PARTIAL", "PAID"],
   //  required:true
   //  }
}, {timestamps:true})

export const Bill = mongoose.model("Bill", billSchema);