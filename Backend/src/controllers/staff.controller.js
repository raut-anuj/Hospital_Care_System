import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Staff } from "../models/staff.model.js";
import jwt from "jsonwebtoken"
import { Doctor } from "../models/doctor.model.js";
import { Appointment } from "../models/appointment.model.js";
import { Admin } from "../models/admin.model.js";

const generateAccessAndRefreshToken = async(staffId)=>{
    try{
        const Staff = await Staff.findById(staffId)
        if(!Staff)
            throw new ApiError(400, "Staff not found")

            const accessToken = Staff.generateAccessToken()
            const refreshToken = Staff.generateRefreshToken()

        Staff.refreshToken=refreshToken;

        await Staff.save( {validation:false} )
        
        return { accessToken, refreshToken }
    }
    catch(error){
    throw new ApiError(500, "Error occur while generating Access and Refresh Token.")
}
}

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
            
        const Staff = await Staff.findById(decodedToken?._id);
        if (!Staff) throw new ApiError(401, "Invalid refresh token");

        // Check if the stored refresh token matches
        if (incomingRefreshToken !== Staff.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or invalid");
        }

        // Generate new tokens
        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(Staff._id);

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
})

const registerUser = asyncHandler(async(req,res)=>{
    //yha pr aur bhi fields dena ha toh yaad rakhna. 
    const { name, password } = req.body

    if(!name || !password)
        throw new ApiError(400, "Fill all the fields")

    if(name.trim() === "")
        throw new ApiError(400, "Enter the valid Input")

    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    //     if (!emailRegex.test(emailId)) {
    //       throw new ApiError(400, "Invalid emailId format");
    //     }

    const staff= await Staff.create({ 
            name:name.trim(),
            // age,
            password
        })

        console.log(staff);

  res
  .status(201)
  .json(new ApiResponse(201, staff, "successfull registered"))

})

const loginUser = asyncHandler(async(req,res)=>{
    const { password, name, emailId } = req.body

    if( !password || !name || !emailId )
        throw new ApiError(400, "All fields are required.")

    if( name.trim() === "" || emailId.trim() === "" )
        throw new ApiError(400, "Enter valid input.")

     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailId)) 
          throw new ApiError(400, "Invalid emailId format");

    const isPasswordCorrect = await Staff.isPasswordCorrect(password)
    if(!isPasswordCorrect)
        throw new ApiError("Password is invalid.")

    const Staff = await Staff.findOne( { emailId } )

   const { accessToken, refreshToken } = generateAccessAndRefreshToken(Staff._id)

   const loggedInUser = await Staff.findById(Staff._id).select("-password -refreshToken")

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
           Staff: loggedInUser, accessToken, refreshToken  
        },
         "Logged in Successfull"))

})

const logout = asyncHandler(async (req, res) => {
  
    await Staff.findByIdAndUpdate(
    req.staff?._id,   // 👈 middleware se doctor attach hona chahiye
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

const getProfile = asyncHandler(async(req,res)=>{
    const { emailId } = req.body

    if(!emailId || emailId.trim()==="" )
        throw new ApiError(400, "Email is required")

    const Staff = await Staff.findOne({emailId}).select("-password -refreshToken");

    if(!Staff)
        throw new ApiError(400, " Staff not found.") 

    res
    .status(200)
    .json(new ApiResponse(200, Staff, {}))
})

const updateProfile = asyncHandler(async(req,res)=>{
    const{ emailId, contactNumber, age, address }=req.body

   const Staff = await Staff.findOne({emailId})

    if(!Staff)
        throw new ApiError(400, "Staff not found")

        contactNumber: Staff.contactNumber;
        age: Staff.age;
        address: Staff.address;
        await Staff.save();

   res.status(200).json(new ApiResponse(200, {
        contactNumber: Staff.contactNumber,
        age: Staff.age,
        address: Staff.address
    }, "Details Updated"));
}) 

const changeCurrentPassword = asyncHandler(async(req, res)=>{
  const { oldPassword, newPassword }= req.body

  const Staff = await Staff.findById(req.user?._id)
  const isPasswordCorrect=await Staff.isPasswordCorrect(oldPassword)

  if(!isPasswordCorrect){
    throw new ApiError(400,"Invalid old password")
  }
  Staff.password = newPassword
  await Staff.save( {validateBeforeSave:false} )

  return res
  .status(200)
  .json(new ApiResponse(200,{},"Password changed successfully"))

})

const getAllStaff = asyncHandler(async(req,res)=>{

  const admin = await Admin.findById(req.params.id)
  if(!admin)
    throw new ApiError(404, "Invalid Id.")
  const staff = await Staff.find().select("-password -refreshToken");
  if(staff.length === 0)
    {return res
    .status(200)
    .json(new ApiResponse(200, [], "No staff details found."))}
    else{
        return res
        .status(200)
        .json(new ApiResponse (200,staff,"Details of staff."))
    }
}) 

const getStaffByRole = asyncHandler(async(req,res)=>{
    const { role } = req.query;
    const admin = await Admin.findById(req.params.id)

    if(!admin)
    throw new ApiError(404, "Invalid Id.")

    const staff = await Staff.find({ role }).select("-password -refreshToken")

    if( staff.length === 0 ){
        return res
        .status(200)
        .json(new ApiResponse(200, [], "No staff found."))}
        
        return res
        .status(200)
        .json(new ApiResponse(200, staff, "Staff details."))
})

const updateStaffRole = asyncHandler(async(req,res)=>{
    const { role } = req.body;
    if( !role || role.trim()=="" )
        throw new ApiError(400, "Role field is required.") 

    const staff = await Staff.findById(req.params.id).select("-password -refreshToken")
    if(!staff)
        throw new ApiError(404, " Staff not found.")
    staff.role=role
    await staff.save();
    return res
    .status(200)
    .json(new ApiResponse(200, staff, "Staff Role updated."))  
})

const deleteStaff = asyncHandler(async(req,res)=>{
    const { emailId } = req.body
    if( !emailId || emailId.trim()=="" )
        throw new ApiError(400, "Email is required.") 

    const staff = await findOne({ emailId })
    if(!staff)
        throw new ApiError(404, " Staff not found.")
    await Staff.findByIdAndDelete(staff._id);
    return res
    .status(200)
    .json(new ApiResponse(200, [], "Successfully deleted."))
})

export{
    generateAccessAndRefreshToken,
    refreshAccessToken,
    registerUser,
    loginUser,
    logout,
    getProfile,
    updateProfile,
    changeCurrentPassword,
    getAllStaff,
    getStaffByRole,
    updateStaffRole,
    deleteStaff
}