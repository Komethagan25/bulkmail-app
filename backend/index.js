// require("dotenv").config();
// const sgMail = require("@sendgrid/mail");

// sgMail.setApiKey(process.env.SG_KEY);

// const express = require("express")
// const cors = require("cors")
// const app = express()
// // const nodemailer = require("nodemailer");
// const mongoose = require("mongoose")

// const dns = require("dns");
// dns.setServers(["8.8.8.8", "1.1.1.1"]);


// app.use(cors())
// app.use(express.json())

// mongoose.connect("mongodb+srv://komethagan_25:komethagan123@bulkmail.tvqkxsf.mongodb.net/passkey?appName=bulkmail").then(function () {
//     console.log("Database connected successfully")
// }).catch(function (err) {
//     console.log("Database connection failed")
//     console.log(err)
// })

// // ADMIN SCHEMA
// const adminSchema = new mongoose.Schema({
//     username: String,
//     password: String
// });

// const Admin = mongoose.model("Admin", adminSchema);



// const mailSchema = new mongoose.Schema({
//     subject: String,
//     body: String,
//     recipients: [String],
//     status: String,
//     sentAt: {
//         type: Date,
//         default: Date.now
//     }
// })

// const Mail = mongoose.model("Mail", mailSchema)



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


// // EMAIL HISTORY API
// app.get("/history", async function (req, res) {

//     try {
//         const mails = await Mail.find().sort({ sentAt: -1 })

//         res.status(200).json({
//             success: true,
//             data: mails
//         })

//     } catch (error) {

//         console.log(error)

//         res.status(500).json({
//             success: false,
//             message: "Failed to fetch email history"
//         })
//     }

// })


// //Login api 
// app.post("/admin/login", async function (req, res) {

//     const { username, password } = req.body;

//     try {

//         const admin = await Admin.findOne({ username, password });

//         if (!admin) {
//             return res.status(401).json({
//                 success: false,
//                 message: "Invalid Admin Credentials"
//             });
//         }

//         res.status(200).json({
//             success: true,
//             message: "Admin Login Successful"
//         });

//     } catch (error) {

//         console.log(error);

//         res.status(500).json({
//             success: false,
//             message: "Server Error"
//         });
//     }

// });



// app.listen(5000, function () {
//     console.log("Server is running on port 5000")
// })


require("dotenv").config();
const brevo = require("@getbrevo/brevo");

const brevoClient = new brevo.TransactionalEmailsApi();
brevoClient.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_KEY);

const express = require("express")
const cors = require("cors")
const app = express()
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


app.post("/sendmail", async function (req, res) {
    const { subject, msg, emailList } = req.body;

    try {
        console.log("Emails received:", emailList);

        // Remove empty or invalid emails
        const validEmails = emailList.filter(email => email && email.includes("@"));

        if (validEmails.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No valid emails found"
            });
        }

        // Send each recipient a separate, isolated email (like sgMail.sendMultiple did).
        // Brevo allows batching, but per-recipient calls keep addresses private from
        // each other and keep this close to your original logic.
        const sendPromises = validEmails.map(function (email) {
            const sendSmtpEmail = new brevo.SendSmtpEmail();
            sendSmtpEmail.to = [{ email: email }];
            sendSmtpEmail.sender = { email: "komethagan12@gmail.com", name: "Bulkmail App" };
            sendSmtpEmail.subject = subject;
            sendSmtpEmail.textContent = msg;

            return brevoClient.sendTransacEmail(sendSmtpEmail);
        });

        await Promise.all(sendPromises);

        await Mail.create({
            subject: subject,
            body: msg,
            recipients: validEmails,
            status: "Success"
        });

        res.status(200).json({
            success: true,
            message: "Emails sent successfully"
        });

    } catch (error) {

        console.log("BREVO ERROR:", error.response?.body || error.message || error);

        await Mail.create({
            subject: subject,
            body: msg,
            recipients: emailList,
            status: "Failed"
        });

        res.status(500).json({
            success: false,
            message: "Email sending failed"
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