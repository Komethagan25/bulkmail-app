require("dotenv").config();
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SG_KEY);

const express = require("express")
const cors = require("cors")
const app = express()
const nodemailer = require("nodemailer");
const mongoose = require("mongoose")

const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);


app.use(cors())
app.use(express.json())

mongoose.connect("mongodb+srv://komethagan_25:komethagan123@bulkmail.tvqkxsf.mongodb.net/passkey?appName=bulkmail").then(function () {
    console.log("Database connected successfully")
}).catch(function (err) {
    console.log("Database connection failed")
    console.log(err)
})

// ADMIN SCHEMA
const adminSchema = new mongoose.Schema({
    username: String,
    password: String
});

const Admin = mongoose.model("Admin", adminSchema);



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



app.post("/sendmail", function (req, res) {

    var subject = req.body.subject
    var msg = req.body.msg
    var emailList = req.body.emailList


    Credential.findOne().then(function (data) {

        if (!data) {
            return res.status(500).json({
                success: false,
                message: "No credentials found"
            })
        }

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, 
            family: 4,    
            auth: {
                user: data.user,
                pass: data.pass,
            },
        });






        new Promise(async function (resolve, reject) {

            try {
                for (var i = 0; i < emailList.length; i++) {

                    await transporter.sendMail(
                        {
                            from: "komethagan12@gmail.com",
                            to: emailList[i],
                            subject: subject,
                            text: msg
                        }
                    )

                    console.log("Email sent to " + emailList[i])

                }
                resolve("success")
            }
            catch (err) {
                console.log(err)
                reject("failed")
            }
        }).then(async function () {

            await Mail.create({
                subject: subject,
                body: msg,
                recipients: emailList,
                status: "Success"
            })

            res.status(200).json({ success: true, message: "Emails sent successfully" })

        }).catch(async function () {

            await Mail.create({
                subject: subject,
                body: msg,
                recipients: emailList,
                status: "Failed"
            })
            res.status(500).json({ success: false, message: "Email sending failed" })

        })



    }).catch(function (err) {
        console.log(err)
    })


})




// app.post("/sendmail", async function (req, res) {
//     const { subject, msg, emailList } = req.body;

//     try {
//         console.log("Emails received:", emailList);

//         // Remove empty or invalid emails
//         const validEmails = emailList.filter(email => email && email.includes("@"));

//         if (validEmails.length === 0) {
//             return res.status(400).json({
//                 success: false,
//                 message: "No valid emails found"
//             });
//         }

//         await sgMail.sendMultiple({
//             to: validEmails,
//             from: "komethagan12@gmail.com", 
//             subject: subject,
//             text: msg,
//         });

//         await Mail.create({
//             subject: subject,
//             body: msg,
//             recipients: validEmails,
//             status: "Success"
//         });

//         res.status(200).json({
//             success: true,
//             message: "Emails sent successfully"
//         });

//     } catch (error) {

//         console.log("SENDGRID ERROR:", error.response?.body || error);

//         await Mail.create({
//             subject: subject,
//             body: msg,
//             recipients: emailList,
//             status: "Failed"
//         });

//         res.status(500).json({
//             success: false,
//             message: "Email sending failed"
//         });
//     }
// });


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


//Login api 
app.post("/admin/login", async function (req, res) {

    const { username, password } = req.body;

    try {

        const admin = await Admin.findOne({ username, password });

        if (!admin) {
            return res.status(401).json({
                success: false,
                message: "Invalid Admin Credentials"
            });
        }

        res.status(200).json({
            success: true,
            message: "Admin Login Successful"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }

});



app.listen(5000, function () {
    console.log("Server is running on port 5000")
})