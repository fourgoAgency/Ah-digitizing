// app/api/send-email/route.ts
import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();
  const { name, email, date, time, service } = body;
  console.log("Email API called with:", { name, email, date, time, service });

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false, // Allowing Gmail's self-signed certificate
    },
  });

  const mailOptions = {
    from:`"FourGo Agency Appointments" <fourgo.agency@gmail.com>`,
    to: email,
    subject: 'Appointment Confirmation - FourGo Agency',
    html: `
      <h3>Hello ${name},</h3>
      <p>Thanks for booking your appointment with <strong>FourGo Agency</strong>.</p>
      <ul>
        <li><strong>Service:</strong> ${service}</li>
        <li><strong>Date:</strong> ${date}</li>
        <li><strong>Time:</strong> ${time}</li>
      </ul>
      <p>We'll be in touch shortly. For any queries, just reply to this email.</p>
      <p style="font-size: 12px; color: gray;">You are receiving this email because you booked an appointment on our website.</p>
    `,
  };

  try {
    // Send Email
    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ success: false, error: error });
  }
}
