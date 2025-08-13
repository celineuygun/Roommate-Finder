import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
const envFile = process.env.NODE_ENV === 'production' ? '.env' : '.env.local';
dotenv.config({ path: envFile });

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER, // Gmail address
        pass: process.env.EMAIL_PASS, // Gmail app password
    },
});

// Verify transporter setup
transporter.verify((error, success) => {
    if (error) {
        console.error('Error with Nodemailer transporter:', error);
    } else {
        console.log('Nodemailer transporter is ready to send emails');
    }
});

export default transporter;
