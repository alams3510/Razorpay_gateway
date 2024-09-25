const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
const dotenv = require("dotenv");
const crypto = require("crypto");

dotenv.config();

const razorpayInstance = new Razorpay({
  key_id: process.env.SECRET_ID,
  key_secret: process.env.SECRET_KEY,
});

router.post("/order", (req, res) => {
  const { amount } = req.body;
  try {
    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: crypto.randomBytes(10).toString("hex"),
    };

    razorpayInstance.orders.create(options, (err, order) => {
      if (err) {
        return res.status(500).json({ message: "something went wrong" });
      }
      res.status(200).json({ data: order });
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "internal server error" });
  }
});

router.post("/verify", (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;
  const sign = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSign = crypto
    .createHmac("sha256", process.env.SECRET_KEY)
    .update(sign.toString())
    .digest("hex");

  let isAuthentic = expectedSign === razorpay_signature;
  console.log("isAuthentic", isAuthentic);

  if (isAuthentic) {
    //saving data into database
    // const payment = new Payment({
    //     razorpay_order_id,
    //     razorpay_payment_id,
    //     razorpay_signature
    // });

    // // Save Payment
    // await payment.save();

    res.status(200).json({
      message: "Payement Successfully",
    });
  } else {
    res.status(500).json({ message: "Internal Server Error!" });
  }
});

module.exports = router;
