import mongoose, {Schema}  from "mongoose"
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const patientSchema =new mongoose.Schema({
    name:{
        type:String,
        required:false,
    },
    email: {
         type: String,
         required: true,
         unique: true,
    },
    gender: {
        type: String,
        enum: ["Male", "Female", "Other"],
        required: false,
    },
    password: {
        type: String,
        required: false,
    },
    address:{
        type:String,
        required:false
    },
    bloodgroup:{
        type:String,
        required:false
    },
    age:{
        type:Number,
        required:false
    },
    contactNumber:{
        type:Number,
          required:false
    },
    bill:{
        type: mongoose.Schema.Types.ObjectId,     
        ref: "Bill"
    },
},
{timestamps:true})

patientSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 10);
});

patientSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password)
}

patientSchema.methods.generateAccessToken=function(){
    return jwt.sign(
        {
        _id:this._id,
        role: "patient"
        // email:this.emailId
        },
        process.env.ACCESS_TOKEN_SECRET,
        {  expiresIn:process.env.ACCESS_TOKEN_EXPIRY  }       
   )
}
patientSchema.methods.generateRefreshToken=function(){
    return jwt.sign(
        {
            id : this._id,
            role: "patient"
        },
         process.env.REFRESH_TOKEN_SECRET,
         {  expiresIn:process.env.REFRESH_TOKEN_EXPIRY  }       
    )
}

export const Patient= mongoose.model("Patient",patientSchema)