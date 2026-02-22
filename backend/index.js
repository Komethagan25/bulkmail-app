

const express = require("express")
const cors = require("cors")
const app = express()
const nodemailer = require("nodemailer");
const mongoose = require("mongoose")

// const dns = require("dns");
// dns.setServers(["8.8.8.8", "1.1.1.1"]);

const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');



app.use(cors())
app.use(express.json())

mongoose.connect("mongodb+srv://komethagan_25:komethagan123@bulkmail.tvqkxsf.mongodb.net/passkey?appName=bulkmail").then(function () {
    console.log("Database connected successfully")
}).catch(function (err) {
    console.log("Database connection failed")
    console.log(err)
})

const credentialSchema = new mongoose.Schema({
    user: String,
    pass: String
})

const Credential = mongoose.model("Credential", credentialSchema, "bulkmail")


const userSchema = new mongoose.Schema({
    email: { type: String, unique: true },
    password: String
})

const User = mongoose.model("User", userSchema)



const mailSchema = new mongoose.Schema({
    subject: String,
    body: String,
    recipients: [String],
    status: String,
    sentAt: {
        type: Date,
        default: Date.now
    }
})

const Mail = mongoose.model("Mail", mailSchema)


// app.post("/sendmail", function (req, res) {

//     var subject = req.body.subject
//     var msg = req.body.msg
//     var emailList = req.body.emailList


//     Credential.findOne().then(function (data) {

//         if (!data) {
//             return res.status(500).json({
//                 success: false,
//                 message: "No credentials found"
//             })
//         }

//         const transporter = nodemailer.createTransport({
//             host: "smtp.gmail.com",
//             port: 465,        // Use 465 for secure: true
//             secure: true,
//             auth: {
//                 user: data.user,
//                 pass: data.pass,
//             },
//             tls: {
//                 rejectUnauthorized: false // Helps bypass some network restriction issues
//             }
//         });






//         new Promise.all(async function (resolve, reject) {

//             try {
//                 for (var i = 0; i < emailList.length; i++) {

//                     await transporter.sendMail(
//                         {
//                             from: "komethagan12@gmail.com",
//                             to: emailList[i],
//                             subject: subject,
//                             text: msg
//                         }
//                     )

//                     console.log("Email sent to " + emailList[i])

//                 }
//                 resolve("success")
//             }
//             catch (err) {
//                 console.log(err)
//                 reject("failed")
//             }
//         }).then(async function () {

//             await Mail.create({
//                 subject: subject,
//                 body: msg,
//                 recipients: emailList,
//                 status: "Success"
//             })

//             res.status(200).json({ success: true, message: "Emails sent successfully" })

//         }).catch(async function () {

//             await Mail.create({
//                 subject: subject,
//                 body: msg,
//                 recipients: emailList,
//                 status: "Failed"
//             })
//             res.status(500).json({ success: false, message: "Email sending failed" })

//         })



//     }).catch(function (err) {
//         console.log(err)
//     })


// })

app.post("/sendmail", async function (req, res) {
    const { subject, msg, emailList } = req.body;

    try {
        // 1. Fetch Credentials
        const data = await Credential.findOne();
        if (!data) {
            return res.status(500).json({ success: false, message: "No credentials found" });
        }

        // 2. Configure Transporter
        const transporter = nodemailer.createTransport({
            host: "172.253.115.108", // This is one of Gmail's IPv4 addresses
            port: 587,
            secure: false,
            auth: {
                user: data.user,
                pass: data.pass,
            },
            tls: {
                servername: 'smtp.gmail.com', // Necessary for SSL handshake to work with an IP
                rejectUnauthorized: false
            }
        });

        // 3. Send Emails (Sequential loop is safer for Gmail)
        for (const email of emailList) {
            await transporter.sendMail({
                from: data.user,
                to: email,
                subject: subject,
                text: msg,
            });
            console.log("Sent to: " + email);
        }

        // 4. Log Success to Database
        await Mail.create({
            subject: subject,
            body: msg,
            recipients: emailList,
            status: "Success",
        });

        res.status(200).json({ success: true, message: "All emails sent successfully" });

    } catch (err) {
        console.error("Detailed Server Error:", err);

        // 5. Log Failure to Database
        await Mail.create({
            subject: subject,
            body: msg,
            recipients: emailList,
            status: "Failed",
        });

        res.status(500).json({
            success: false,
            message: "Email sending failed",
            error: err.message
        });
    }
});




// EMAIL HISTORY API
app.get("/history", async function (req, res) {

    try {
        const mails = await Mail.find().sort({ sentAt: -1 })

        res.status(200).json({
            success: true,
            data: mails
        })

    } catch (error) {

        console.log(error)

        res.status(500).json({
            success: false,
            message: "Failed to fetch email history"
        })
    }

})

// signup

app.post("/signup", async function (req, res) {

    const { email, password } = req.body

    try {

        const existingUser = await User.findOne({ email })

        if (existingUser) {
            return res.json({ success: false, message: "User already exists" })
        }

        await User.create({
            email,
            password
        })

        res.json({ success: true, message: "Signup successful" })

    } catch (err) {
        res.status(500).json({ success: false, message: "Error signing up" })
    }

})

// LoginApi

app.post("/login", async function (req, res) {

    const { email, password } = req.body

    try {

        const user = await User.findOne({ email })

        if (!user) {
            return res.json({ success: false, message: "User not found" })
        }

        if (user.password !== password) {
            return res.json({ success: false, message: "Invalid password" })
        }

        res.json({
            success: true,
            message: "Login successful",
            user: {
                id: user._id,
                email: user.email
            }
        })

    } catch (err) {
        res.status(500).json({ success: false, message: "Login error" })
    }

})



app.listen(5000, function () {
    console.log("Server is running on port 5000")
})