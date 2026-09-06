import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Admin } from "../models/admin.model.js";
import { Patient } from "../models/patient.model.js"
import { Doctor } from "../models/doctor.model.js";
import { Staff } from "../models/staff.model.js"
import { DoctorSpecialization } from "../models/doctorSpecialization.model.js"
import jwt from "jsonwebtoken"
import { Appointment } from "../models/appointment.model.js";
import { Payment } from "../models/payment.model.js"
import { Bill } from "../models/bill.model.js"

const generateAccessAndRefreshToken = async(adminId)=>{
    try{
        const admin = await Admin.findById(adminId)
        if(!admin)
            throw new ApiError(400, "Admin not found")

            const accessToken = admin.generateAccessToken()
            const refreshToken = admin.generateRefreshToken()

        admin.refreshToken=refreshToken;

        await admin.save({ validateBeforeSave: false })
        
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

    const admin = await Admin.findOne({email}).select("-password -refreshToken");

    if(!admin)
        throw new ApiError(400, " Admin not found.") 

    res
    .status(200)
    .json(new ApiResponse(200, admin, {}))
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
            
        const admin = await Admin.findById(decodedToken?._id);
        if (!admin) throw new ApiError(401, "Invalid refresh token");

        // Check if the stored refresh token matches
        if (incomingRefreshToken !== admin.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or invalid");
        }

        // Generate new tokens
        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(admin._id);

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
    const { name, email, password } = req.body

    if(!name ||!email || !password)
        throw new ApiError(400, "Fill all the fields")

    if(email.trim() === "")
        throw new ApiError(400, "Enter the valid Input")

    if (!email.includes("@"))
        throw new ApiError(400, "Enter a valid email address")

    if (!/[0-9]/.test(password) || !/[^A-Za-z0-9\s]/.test(password))
        throw new ApiError(400, "Password must contain at least one number and one special character")

    const admin= await Admin.create({ 
            name:name.trim(),
            email:email.trim().toLowerCase(),
            password
        })

  res
  .status(201)
  .json(new ApiResponse(201, admin, "successfull registered"))

});

const loginUser = asyncHandler(async(req,res)=>{
    const { password, email } = req.body

    if( !password || !email )
        throw new ApiError(400, "All fields are required.")

    if( email.trim() === "")
        throw new ApiError(400, "Enter valid input.")

    //  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    //     if (!emailRegex.test(email)) 
    //       throw new ApiError(400, "Invalid email format");

    //    { // Admin.findOne({ email })
    //     // is sh login krwana
    //     }

    const admin = await Admin.findOne({ email });
          if (!admin) {
                  throw new ApiError(404, "Admin not found in database.")
          }

    const isPasswordCorrect = await admin.isPasswordCorrect(password)
    if(!isPasswordCorrect)
        throw new ApiError("Password is invalid.")

   const { accessToken, refreshToken } = await generateAccessAndRefreshToken(admin._id)

   const loggedInUser = await Admin.findById(admin._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true, }; 

    res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(
        200, 
        { 
           admin: loggedInUser, accessToken, refreshToken  
        },
         "Logged in Successfull"))
        //  console.log(admin);
         
        //  {
        //   _id: new ObjectId('69b1a86209bf202724877769'),
        //   name: 'Admin',
        //   password: '$2b$10$INazF//iMM/zjm3koW27Uec3MEYO3AeLIc1IgYf.8scQC/MgaR8ly',
        //   createdAt: 2026-03-11T17:37:38.530Z,
        //   updatedAt: 2026-03-11T17:37:38.530Z,
        //   __v: 0
        // }

});

const updateProfile = asyncHandler(async(req,res)=>{
    const{ email, contactNumber, age, address }=req.body

   const admin = await Admin.findOne({email})

// Agar email mil gaya,
// 👉 Toh admin ka poora data aa jata hai (jo bhi fields model me hain).

    if(!admin)
        throw new ApiError(400, "Admin not found")

        contactNumber: admin.contactNumber;
        age: admin.age;
        address: admin.address;
        await Admin.save();

   res.status(200).json(new ApiResponse(200, {
        contactNumber: admin.contactNumber,
        age: admin.age,
        address: admin.address
    }, "Details Updated"));
});                  

