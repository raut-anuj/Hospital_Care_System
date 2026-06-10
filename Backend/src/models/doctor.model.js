import mongoose, {Schema}  from "mongoose"
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const doctorSchema = new mongoose.Schema({
    drname:{
        type:String,
        required:true,
    },
    fee:{ 
        type: Number, 
        required: true 
    },
    qualification:{
        type:String,
        required:true,
    },
    address:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        required:true
    },
    // emailId:{
        //     type:String,
        //     required:true
        // },
        // salary:{
        //     type:Number,
        //     required:true,
        // },
    // experince:{
    //     type:Number,
    //     default:0
    // },
    // worksinHospital:
    //     {
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref:"Hospital"
    //     },
        // date:
        // {
        // type: Date,
        // required: true
        // },
    // bloodgroup:{
    //     type:String,
    //     required:true
    // },
    specialization:{
        type:String,
        required:true
    },
    // sex:{
    //     type:String,
    //     enum:["Male","Female","Other"],
    //     required:true
    // },
    // contactNumber:{
    //   type:Number,
    //   required:true
    // }
},{timestamps:true})

doctorSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password)
}

doctorSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
        _id:this._id,
        role: "doctor"
        // email:this.email
        },
        process.env.ACCESS_TOKEN_SECRET,
        {  expiresIn : process.env.ACCESS_TOKEN_EXPIRY  }       
   )
}

doctorSchema.methods.generateRefreshToken=function(){
    return jwt.sign(
        {
            id : this._id,
            role: "doctor"
        },
         process.env.REFRESH_TOKEN_SECRET,
         {  expiresIn:process.env.REFRESH_TOKEN_EXPIRY  }       
    )
}

doctorSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 10);
});

export const Doctor=mongoose.model("Doctor",doctorSchema)