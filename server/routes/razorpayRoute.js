import express from "express";
import { createOrder, verifyPayment } from "../controllers/razorpayController.js";

const razorpayRoute = express.Router();

razorpayRoute.post("/create-order", createOrder);
razorpayRoute.post("/verify-payment", verifyPayment);

export default razorpayRoute;
