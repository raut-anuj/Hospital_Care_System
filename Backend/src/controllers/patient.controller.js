import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Patient } from "../models/patient.model.js";
import jwt from "jsonwebtoken"
import { Doctor } from "../models/doctor.model.js";
import { Appointment } from "../models/appointment.model.js";
import { Bill } from "../models/bill.model.js"
import { Payment } from "../models/payment.model.js"

const generateAccessandRefreshToken = async(patientId)=>{
    try{
        const patient = await Patient.findById(patientId)
        if(!patient)
            throw new ApiError(400, "patient not found")

            const accessToken = patient.generateAccessToken()
            const refreshToken = patient.generateRefreshToken()

        patient.refreshToken= refreshToken;

        await patient.save({ validateBeforeSave:false })
        
        return { accessToken, refreshToken }
    }
    catch(error){
    throw new ApiError(500, "Error occur while generating Access and Refresh Token.")
}
};

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
            
        const patient = await Patient.findById(decodedToken?._id);
        if (!patient) throw new ApiError(401, "Invalid refresh token");

        // Check if the stored refresh token matches
        if (incomingRefreshToken !== patient.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or invalid");
        }

        // Generate new tokens
        const { accessToken, refreshToken } = await generateAccessandRefreshToken(patient._id)

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

const registerUser = asyncHandler(async (req, res) => {

const { name, password, email, confirmPassword } = req.body

// validation
if(!name || !password || !email || !confirmPassword){
    throw new ApiError(400, "Fill all the fields")
}

if(name.trim() === ""){
    throw new ApiError(400, "Enter valid name")
}

if (password !== confirmPassword) {
  throw new ApiError(400, "Password and Confirm Password do not match");
}

// create patient
const patient = await Patient.create({
    name: name.trim(),
    email,
    password,
})

// response
res.status(201).json(
    new ApiResponse(
        201,
        {
            // patientId: patient._id,
            name: patient.name,
            email
        },
        "Successfully registered"
    )
)
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const patient = await Patient.findOne({ email });

  if (!patient) {
    throw new ApiError(404, "Patient not found");
  }

  const isPasswordValid = await patient.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid password");
  }

  const token = patient.generateAccessToken();

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user: {
          _id: patient._id,
          name: patient.name,
          email: patient.email,
        },
        token,
      },
      "Login successful"
    )
  );
});

const logout = asyncHandler(async (req, res) => {
  
    await Patient.findByIdAndUpdate(
    req.patient?._id, 
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
    .json(new ApiResponse(200, {}, "Patient logged out"));
});

const forgotPassword = asyncHandler(async (req, res) => {
  console.log(req.body);
  const { email, newPassword, confirmPassword, action } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  const patient = await Patient.findOne({ email });

  if (!patient) {
    throw new ApiError(404, "Patient not found");
  }

  // Step 1: sirf email check
  if (action === "check-email") {
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Email verified successfully"));
  }

  // Step 2: password update
  if (!newPassword || !confirmPassword) {
    throw new ApiError(400, "Password and confirm password are required");
  }

  if (newPassword !== confirmPassword) {
    throw new ApiError(400, "Passwords do not match");
  }

  patient.password = newPassword;
  await patient.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password updated successfully"));
});

const changeCurrentPassword = asyncHandler(async(req, res)=>{
  const { oldPassword, newPassword }= req.body

  const patient = await Patient.findById(req.user?._id)
  const isPasswordCorrect=await patient.isPasswordCorrect(oldPassword)

  if(!isPasswordCorrect){
    throw new ApiError(400,"Invalid old password")
  }
  patient.password = newPassword
  await patient.save( {validateBeforeSave:false} )

  return res
  .status(200)
  .json(new ApiResponse(200,{},"Password changed successfully"))

});

const getMyBills = asyncHandler(async(req, res)=>{
    const patient = await Patient.findById(req.params.id)
    if(!patient)
        throw new ApiError(400, "Invalid Patient.")

    const bill = await Bill.find({
        patientId: patient.id
    })

    if( bill.length == 0 )
        throw new ApiError(400, "No Payment found.")

    return res
    .status(200)
    .json(new ApiResponse(200, bill, "Payments."))
});

const getPaymentHistory = asyncHandler(async(req, res)=>{
    const patient = await Patient.findById(req.params.id)
    if(!patient)
        throw new ApiError(400, "Invalid Patient.")
    const payment = await Payment.find({
        patientId: patient._id
    })

    if( payment.length == 0 )
        throw new ApiError(400, "No Payment found.")

    return res
    .status(200)
    .json(new ApiResponse(200, payment, "Payments."))
});

const appointment = asyncHandler(async(req,res)=>{
    
    const { name, date, drname }= req.body

    if( [ name, date, drname ].some(fields => !fields || fields.trim() === "") ) {
        throw new ApiError(400, "All fields are required");  }

       const patient = await Patient.findOne({ name })

       if(!patient)
        throw new ApiError(404, "No data found about this patient.")
      
       const doctor = await Doctor.findOne({ drname }) 

       if(!doctor)
        throw new ApiError(404, "No data found about this Doctor.")

    //     const existingAppointment = await Appointment.findOne({
    //         doctorId: doctor._id,
    //         date,
    //         time 
    //     });

    //     if (existingAppointment) {
    //        return res
    //        .status(409)
    //        .json(new ApiResponse(409, {}, "Doctor already booked at this time")) };

    //    const anotherAppointment = await Appointment.findOne({
    //         patientId: patient._id,
    //         doctorId: doctor._id,
    //         date
    //     })

    //     // 1 din mh ek he appoinment ho gh, us sh jayda nhi. 
    //     if(anotherAppointment){
    //         return res.status(201)
    //         .json(new ApiResponse(201, null, "Two appointment are not allowed in a day."))
    //     }
        
        const newAppointment = new Appointment({
            doctorId: doctor._id,
             date: new Date(date), 
            // time: time,
            patientId: patient._id,
            amount: 1000
          });
          console.log(newAppointment);

          await newAppointment.save();

const saved = await Appointment.findById(newAppointment._id);

return res.status(201).json(
  new ApiResponse(
    201,
    {
      ...saved.toObject(),
      formattedDate: saved.date?.toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
      }),
    },
    "Appointment is available."
  ))
})

