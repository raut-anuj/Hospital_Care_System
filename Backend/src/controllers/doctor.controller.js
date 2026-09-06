import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Doctor } from "../models/doctor.model.js";
import jwt from "jsonwebtoken"
import { Patient } from "../models/patient.model.js"
import { Appointment } from "../models/appointment.model.js";
import { MedicalRecord } from "../models/medicalRecord.model.js";
import { get } from "http";

const generateAccessAndRefreshToken = async(doctorId)=>{
    try{
        const doctor = await Doctor.findById(doctorId)
        if(!doctor)
            throw new ApiError(400, "Doctor not found")

            const accessToken = doctor.generateAccessToken()
            const refreshToken = doctor.generateRefreshToken()

        doctor.refreshToken=refreshToken;

        await doctor.save({ validateBeforeSave:false })
        
        return { accessToken, refreshToken }
    }
    catch(error){
    throw new ApiError(500, "Error occur while generating Access and Refresh Token.")
}
};

const getProfile = asyncHandler(async(req,res)=>{
    const { email } = req.body

    if(!email || email.trim()==="" )
        throw new ApiError(400, "Email is required")

    const doctor = await Doctor.findOne({email}).select("-password -refreshToken");

    if(!doctor)
        throw new ApiError(400, " Doctor not found.") 

    res
    .status(200)
    .json(new ApiResponse(200, doctor, {}))
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    // Get refresh token from [cookies or body]
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request");
    }
    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET );
            
        const doctor = await Doctor.findById(decodedToken?._id);
        if (!doctor) throw new ApiError(401, "Invalid refresh token");

        // Check if the stored refresh token matches
        if (incomingRefreshToken !== doctor.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or invalid");
        }

        // Generate new tokens
        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(doctor._id);

        // Cookie options
        const options = {
            httpOnly: true,
            secure: true,
        }; 

        // Send response with new tokens
        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken },
                    "Access token refreshed successfully"
                )
            );
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token");
    }
});

const registerUser = asyncHandler(async(req,res)=>{
    //yha pr aur bhi fields dena ha toh yaad rakhna. 
    // specialization, experience, salary, workedIn, education
    const { name, email, age, password, fee, specialization, qualification, address, sex} = req.body

    if(!name || !email || !password || age === undefined || !sex)
        throw new ApiError(400, "Fill all the fields")

    if(sex.trim() === "" || name.trim() === "" || email.trim() === "" || age <= 0)
        throw new ApiError(400, "Enter the valid Input")

    if (!email.includes("@"))
        throw new ApiError(400, "Enter a valid email address")

    if (!/[0-9]/.test(password) || !/[^A-Za-z0-9\s]/.test(password))
        throw new ApiError(400, "Password must contain at least one number and one special character")

    const doctor= await Doctor.create({ 
            name: name.trim(),
            email: email.trim().toLowerCase(),
            age,
            password,
            fee,
            qualification,
            address,
            specialization,
            sex
        })      

  res.status(201).json(
    new ApiResponse(
        201,
        {
           name: doctor.name,
           sex: doctor.sex,
           age: doctor.age,
           email: doctor.email,
           fee: doctor.fee,
           address: doctor.address,
           qualification: doctor.qualification,
           specialization: doctor.specialization
        },
        "Successfully registered"
    )
)

});

const updateProfile = asyncHandler(async(req,res)=>{
    const{ email, contactNumber, age, address }=req.body

   const doctor = await Doctor.findOne({email})

// Agar email mil gaya,
// 👉 Toh doctor ka poora data aa jata hai (jo bhi fields model me hain).

    if(!doctor)
        throw new ApiError(400, "Doctor not found")

        contactNumber: doctor.contactNumber;
        age: doctor.age;
        address: doctor.address;
        await Doctor.save();

   res.status(200).json(new ApiResponse(200, {
        contactNumber: doctor.contactNumber,
        age: doctor.age,
        address: doctor.address
    }, "Details Updated"));
});
 
