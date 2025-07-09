import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import cors from "cors"

const app = express();
dotenv.config();


app.use(express.json())

//resolving error from cors
app.use(cors({
    origin: "http://localhost:5173",
    methods: "POST, GET",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
}))


 app.get('/',(req,res) => {
    res.send('Are you there!')
})


const port = process.env.PORT || 5000;

app.listen(port,()=>{
   console.log(`Server listening on port ${port}`);
})
//routing
app.post("/send",(req,res)=>{

    try {
        const {body} = req;
        const {email,name,message} = body;

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.GMAIL_ADDRESS ,
                pass: process.env.GMAIL_APP_PASSWORD
            }
        });

        const mailOptions = {
            from: email, // sender address
            to: process.env.GMAIL_ADDRESS, // list of receivers
            replyTo: email,
            subject:"New message from portfolio",
            html: `<p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Message:</strong><br>${message}</p>`
        };


        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(400).json({success: false, message: "Error sending email" });
            } else {
                return res.status(200).json({success: true, message: "Email sent successfully"})
            }
        })
    } catch (error) {
        return res.status(500).json({
            error: error.message,
            message: "Internal server error"
        });
    }

   
})