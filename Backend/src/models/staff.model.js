import mongoose, {Schema}  from "mongoose"
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const staffSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    password:{
        required:true,
        type:String
    },
    // emailId:{
    //     type:String,
    //     require:true
    // },
    // address:{
    //     type:String,
    //     required:true
    // },
    // bloodgroup:{
    //     type:String,
    //     required:true
    // },
    // age:{
    //     type:Number,
    //     required:true
    // },
    // sex:{
    //     type:String,
    //     enum:["Male","Female","Other"],
    //     required:true
    // },
    // contactNumber:{
    //   type:Number,
    //   required:true
    // },
    // experinceinYears:{
    //     type:Number,
    //     default:0
    // },
    // role:
    // {
    //     type:[ "StaffBoy", "Nurse" ],
    //     required: true
    // },
}, {timestamps:true})

staffSchema.methods.isPasswordCorrect = async function(password){
        return await bcrypt.compare(password,this.password)
}
    
staffSchema.methods.generateAccessToken = function(){
        return jwt.sign(
            {
            _id:this._id,
            email:this.email
            },
            process.env.ACCESS_TOKEN_SECRET,
            {  expiresIn : process.env.ACCESS_TOKEN_EXPIRY  }       
       )
}
    
staffSchema.methods.generateRefreshToken=function(){
        return jwt.sign(
            {
                id : this._id
            },
             process.env.REFRESH_TOKEN_SECRET,
             {  expiresIn:process.env.REFRESH_TOKEN_EXPIRY  }       
        )
}
    
staffSchema.pre("save", async function () {
        if (!this.isModified("password")) return;
    
        this.password = await bcrypt.hash(this.password, 10);
});

export const Staff = mongoose.model("Staff", staffSchema) 