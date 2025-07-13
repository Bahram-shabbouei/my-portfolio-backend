// src/routes/contact.ts (VOLLSTÄNDIGER UND KORRIGIERTER INHALT)

import { Router, Request, Response } from 'express';
import { db } from '../database';

const router = Router();

router.post('/', (req: Request, res: Response) => {
  // ==========================================================
  // SCHRITT 1: Lese ALLE möglichen Felder aus dem Request-Body.
  // Wenn ein Feld nicht gesendet wird (z.B. vom Short-Form), ist sein Wert 'undefined'.
  // ==========================================================
  const { name, email, message, phone, address } = req.body;

  // ==========================================================
  // SCHRITT 2: Serverseitige Validierung der Pflichtfelder.
  // Die Validierung für 'phone' oder 'address' kann hier optional hinzugefügt werden.
  // ==========================================================
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, E-Mail und Nachricht sind Pflichtfelder.' });
  }
  if (!/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ error: 'Ungültige E-Mail-Adresse.' });
  }

  // ==========================================================
  // SCHRITT 3: Passe das SQL-Statement an, um die neuen Spalten einzubeziehen.
  // ==========================================================
  const sql = 'INSERT INTO messages (name, email, message, phone, address) VALUES (?, ?, ?, ?, ?)';

  // ==========================================================
  // SCHRITT 4: Erstelle das Parameter-Array.
  // Verwende `|| null`, um sicherzustellen, dass `NULL` in die Datenbank geschrieben wird,
  // falls die Felder `undefined` sind.
  // ==========================================================
  const params = [name, email, message, phone || null, address || null];

  // ==========================================================
  // SCHRITT 5: Führe das Statement aus. Der `db.run`-Teil bleibt identisch.
  // ==========================================================
  db.run(sql, params, function (err) {
    if (err) {
      console.error('Fehler beim Einfügen in die Datenbank:', err.message);
      return res.status(500).json({ error: 'Ein interner Serverfehler ist aufgetreten.' });
    }

    console.log(`Eine neue Nachricht mit der ID ${this.lastID} von ${name} wurde hinzugefügt.`);
    
    // Wir senden die jetzt gespeicherten Daten (inkl. der optionalen) zurück
    res.status(201).json({
      message: 'Nachricht erfolgreich empfangen!',
      data: { id: this.lastID, name, email, phone, address }
    });
  });
});

export default router;