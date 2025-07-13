import dotenv from 'dotenv';
dotenv.config(); // Lädt die .env-Datei

export const config = {
  port: process.env.PORT || 3001, // Nutze den Port aus .env oder falle zurück auf 3001
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
};