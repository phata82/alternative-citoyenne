import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req) {
  try {
    const body = await req.json();
    const { firstname, lastname, email, phone, quartier } = body;

    // Validation
    if (!firstname || !lastname || !email || !quartier) {
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
      host: 'zimbra1.mail.ovh.net',
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
      to: process.env.RECEIVER_EMAIL,
      replyTo: email,
      subject: `Nouvelle demande d'adhésion : ${firstname} ${lastname}`,
      html: `
        <h2>Nouvelle demande d'adhésion via le site web</h2>
        <p><strong>Prénom :</strong> ${firstname}</p>
        <p><strong>Nom :</strong> ${lastname}</p>
        <p><strong>Email :</strong> ${email}</p>
        <p><strong>Téléphone :</strong> ${phone || 'Non renseigné'}</p>
        <p><strong>Quartier :</strong> ${quartier}</p>
        <br/>
        <p><i>Cet email a été envoyé automatiquement depuis le formulaire du site Alternative Citoyenne.</i></p>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: "Votre demande d'adhésion a été prise en compte avec succès. Bienvenue parmi nous !" }, { status: 200 });
  } catch (error) {
    console.error('Error in /api/join:', error);
    return NextResponse.json(
      { error: "Une erreur s'est produite lors de l'envoi de votre demande." },
      { status: 500 }
    );
  }
}
