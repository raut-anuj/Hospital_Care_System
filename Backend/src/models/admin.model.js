import mongoose, {Schema}  from "mongoose"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt";

const adminSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    // emailId:{
    //     type:String,
    //     require:true
    // },
    password:{
        type:String,
        required:true
    },
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
    // }
}, {timestamps:true})

adminSchema.methods.isPasswordCorrect = async function(password){
        return await bcrypt.compare(password,this.password)
}
    
adminSchema.methods.generateAccessToken = function(){
        return jwt.sign(
            {
            _id:this._id,
            role: "admin"
            // email:this.email
            },
            process.env.ACCESS_TOKEN_SECRET,
            {  expiresIn : process.env.ACCESS_TOKEN_EXPIRY  }       
       )
}
    
adminSchema.methods.generateRefreshToken=function(){
        return jwt.sign(
            {
                id : this._id,
                role: "admin"
            },
             process.env.REFRESH_TOKEN_SECRET,
             {  expiresIn:process.env.REFRESH_TOKEN_EXPIRY  }       
        )
}
    
adminSchema.pre("save", async function () {
        if (!this.isModified("password")) return;
    
        this.password = await bcrypt.hash(this.password, 10);
});

export const Admin = mongoose.model("Admin", adminSchema) 