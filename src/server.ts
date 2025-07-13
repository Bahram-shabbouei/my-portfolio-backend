// src/server.ts
import express, { Request, Response } from 'express';
import cors from 'cors';
import { config } from './config';
import { initializeDb } from './database'; // Importiere die Funktion zum Initialisieren der Datenbank

// Initialisiere die Datenbank
initializeDb();

const app = express();

// Middleware konfigurieren
app.use(cors({
  origin: config.frontendUrl // Erlaube nur Anfragen von unserem Frontend
}));
app.use(express.json()); // Erlaube dem Server, JSON-Daten im Request-Body zu lesen

// Eine einfache Test-Route, um zu sehen, ob der Server läuft
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'UP' });
});

// ----- HIER KOMMEN SPÄTER UNSERE KONTAKT-ROUTEN HIN -----

// Server starten
app.listen(config.port, () => {
  console.log(`Backend-Server läuft auf http://localhost:${config.port}`);
});