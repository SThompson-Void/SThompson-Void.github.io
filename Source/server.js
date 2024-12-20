const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config(); // Load environment variables from a .env file

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/send', (req, res) => {
    console.log('POST request received:', req.body);
    res.status(200).send('POST request successful');
});

app.post('/send', async (req, res) => {
    const { name, email, phone, message } = req.body;

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com', // Ensure this is correct
        port: 587, // Use 465 if SSL is enabled
        secure: false, // true for 465, false for other ports
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER, // Loaded from environment variables
            pass: process.env.EMAIL_PASS, // Loaded from environment variables
        },
    });

    const mailOptions = {
        from: email,
        to: process.env.EMAIL_USER, // Destination email loaded from environment variables
        subject: 'New Contact Form Submission',
        text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nMessage:\n${message}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).send('Message sent successfully!');
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Failed to send message.');
    }
});
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data
const PORT = process.env.PORT || 5500;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