const loginUser = asyncHandler(async(req,res)=>{
    const { password, email } = req.body

    if( !password || !email )
        throw new ApiError(400, "All fields are required.")

    if( email.trim() === "")
        throw new ApiError(400, "Enter valid input.")

    const doctor = await Doctor.findOne({ email: email.trim().toLowerCase() })

    const isPasswordCorrect = await doctor.isPasswordCorrect(password)
    if(!isPasswordCorrect)
        throw new ApiError("Password is invalid.")

   const { accessToken, refreshToken } = await generateAccessAndRefreshToken(doctor._id)

   const loggedInUser = await Doctor.findById(doctor._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true, }; 

    res.status(200).json(
new ApiResponse(
200,
    {
    doctor:{
       name: loggedInUser.name,
        age: loggedInUser.age,
        qualification: loggedInUser.qualification,
        specialization: loggedInUser.specialization,
        fee: loggedInUser.fee,
        },
    accessToken,
    refreshToken
    },
"Logged in Successfully"));
});

const logout = asyncHandler(async (req, res) => {
  
    await Doctor.findByIdAndUpdate(
    req.doctor?._id,   // 👈 middleware se doctor attach hona chahiye
    { $unset: { refreshToken: 1 } },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "Doctor logged out"));
});

const gettAllpatient = asyncHandler(async(req,res)=>{
    const doctorId = req.user?._id || req.doctor?._id;

    if(!doctorId)
        throw new ApiError (400, "Invalid Doctor Id.")

    const doctor = await Doctor.findById(doctorId);
    if(!doctor)
        throw new ApiError (400, "Invalid Doctor Id.")

    const allPatient = await MedicalRecord.find({ doctorId: doctor._id })
        .populate("patientId", "name email")
        .lean();

    return res
        .status(200)
        .json(new ApiResponse(200, allPatient, "All Records."));
});

const changeCurrentPassword = asyncHandler(async(req, res)=>{
  const { oldPassword, newPassword }= req.body

  const doctor = await Doctor.findById(req.user?._id)
  const isPasswordCorrect = await doctor.isPasswordCorrect(oldPassword)

  if(!isPasswordCorrect){
    throw new ApiError(400,"Invalid old password")
  }
  doctor.password = newPassword
  await doctor.save( {validateBeforeSave:false} )

  return res
  .status(200)
  .json(new ApiResponse(200,{},"Password changed successfully"))

});

const getPatientProfile = asyncHandler(async(req,res)=>{
    const { emailId } = req.body

    if( !emailId )
        throw new ApiError(400, "All fields are required.")

    if( emailId.trim() === "" )
        throw new ApiError(400, "Enter valid input.")

    const doctorid = await Doctor.findById(req.doctor.id)

    if(!doctorid)
        throw new ApiError (400, "Invalid Doctor Id.")

    const patient = await Patient.findOne({ emailId }).select("-password, -refreshToken")

    if(!patient)
       throw new ApiError (400, "Invalid EmailId.")

        return res
        .status(201)
        .json(new ApiResponse(200, patient, "Patient Records."))
        
});

const getTodayAppointments = asyncHandler(async (req, res) => {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
        throw new ApiError(400, "No doctor found.");
    }

    // aaj ki start aur end time nikaal lo
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const appointment = await Appointment.find({
        doctorId: doctor._id,
        date: {
            $gte: startOfDay,
            $lte: endOfDay
        }
    });

    if (appointment.length === 0) {
        throw new ApiError(400, "No Appointment for today.");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, appointment, "All Appointment of today."));
});

const getAllAppointments = asyncHandler(async (req, res) => {
const doctorId = req.user?._id || req.doctor?._id;

if (!doctorId) {
    throw new ApiError(400, "No doctor found.");
}

const doctor = await Doctor.findById(doctorId);
if (!doctor) {
    throw new ApiError(400, "No doctor found.");
}

const appointment = await Appointment.find({
    doctorId: doctor._id,
    status: "scheduled"
}).populate("patientId", "name").sort({ date: 1 });

return res
    .status(200)
    .json(new ApiResponse(200, appointment, "All scheduled appointments fetched successfully."));
});

export{
    logout,
    loginUser,
    registerUser,

    updateProfile,
    getProfile,
    refreshAccessToken,
    changeCurrentPassword,
    generateAccessAndRefreshToken,

    getPatientProfile,
    gettAllpatient,
    getTodayAppointments,
    getAllAppointments
}