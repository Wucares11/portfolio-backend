import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import cors from "cors";

const app = express();
dotenv.config();

app.use(express.json());

const allowedOrigins = [
  "http://localhost:5173", // local dev
  "https://protfolio-expertjohns-projects.vercel.app", // deployed frontend
];

//resolving error from cors
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    methods: "POST, GET",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.get("/", (req, res) => {
  res.send("Are you there!");
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
//routing
app.post("/send", (req, res) => {
  try {
    console.log("Incoming request body:", req.body); // Log for debugging

    const { email, name, message } = req.body;

    // Validate fields
    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_ADDRESS,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: email,
      to: process.env.GMAIL_ADDRESS,
      replyTo: email,
      subject: "New message from portfolio",
      html: `<p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Message:</strong><br>${message}</p>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("❌ Nodemailer failed to send email");
        console.error("Error name:", error.name);
        console.error("Error message:", error.message);
        console.error("Full error object:", error);
        console.error("Nodemailer error:", error); // Add this line
        return res
          .status(400)
          .json({ success: false, message: "Error sending email" });
      } else {
        return res
          .status(200)
          .json({ success: true, message: "Email sent successfully" });
      }
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
      message: "Internal server error",
    });
  }
});
