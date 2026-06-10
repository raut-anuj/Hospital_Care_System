import express from "express";
import bcrypt from "bcrypt";
 
const router = express.Router();

import { Admin } from "../models/admin.model.js";
import { Doctor } from "../models/doctor.model.js";
import { Patient } from "../models/patient.model.js";

router.post("/login", async (req, res) => {

// console.log("REQ BODY:", req.body); // 👈 YAHI LAGAO

  const { name, password } = req.body;

  try {
    // 🔴 ADMIN
    let admin = await Admin.findOne({ name });
    
    // console.log("ADMIN FOUND:", admin);
    
  if (admin && await bcrypt.compare(password, admin.password)) {
      return res.json({
    token: "admin-token",
    user: {
      name: admin.name,
      role: "admin"
    }
  });
}

    // 🔵 DOCTOR
    let doctor = await Doctor.findOne({ name });

    // console.log("Doctor FOUND:", doctor);

    if (doctor && await bcrypt.compare(password, doctor.password)) {
      return res.json({
    token: "doctor-token",
    user: {
      name: doctor.name,
      role: "doctor"
    }
  });
}

    // 🟢 PATIENT
    let patient = await Patient.findOne({ name });

    // console.log("PATIENT FOUND:", patient);
    // console.log("DB PASSWORD:", patient.password);
    // console.log("ENTERED PASSWORD:", password);

    if (patient && await bcrypt.compare(password, patient.password)){
  return res.json({
    token: "patient-token",
    user: {
      name: patient.name,
      role: "patient"
    }
  });
}

    return res.status(401).json({ message: "Invalid credentials" });

  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;