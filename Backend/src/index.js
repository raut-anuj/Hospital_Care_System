import dotenv from 'dotenv';

dotenv.config({
  path: './.env'
});

const PORT = process.env.PORT || 8000; // ✅ THIS WAS MISSING

import express from "express";
import { app } from "./app.js";
import connectDB from "./db/index.js";

connectDB()
.then(() => {
  app.listen(PORT, () => {
    console.log(`⚙️ Server is running at port : ${PORT}`);
  });
})
.catch((err) => {
  console.log("MONGO db connection failed !!! ", err);
});
