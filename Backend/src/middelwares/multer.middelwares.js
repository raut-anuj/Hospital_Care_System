import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/temp"); // make sure this folder exists
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    // replace spaces and special characters
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
    file.originalname

// User ne jo file upload ki hai uska original name
// .replace(/[^a-zA-Z0-9.-]/g, "_")

// Spaces aur special characters remove karta hai
// Unko _ se replace karta hai

// 👉 Example:
// my photo@2024!.jpg
// ↓
// my_photo_2024_.jpg

    cb(null, file.fieldname + "-" + uniqueSuffix + "-" + safeName);
    
    // file.fieldname → input field ka naam (e.g. avatar)
// uniqueSuffix → unique number based on timestamp and random number
// safeName → cleaned filename
// 👉 Final file name example:
// avatar-1695200000000-123456789-my_photo.jpg

  }
});


export const upload = multer({ storage });