const logout = asyncHandler(async (req, res) => {
  
  await req.user.constructor.findByIdAndUpdate(
    req.user._id,
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
    .json(new ApiResponse(200, {}, "Logged out successfully"));
});
   
const changeCurrentPassword = asyncHandler(async(req, res)=>{
  const { oldPassword, newPassword }= req.body

  const admin = await Admin.findById(req.user?._id)
  const isPasswordCorrect = await admin.isPasswordCorrect(oldPassword)

  if(!isPasswordCorrect){
    throw new ApiError(400,"Invalid old password")
  }
  admin.password = newPassword
  await admin.save( {validateBeforeSave:false} )

  return res
  .status(200)
  .json(new ApiResponse(200,{},"Password changed successfully"))

});
 
const allDoctorsList = asyncHandler(async (req, res) => {

  const doctors = await Doctor.find();

  return res
    .status(200)
    .json(new ApiResponse(200, doctors, "All Doctors list"));
});

const allStaffsList = asyncHandler(async (req, res) => {

   const admin = await Admin.findById(req.user._id)

   if(!admin){
      throw new ApiError(404,"Admin not found")
   }

   const doctors = await Staff.find()

   return res
   .status(200)
   .json(new ApiResponse(200, doctors, "All Staffs list"))
});

const allPatientsList = asyncHandler(async (req, res) => {

  const patients = await Patient.find();

  return res
    .status(200)
    .json(new ApiResponse(200, patients, "All Patients list"));
});
           
const allDocSpec = asyncHandler(async(req,res)=>{
    const admin = await Admin.findById(req.params.id)

    if(!admin)
        throw new ApiError(400, "Invalid Id.")
    const special = await DoctorSpecialization.find()
    if( special.length === 0 )
    {
        return res.status(200)
        .json(new ApiResponse(200, [], "No records found"))
    }
    return res.status(200)
    .json(new ApiResponse(200, special ,"Records."))
}); 
   
const deleteUser = asyncHandler(async(req,res)=>{
    const { emailId } = req.body
    if(!emailId || emailId.trim() == "")
        throw new ApiError(400, "Field required.")
    const patient = await Patient.findOneAndDelete({ emailId })
    const doctor = await Doctor.findOneAndDelete({ emailId })
    const staff = await Staff.findOneAndDelete({ emailId })
    if (!patient && !doctor && !staff) {
    throw new ApiError(404, "Invalid EmailId");}

    return res.status(200)
    .json(new ApiResponse(200, {}, "Record deleted."))
});

const Appointments = asyncHandler(async(req,res)=>{
    const { emailId } = req.body
    const { date } = req.body

        if (!date) {
  throw new ApiError(400, "Date field is required.");}

    if(!emailId || emailId.trim()=="")  
        throw new ApiError(404, "Field required.")

   const doctor = await Doctor.findOne({ emailId })
   if(!doctor)
    throw new ApiError(404, "No doctor found.")

   //optional
//  const admin = await Admin.findById(req.params.id)
//     if(!admin)
//         throw new ApiError(400, "Invalid Id.")

// Count appointments on the given date
    const dayStart = new Date(date);
    dayStart.setHours(0,0,0,0);

    const dayEnd = new Date(date);
    dayEnd.setHours(23,59,59,999);

    const todayAppointments = await Appointment.countDocuments({
        doctorId: doctor._id,
        date:  { $gte: dayStart, $lte: dayEnd }
    });
        return res.status(200)
        .json(new ApiResponse(200, todayAppointments))
});

const aboutPaitent = asyncHandler(async(req,res)=>{
    const { name } = req.body
    const admin = await Admin.findById(req.user._id)
    if(!admin)
        throw new ApiError(400, "Invalid Admin.")
    const patient = await Patient.findOne({ name }).select("-password, -refreshToken")
    if(!patient)
        throw new ApiError(400, "Invalid Patient EmailId.")
    return res.status(200)
    .json(new ApiResponse(200, patient, "Patient Record."))
});

const aboutStaff = asyncHandler(async(req,res)=>{
const { name } = req.body
    const admin = await Admin.findById(req.user._id)
    if(!admin)
        throw new ApiError(400, "Invalid Admin.")
    const staff = await Staff.findOne({ name }).select("-password, -refreshToken")
    if(!staff)
        throw new ApiError(400, "Invalid Staff EmailId.")
    return res.status(200)
    .json(new ApiResponse(200, staff, "Staff Record."))
});

const aboutDoctor = asyncHandler(async(req,res)=>{
const { name } = req.body
    const admin = await Admin.findById(req.user._id)
    if(!admin)
        throw new ApiError(400, "Invalid Admin.")
    const doctor = await Doctor.findOne({ name }).select("-password, -refreshToken")
    if(!doctor)
        throw new ApiError(400, "Invalid Doctor EmailId.")
    return res.status(200)
    .json(new ApiResponse(200, doctor, "Doctor Record."))
});

const getPaymentsByMethod = asyncHandler(async (req, res) => {
    const { method ,date } = req.body;

    if (!date)
        throw new ApiError(400, "Date is required");

    if (!method || method.trim() === "")
        throw new ApiError(400, "Payment method is required.");

    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const adminId = req.params.id;
    const admin = await Admin.findById(adminId);
    if (!admin)
        throw new ApiError(404, "Invalid Admin Id.");

    const payment = await Payment.find({
        method: method.trim(),
        date: {
            $gte: startDate,
            $lte: endDate
        }
    });

    if (payment.length === 0)
        throw new ApiError(404, "No payment record found with this method.");

    return res
        .status(200)
        .json(new ApiResponse(200, payment, "Payment history found with this method"));
});

const getDailyRevenue = asyncHandler(async (req, res) => {
    const { date, status } = req.body
    const admin = await Admin.findById(req.params.id);
    if (!admin) {
    throw new ApiError(404, "Admin not found");}
    if( !status || status.trim()===  "")
        throw new ApiError(400, 'Status is required.')

    const startDate = new Date(date)
    startDate.setHours( 0, 0, 0, 0 )
    const endDate = new Date(date)
    endDate.setHours( 23, 59, 59, 999 )

    if(!date)
       throw new ApiError(400, "Date is required");
    // const payment = await Payment.find({
    //      date:{
    //         $gte: startDate,
    //         $lte: endDate
    //      },
    //      status
    // });
    // if (payment.length === 0)
    //      throw new ApiError(400, "No payment found with this date.");
    // const totalamount = payment.reduce((sum,amt)=>sum + (amt.amount||0),0)

    // is sh better approach wala kaam

    const totalamount = await Payment.aggregate([
        {
            $match:{
                status: status,
                date:{
                    $gte:startDate,
                    $lte:endDate
                }
            }
        },
            {
                $group:{
                _id: null, // "$date", "$status"
                revenue: { $sum: "$amount" }
               }
            }
        ]
    );

    const totalRevenue = totalamount[0]?. revenue|| 0
    
    return res
    .status(200)
    .json(new ApiResponse(200, totalRevenue, "Total Revenue of this date."))

});

const getHospitalRevenue = asyncHandler(async (req, res) => {
    const { status } = req.body
    const admin = await Admin.findById(req.params.id);
    if (!admin) {
    throw new ApiError(404, "Admin not found");}
    if( !status || status.trim()===  "")
        throw new ApiError(400, 'Status is required.')
    const totalRevenue = await Payment.aggregate([
        {
            $match:{
                status: status
            }
        },
        {
            $group:{
                _id: null,
                revenue: {$sum: "$amount"}
            }
        }
    ])
    const totalamount = totalRevenue[0]?.revenue || 0
    return res
    .status(200)
    .json(new ApiResponse(200, totalamount, "Total Revenue of this date."))
});

const getMonthlyRevenue = asyncHandler(async (req, res) => {
    const { date, status } = req.body;

    const admin = await Admin.findById(req.params.id);
    if (!admin) {
        throw new ApiError(404, "Admin not found");
    }

    if (!status || status.trim() === "") {
        throw new ApiError(400, 'Status is required.');
    }

    if (!date) {
        throw new ApiError(400, "Date is required");
    }

    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const totalRevenueAgg = await Payment.aggregate([
        {
            $match: {
                status: status,
                date: { $gte: startDate, $lte: endDate }
            }
        },
        {
            $group: {
                _id: null, // ek hi total chahiye
                revenue: { $sum: "$amount" }
            }
        }
    ]);

    const totalRevenue = totalRevenueAgg[0]?.revenue || 0;

    return res
        .status(200)
        .json(new ApiResponse(200, totalRevenue, "Total Revenue of this date."));
});

const getAllBills = asyncHandler(async (req, res) => {
   const admin = await findById(req.params.id)
   if(!admin)
    throw new ApiError(400, "Inavlid Admin.")

   const bill = await Bill.find();

   if( bill.length == 0 )
    throw new ApiError(400, "No bill found.")

    return res
    .status(200) 
    .json(new ApiResponse(200, bill, "Total Bills"))

});

const dateWiseBills = asyncHandler(async (req, res) => {
    const admin = await Admin.findById(req.params.id)
    if(!admin)
        throw new ApiError(400, "Invalid Id.")
    const { date } = req.body
    if( !date || date.trim() == 0 )
        throw new ApiError(" Date field required. ")

    const startDate = new Date(date)
    startDate.setHours(0, 0, 0, 0)
    const endDate = new Date(date)
    endDate.setHours(24, 59, 59, 999)
    const bill = await Bill.find({
        date
    });
    if( bill.length == 0 )
        throw new ApiError(400, `No bill found for ${date}`);
    return res
    .status(200)
    .json(new ApiResponse(200, bill, `Bills till ${date}`));

});

export { 
    logout, 
    loginUser, 
    registerUser, 
    updateProfile,
    getProfile,
    refreshAccessToken,
    changeCurrentPassword,
    generateAccessAndRefreshToken,
    deleteUser,
    
    aboutPaitent, 
    aboutDoctor,  
    aboutStaff,  
    
    Appointments,
    allDocSpec,
    
    allDoctorsList, 
    allStaffsList, 
    allPatientsList,
    
    getHospitalRevenue,
    getPaymentsByMethod,
    getDailyRevenue,
    getMonthlyRevenue,
    getAllBills,
    dateWiseBills
    
}