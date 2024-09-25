const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const paymentRoutes = require("./routes/payment");

const app = express();

dotenv.config();
app.use(cors());
app.use(express.json());
let PORT = 5000;

app.get("/", (req, res) => {
  res.send("Hi Shahbaz");
});

app.use("/api/payment", paymentRoutes);

app.listen(PORT, () => {
  console.log("server started at", PORT);
});
