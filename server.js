const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const PORT = 3000;

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// ENDPOINT
app.post("/api/booking", async (req, res) => {
  const { name, domisili, trip } = req.body;

  if (!name || !domisili || !trip) {
    return res.status(400).json({ error: "Data tidak lengkap" });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "Booking Baru",
      text: `Nama: ${name}\nDomisili: ${domisili}\nTrip: ${trip}`
    });

    res.status(200).json({ message: "Email terkirim" });
  } catch (error) {
    console.error("Gagal kirim email:", error);
    res.status(500).json({ error: "Gagal kirim email" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server berjalan di http://localhost:${PORT}`);
});