const createAppointment = asyncHandler(async (req, res) => {
 const { name, age, email, date, drname, gender, time } = req.body;

 if (
    [name, email, date, drname, gender, time].some(
      (field) => !field || field.trim() === ""
    ) ||
    !age
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const doctor = await Doctor.findOne({ drname });

  if (!doctor) {
    throw new ApiError(404, "Doctor not found");
  }

  let patient = await Patient.findOne({ email });

  if (!patient) {
    patient = await Patient.create({
      name,
      age,
      email,
      gender,
    });
  }

  const newAppointment = await Appointment.create({
  patientId: patient._id,
  doctorId: doctor._id,
  date: new Date(date),
  time: time,
  amount: doctor.fee || 1000,
});

  const savedAppointment = await Appointment.findById(newAppointment._id)
    .populate("patientId", "name age email gender")
    .populate("doctorId", "drname fee specialization");

  return res.status(201).json(
    new ApiResponse(
      201,
      savedAppointment,
      "Appointment created successfully"
    )
  );
});

const getProfile = asyncHandler(async(req,res)=>{
    const { email } = req.body

    if(!email || email.trim()==="" )
        throw new ApiError(400, "Email is required")

    const patient = await Patient.findOne({email}).select("-password -refreshToken");

    if(!patient)
        throw new ApiError(400, " Patient not found.") 

    res
    .status(200)
    .json(new ApiResponse(200, patient, {}))
});

const updateProfile = asyncHandler(async(req,res)=>{
    const{ email, contactNumber, age, address }=req.body

   const patient = await Patient.findOne({email})

    if(!patient)
        throw new ApiError(400, "patient not found")

        patient.contactNumber = contactNumber
        patient.age = age
        patient.address = address

        await patient.save()

   res.status(200).json(new ApiResponse(200, {
        contactNumber: patient.contactNumber,
        age: patient.age,
        address: patient.address
    }, "Details Updated"));
});

const getAppointments =asyncHandler(async(req,res)=>{
    const name = req.query.name || req.body.name;

    
    if(!name || name.trim() === "")
        throw new ApiError (400, "Name is required")

    const patient = await Patient.findOne({ name })
   
    if(!patient)
         throw new ApiError (400, "Patient is not found.")

       const getApp = await Appointment.find({patientId: patient._id})
       
        .populate("patientId", "name")   // 👈 patient name
        .populate("doctorId", "drname"); // 👈 doctor name

       if(getApp.length === 0){
        return res
        .status(201)
        .json(new ApiResponse(201, [], "No Appointments found."))
       }
       
       else {
        return res
        .status(200)
        .json(new ApiResponse(201, getApp, "Appointments fetched successfully.")) }
});

const cancelAppointment =asyncHandler(async(req,res)=>{
    const { email }=req.body

    if(!email || email.trim() === "")
        throw new ApiError(400, "Email is required")

   const patient = await Patient.findOne({ email })
   if(!patient)
     throw new ApiError(400, "No patient found")

    // Agar tum all appointments delete karna chahte ho
   const cancelApp = await Appointment.deleteMany({ patientId : patient._id })

    //    Agar tum sirf ek appointment delete karna chahte ho
    //    const cancelApp = await Appointment.findByIdAndDelete(appointmentId)

    if(cancelApp.deletedCount === 0)
    {
        return res.status(200).json({
            status: 200,
            message: "No appointments to cancel",
            data: {}
        })
    }

            else {
                return res
                .status(200)
                .json(new ApiResponse(200, {}, "Appointments canceled."))
            }
});

export {
    //basics functions
    generateAccessandRefreshToken,
    refreshAccessToken,
    registerUser,
    changeCurrentPassword,
    loginUser,
    getProfile,
    updateProfile,
    logout,

    // advance functions
    cancelAppointment,
    getAppointments,
    createAppointment,
    appointment,
    getMyBills,
    getPaymentHistory,
    forgotPassword
}