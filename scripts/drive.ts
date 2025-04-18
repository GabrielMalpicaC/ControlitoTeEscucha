import { google } from 'googleapis';
import * as fs from 'fs';
import dotenv from 'dotenv';
import { insertImageLinkToSheet, insertLinkToSheet } from './sheets';

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

export async function uploadFile(
  filePath: string, 
  fileName: string, 
  sheetName: string, 
  driveId: string,
  spreadsheetId: string,
  mimeType: string
): Promise<string | undefined> {
  try {
    // Verifica si GOOGLE_CREDENTIALS está definida en las variables de entorno
    if (!process.env.GOOGLE_CREDENTIALS) {
      throw new Error('La variable GOOGLE_CREDENTIALS no está definida');
    }

    // Parsear las credenciales desde la variable de entorno
    const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);

    // Crear la autenticación con las credenciales obtenidas
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/drive'], // Alcance para la API de Google Drive
    });

    const driveService = google.drive({
      version: 'v3',
      auth,
    });

    const fileMetaData = {
      name: fileName,
      parents: [driveId], // Id de la carpeta en Google Drive
    };

    const media = {
      mimeType,
      body: fs.createReadStream(filePath), // Archivo que se va a subir
    };

    // Crear el archivo en Google Drive
    const file = await driveService.files.create({
      requestBody: fileMetaData,
      media: media,
      fields: 'id, webViewLink, webContentLink',
    });

    const fileId = file.data.id;

    // Si se creó el archivo, hacer que sea accesible públicamente
    if (fileId) {
      await driveService.permissions.create({
        fileId,
        requestBody: {
          role: 'reader', // Permiso de solo lectura
          type: 'anyone', // Permite que cualquier persona lo vea
        },
      });

      const publicUrl = `https://drive.google.com/uc?id=${fileId}`;

      // Si el archivo es un PDF, solo insertar el enlace
      if (mimeType === 'application/pdf') {
        await insertLinkToSheet(publicUrl, sheetName, spreadsheetId);
      } else {
        // Si el archivo no es un PDF, insertamos la imagen
        await insertImageLinkToSheet(publicUrl, sheetName, spreadsheetId);
      }

      return publicUrl;
    }
  } catch (err) {
    console.error('Error al subir el archivo', err);
  } finally {
    try {
      fs.unlinkSync(filePath); // Elimina el archivo temporal después de subirlo
    } catch (cleanupError) {
      console.error('Error al limpiar archivo temporal:', cleanupError);
    }
  }
}
