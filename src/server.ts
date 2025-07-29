// src/server.ts

import 'dotenv/config'; // Lade Umgebungsvariablen
import express, { Request, Response } from 'express';
import cors from 'cors';

import { config } from './config.js';
import { initializeDb, db } from './database.js';
import { sendMail } from './emailService.js'; // Dieser Import funktioniert jetzt!

initializeDb();
 
const app = express();

app.use(cors({ origin: config.frontendUrl }));
app.use(express.json());

// ... (die /api/health und /api/test-email Routen) ...
app.get('/api/health', (req: Request, res: Response) => res.status(200).json({ status: 'UP' }));
/*
app.get('/api/test-email', async (req, res) => {
  try {
    await sendMail({
      to: 'deine-private-email@example.com',
      subject: 'Test-E-Mail von meiner Portfolio-Anwendung',
      text: 'Hallo! Wenn du das liest, funktioniert der E-Mail-Versand.',
      html: '<h1>Hallo!</h1><p>Wenn du das liest, funktioniert der <strong>E-Mail-Versand</strong>.</p>',
    });
    res.status(200).send('Test-E-Mail wurde versendet.');
  } catch (error) {
    res.status(500).send('Fehler beim Versenden der Test-E-Mail.');
  }
});
*/

// Haupt-API-Endpunkt für den Kontaktformular
app.post('/api/contact', (req: Request, res: Response) => {
  try {
    const { name, email, message, phone, address } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, E-Mail und Nachricht sind Pflichtfelder.' });
    }

    const sql = `INSERT INTO messages (name, email, message, phone, address) VALUES (?, ?, ?, ?, ?)`;
    const params = [name, email, message, phone || null, address || null];

    db.run(sql, params, function(err) {
      if (err) {
        console.error("Datenbankfehler:", err.message);
        return res.status(500).json({ error: 'Fehler beim Speichern der Nachricht.' });
      }
      
      console.log(`Nachricht mit ID ${this.lastID} von ${name} wurde gespeichert.`);
      
      // E-Mails versenden
      sendMail({
        to: email, // Bestätigungs-E-Mail an den Absender, die des Benutzers aus der Formular
        subject: 'Bestätigung Ihrer Kontaktanfrage auf meinem Portfolio',
        text: `Hallo ${name},\n\vielen Dank für Ihre Nachricht. Ich habe sie erhalten und werde mich so schnell wie möglich bei Ihnen melden.\n\nIhre Nachricht:\n"${message}"\n\nMit freundlichen Grüßen,\nBahram Shabbouei Hagh`,
        html: `<p>Hallo ${name},</p><p>vielen Dank für Ihre Nachricht. Ich habe sie erhalten und werde mich so schnell wie möglich bei Ihnen melden.</p><p><strong>Ihre Nachricht:</strong></p><blockquote>${message}</blockquote><p>Mit freundlichen Grüßen,<br>Bahram Shabbouei Hagh</p>`
      }).catch(err => {
        // Logge den Fehler, aber lass die Anwendung weiterlaufen
        console.error("Fehler beim Senden der Bestätigungs-E-Mail an den User:", err.message);
      });

      // 2. Benachrichtigungs-E-Mail an dich selbst senden
      sendMail({
        to: 'bshabbouei@gmail.com', // Deine private E-Mail-Adresse
        subject: `Neue Portfolio-Kontaktanfrage von: ${name}`,
        text: `Neue Kontaktanfrage erhalten:\n\nName: ${name}\nE-Mail: ${email}\nTelefon: ${phone || 'Nicht angegeben'}\nAdresse: ${address || 'Nicht angegeben'}\n\nNachricht:\n${message}`,
        html: `<h1>Neue Kontaktanfrage</h1><ul><li><strong>Name:</strong> ${name}</li><li><strong>E-Mail:</strong> ${email}</li><li><strong>Telefon:</strong> ${phone || 'Nicht angegeben'}</li><li><strong>Adresse:</strong> ${address || 'Nicht angegeben'}</li></ul><p><strong>Nachricht:</strong></p><blockquote>${message}</blockquote>`
      }).catch(err => {
        // Logge den Fehler, aber lass die Anwendung weiterlaufen
        console.error("Fehler beim Senden der Benachrichtigungs-E-Mail an den Admin:", err.message);
      });

      // Sende die Erfolgsantwort an das Frontend sofort, ohne auf das Senden der E-Mails zu warten
      res.status(201).json({ success: true, message: 'Nachricht erfolgreich empfangen.' });
    });

  } catch (error) {
    console.error("Unerwarteter Serverfehler in /api/contact:", error);
    res.status(500).json({ error: 'Ein unerwarteter Serverfehler ist aufgetreten.' });
  }
});

app.listen(config.port, () => {
  console.log(`Backend-Server läuft auf http://localhost:${config.port}`);
});