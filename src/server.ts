// src/server.ts (BEREINIGTE UND KORRIGIERTE VERSION)

import express, { Request, Response } from 'express';
import cors from 'cors';
import { config } from './config.js';
import { initializeDb, db } from './database.js';

// Initialisiere die Datenbank beim Serverstart
initializeDb();

const app = express();

// Middleware konfigurieren
app.use(cors({
  origin: config.frontendUrl
}));
app.use(express.json()); // Erlaubt dem Server, JSON aus dem Request-Body zu lesen

// Health-Check Route
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'UP' });
});

// API-Endpunkt zum Speichern von Kontaktanfragen
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
      res.status(201).json({ success: true, message: 'Nachricht erfolgreich empfangen.' });
    });

  } catch (error) {
    console.error("Unerwarteter Serverfehler:", error);
    res.status(500).json({ error: 'Ein unerwarteter Fehler ist aufgetreten.' });
  }
});

// Server starten
app.listen(config.port, () => {
  console.log(`Backend-Server läuft auf http://localhost:${config.port}`);
});