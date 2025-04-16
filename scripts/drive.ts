import { google } from 'googleapis';
import * as fs from 'fs';
import { insertImageLinkToSheet, insertLinkToSheet } from './sheets'

export async function uploadFile(
  filePath: string, 
  fileName: string, 
  sheetName: string, 
  driveId: string,
  spreadsheetId: string,
  mimeType: string // Nuevo parámetro para el tipo MIME
): Promise<string | undefined> {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: './google.json',
      scopes: ['https://www.googleapis.com/auth/drive'],
    });

    const driveService = google.drive({
      version: 'v3',
      auth,
    });

    const fileMetaData = {
      name: fileName,
      parents: [driveId],
    };

    // Usar el mimeType proporcionado
    const media = {
      mimeType,
      body: fs.createReadStream(filePath),
    };

    const file = await driveService.files.create({
      requestBody: fileMetaData,
      media: media,
      fields: 'id, webViewLink, webContentLink',
    });

    const fileId = file.data.id;

    // Hacer el archivo públicamente accesible
    if (fileId) {
      await driveService.permissions.create({
        fileId,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
      });

      // Construir el enlace público
      const publicUrl = `https://drive.google.com/uc?id=${fileId}`;

      // Si es un PDF, insertar solo el enlace
      if (mimeType === 'application/pdf') {
        await insertLinkToSheet(publicUrl, sheetName, spreadsheetId);
      } else {
        // Si es una imagen, insertar la imagen en la celda
        await insertImageLinkToSheet(publicUrl, sheetName, spreadsheetId);
      }

      return publicUrl;
    }
  } catch (err) {
    console.error('Upload file error', err);
  } finally{
    try {
      fs.unlinkSync(filePath);
    } catch (cleanupError) {
      console.error('Error al limpiar archivo temporal:', cleanupError);
    }
  }
}