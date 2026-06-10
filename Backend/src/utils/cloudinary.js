import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

//  Configure Cloudinary
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary  = async (localFilePath) => {
    if (!localFilePath) return null;

    try {
        const sanitizedPath = localFilePath.replace(/\\/g, "/");

        const response = await cloudinary.uploader.upload(sanitizedPath, {
            resource_type: "auto"
          });
            fs.unlinkSync(localFilePath);
        return response;
        
    } catch (error) {
        console.error("Cloudinary upload failed:", error);
       if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
        return null;
    }
};
export { uploadOnCloudinary };
