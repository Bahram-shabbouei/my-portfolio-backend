// src/emailService.ts

import nodemailer from 'nodemailer';
import { config } from './config.js'; // Importiere unsere Konfiguration (achte auf .js)

// 1. Erstelle den "Transporter"
// Dies ist das Objekt, das die Verbindung zu unserem SMTP-Server (Mailtrap) herstellt.
const transporter = nodemailer.createTransport({
  host: config.smtp.host,
  port: config.smtp.port,
  secure: false, // Für Port 587 oder 2525 ist secure: false
  auth: {
    user: config.smtp.user, // Der Benutzername aus unserer .env-Datei
    pass: config.smtp.pass, // Das Passwort aus unserer .env-Datei
  },
});

// 2. Überprüfe die Verbindung beim Start (optional, aber sehr gut zum Debuggen)
// Wir versuchen, uns beim SMTP-Server anzumelden, um zu sehen, ob die Zugangsdaten stimmen.
transporter.verify((error, success) => {
  if (error) {
    console.error("Fehler bei der SMTP-Verbindung:", error);
  } else {
    console.log("SMTP-Server ist bereit, Nachrichten zu empfangen.");
  }
});

// 3. Definiere die Struktur der E-Mail-Optionen mit TypeScript
interface MailOptions {
  to: string;       // Empfänger-E-Mail
  subject: string;  // Betreff der E-Mail
  text: string;     // Nur-Text-Version der E-Mail
  html: string;     // HTML-Version der E-Mail
}

// 4. Erstelle und exportiere die Hauptfunktion zum Senden von E-Mails
// Diese Funktion kann von überall in unserem Backend aufgerufen werden.
export const sendMail = async (options: MailOptions) => {
  try {
    // Definiere die Absenderadresse. Es ist gute Praxis, hier einen Namen anzugeben.
    const senderAddress = `"Bahram's Portfolio" <${config.smtp.user}>`;

    // Sende die E-Mail mit den definierten Optionen
    const info = await transporter.sendMail({
      from: senderAddress,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });

    console.log("E-Mail erfolgreich an Mailtrap gesendet. Message ID: %s", info.messageId);
    return info; // Gib die Info zurück, falls sie benötigt wird

  } catch (error) {
    console.error("Fehler beim Versuch, eine E-Mail zu senden:", error);
    // Wirft den Fehler weiter, damit die aufrufende Funktion weiß, dass etwas schiefgegangen ist.
    throw new Error('E-Mail konnte nicht gesendet werden.');
  }
};