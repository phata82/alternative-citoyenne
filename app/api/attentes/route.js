import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req) {
  try {
    const body = await req.json();
    const { firstname, lastname, email, message } = body;

    // Validation
    if (!firstname || !lastname || !email || !message) {
      return NextResponse.json(
        { error: 'Veuillez remplir tous les champs obligatoires.' },
        { status: 400 }
      );
    }

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS || !process.env.RECEIVER_EMAIL) {
      console.error("Missing SMTP credentials in environment variables");
      return NextResponse.json(
        { error: 'Configuration du serveur email manquante.' },
        { status: 500 }
      );
    }

    // Configure nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: 'ssl0.ovh.net',
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Email content
    const mailOptions = {
      from: `"Alternative Citoyenne" <${process.env.SMTP_USER}>`,
      to: `${process.env.RECEIVER_EMAIL}, demba8310@gmail.com, moustaphasow1994@gmail.com`,
      replyTo: email,
      subject: `Nouvelle attente pour Thiès-Est : ${firstname} ${lastname}`,
      html: `
        <h2>Nouvelle idée / attente pour la commune de Thiès-Est</h2>
        <p><strong>Prénom :</strong> ${firstname}</p>
        <p><strong>Nom :</strong> ${lastname}</p>
        <p><strong>Email :</strong> ${email}</p>
        <br/>
        <h3>Message / Attentes :</h3>
        <p style="white-space: pre-wrap;">${message}</p>
        <br/>
        <p><i>Cet email a été envoyé automatiquement depuis la boîte à idées du site Alternative Citoyenne.</i></p>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: "Votre message a été envoyé avec succès. Merci pour votre contribution !" }, { status: 200 });
  } catch (error) {
    console.error('Error in /api/attentes:', error);
    return NextResponse.json(
      { error: "Détail de l'erreur d'envoi : " + error.message },
      { status: 500 }
    );
  }
}
