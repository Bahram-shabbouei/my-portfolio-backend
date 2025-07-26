// src/database.ts (KORRIGIERTE VERSION)

import sqlite3 from 'sqlite3';
import path, { dirname } from 'path'; // Füge 'dirname' zum Import hinzu
import { fileURLToPath } from 'url';   // Füge diesen Import hinzu

// === Moderne Methode, um __dirname in ES Modules zu erhalten ===
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// =============================================================

// Wähle den ausführlichen Modus für bessere Fehlermeldungen
const sqlite = sqlite3.verbose();

// Pfad zur Datenbankdatei. `path.resolve` stellt sicher, dass der Pfad immer korrekt ist.
const dbPath = path.resolve(__dirname, '..', 'portfolio.db');

// Erstelle und exportiere die Datenbankverbindung
export const db = new sqlite.Database(dbPath, (err) => {
  if (err) {
    return console.error('Fehler beim Öffnen der Datenbank:', err.message);
  }
  console.log('Erfolgreich mit der SQLite-Datenbank verbunden.');
});

// Funktion zum Initialisieren der Datenbank (Tabelle erstellen)
export const initializeDb = () => {
  console.log("Versuche, die Datenbank zu initialisieren...");
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        message TEXT NOT NULL,
        phone TEXT, 
        address TEXT,
        is_read BOOLEAN DEFAULT FALSE,
        received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) {
        console.error('Fehler beim Erstellen der Tabelle "messages":', err.message);
      } else {
        console.log('Tabelle "messages" ist bereit.');
      }
    });
  });
};