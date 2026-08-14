import express from "express";
import cors from 'cors'
import cookieParser from "cookie-parser"
import patientRouter from "./routes/patient.routes.js";
import doctorRouter from "./routes/doctor.routes.js";
import adminRouter from "./routes/admin.routes.js";
import staffRouter from "./routes/staff.routes.js";
import billRouter from "./routes/bill.routes.js";
import paymentRouter from "./routes/payment.routes.js";
import authRouter from "./routes/auth.routes.js";

const app= express();
// const cors = require("cors");

app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:5173", // set CORS_ORIGIN in env for deployed frontend
  credentials: true
}));

app.use(express.json({
    limit:"16kb"  }))

    app.use(express.urlencoded({ 
    extended: true, 
    limit: "16kb" }));

app.use(express.static("public"))
app.use(cookieParser())


app.use("/api/v1/auth", authRouter);
app.use("/api/v1/patient",patientRouter);
app.use("/api/v1/bill",billRouter);
app.use("/api/v1/payment",paymentRouter);
app.use("/api/v1/doctor",doctorRouter);
app.use("/api/v1/admin",adminRouter);
app.use("/api/v1/staff",staffRouter);

export {app}
