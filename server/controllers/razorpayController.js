import Razorpay from "razorpay";
import crypto from "crypto";
import Order from "../models/Order.js";

const razorpay = new Razorpay({
  key_id: 'rzp_test_R8gShkaatoTiCl',
  key_secret:'GYk6iLu4erKnq3mt0a5NocO3',
});

// Create Razorpay order
export const createOrder = async (req, res) => {
  try {
    const {amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: "Invalid amount" });
    }

    const options = {
      amount: Math.round(amount * 100), // amount in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    console.log("Created order:", order);

    res.json({ success: true, order });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Verify Razorpay payment

export const verifyPayment = async (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature, 
      userId, 
      items, 
      address, 
      amount 
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: "Missing payment details" });
    }

    // Verify Razorpay signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Payment verification failed" });
    }

    // Save order in MongoDB
    const newOrder = await Order.create({
      userId,
      items,
      amount,
      address,
      status: "Order Placed",
      paymentType: "Online",
      isPaid: true,
    });

    return res.status(201).json({ 
      success: true, 
      message: "Payment verified and order placed successfully",
      order: newOrder 
    });

  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

