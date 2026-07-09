import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req) {
  try {
    const body = await req.json();
    const { email } = body;

    // Validation
    if (!email) {
      return NextResponse.json(
        { error: 'Veuillez fournir une adresse e-mail.' },
        { status: 400 }
      );
    }

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
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
      to: 'contact@alternativecitoyenne.sn, alternativecitoyenne.thies@gmail.com, demba8310@gmail.com',
      replyTo: email,
      subject: `Nouvelle inscription à la Newsletter : ${email}`,
      html: `
        <h2>Nouvelle inscription à la Newsletter</h2>
        <p>Une nouvelle personne s'est inscrite pour recevoir la newsletter du mouvement.</p>
        <p><strong>Email :</strong> ${email}</p>
        <br/>
        <p><i>Cet email a été envoyé automatiquement depuis le formulaire newsletter du site Alternative Citoyenne.</i></p>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: "Inscription réussie !" }, { status: 200 });
  } catch (error) {
    console.error('Error in /api/newsletter:', error);
    return NextResponse.json(
      { error: "Détail de l'erreur d'envoi : " + error.message },
      { status: 500 }
    );
  }
}
