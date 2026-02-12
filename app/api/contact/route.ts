import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

/** Adres, na który zawsze trafia podsumowanie z formularza (dane osoby, która wysłała). */
const CONTACT_FORM_RECIPIENT = "tymbeixpoi@gmail.com";

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
  const secure = process.env.SMTP_SECURE === "true";
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !port || !user || !pass) return null;

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, company, message } = body;

    if (!name?.trim() || !email?.trim() || !phone?.trim() || !company?.trim() || !message?.trim()) {
      return NextResponse.json({ error: "Wszystkie pola są wymagane." }, { status: 400 });
    }

    if (message.trim().length < 10) {
      return NextResponse.json({ error: "Wiadomość musi mieć minimum 10 znaków." }, { status: 400 });
    }

    const transporter = getTransporter();
    if (!transporter) {
      return NextResponse.json(
        { error: "Brakuje SMTP config (SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS)." },
        { status: 500 }
      );
    }

    const fromEmail = process.env.SMTP_USER!;
    const fromAddress = `Formularz kontaktowy <${fromEmail}>`;

    // 1) Mail na tymbeixpoi@gmail.com – dane osoby, która wypełniła formularz
    await transporter.sendMail({
      from: fromAddress,
      to: CONTACT_FORM_RECIPIENT,
      replyTo: email,
      subject: `Firma: ${escapeHtml(company.trim())} — wiadomość z formularza`,
      html: `
        <h2>Nowa wiadomość z formularza kontaktowego</h2>
        <p><strong>Imię:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Telefon:</strong> ${escapeHtml(phone)}</p>
        <p><strong>Firma:</strong> ${escapeHtml(company)}</p>
        <p><strong>Wiadomość:</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
      `,
    });

    // 2) Potwierdzenie do nadawcy
    await transporter.sendMail({
      from: fromAddress,
      to: email,
      subject: "Dziękujemy za kontakt",
      html: `
        <p>Cześć ${escapeHtml(name.trim())},</p>
        <p>Dzięki za wiadomość — wrócimy do Ciebie najszybciej jak się da.</p>
        <p>Pozdrawiam,<br>Tymoteusz Tymendorf</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact form send error:", err);
    return NextResponse.json({ error: "Nie udało się wysłać wiadomości." }, { status: 500 });
  }
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m] ?? m);
}