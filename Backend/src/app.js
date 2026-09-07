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

const defaultAllowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5500",
  "https://hospital-care-frontend.onrender.com",
];

const originsFromEnv = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((item) => item.trim())
  : [];

const allowedOrigins = Array.from(new Set([...defaultAllowedOrigins, ...originsFromEnv]));

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
  })
);

app.use(
  express.json({
    limit: "16kb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
  })
);

app.use(express.static("public"));
app.use(cookieParser());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/patient", patientRouter);
app.use("/api/v1/bill", billRouter);
app.use("/api/v1/payment", paymentRouter);
app.use("/api/v1/doctor", doctorRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/staff", staffRouter);

// Global JSON error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  return res.status(statusCode).json({
    statusCode,
    success: false,
    message: err.message || "Internal Server Error",
    errors: err.errors || [],
  });
});

export { app };

