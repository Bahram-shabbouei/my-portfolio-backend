// src/config.ts
import dotenv from 'dotenv';

// Lade die Umgebungsvariablen aus der .env-Datei
dotenv.config(); 

export const config = {
  // Nutze den Port aus .env, ODER falle zurück auf 3001
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3001,
  
  // Nutze die Frontend-URL aus .env, ODER falle zurück auf die Standard-Dev-URL
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',

  smtp: {
    host: process.env.SMTP_HOST || '',
    port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 2525,
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  }
};