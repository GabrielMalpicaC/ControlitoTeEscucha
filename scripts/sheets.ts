import { google } from 'googleapis';

// Define una interfaz para los datos que se pasan a las funciones.
interface SheetValues {
    values: (string | number)[][];
}

// Inicializa la librería cliente de Google y configura la autenticación con credenciales de la cuenta de servicio.
const auth = new google.auth.GoogleAuth({
    keyFile: './google.json', // Ruta al archivo de clave de tu cuenta de servicio.
    scopes: ['https://www.googleapis.com/auth/spreadsheets'], // Alcance para la API de Google Sheets.
});

const spreadsheetId = '1IqHqa7AxO984bq20xYBEA78vsCyOv67LyMe9V3oFEsM'; // ID de tu hoja de cálculo.

// Función asíncrona para escribir datos en una hoja de cálculo de Google.
export async function writeToSheet(
    values: (string | number)[][], 
    range: string, 
    spreadsheetId: string  // Añadido parámetro spreadsheetId
  ): Promise<any> {
    const sheets = google.sheets({ version: 'v4', auth }); // Crea una instancia cliente de la API de Sheets.
    const valueInputOption: string = 'USER_ENTERED'; // Cómo se deben interpretar los datos de entrada.
  
    const resource: SheetValues = {
      values,
    }; // Los datos que se escribirán.
  
    try {
      const res = await sheets.spreadsheets.values.update({
        spreadsheetId,  // Usando el parámetro spreadsheetId
        range,
        valueInputOption,
        requestBody: resource,
      });
      return res.data; // Devuelve la respuesta de la API de Sheets.
    } catch (error) {
      console.error('Error al escribir en la hoja:', error);
      throw error;
    }
}
  

// Función asíncrona para leer datos de una hoja de cálculo de Google.
export async function readSheet(range: string): Promise<(string | number)[][] | undefined> {
    const sheets = google.sheets({ version: 'v4', auth });

    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range,
        });
        const rows = response.data.values; // Extrae las filas de la respuesta.
        return rows;
    } catch (error) {
        console.error('Error al leer la hoja:', error);
        throw error;
    }
}

// Función asíncrona para agregar datos a una hoja de cálculo de Google.
export async function appendToSheet(
    values: (string | number)[][],
    spreadsheetId: string,
    sheetName: string
  ): Promise<any> {
    const sheets = google.sheets({ version: 'v4', auth });
  
    // Incluye el nombre de la hoja en el rango.
    const range: string = `${sheetName}!A1`;
    const valueInputOption: string = 'USER_ENTERED';
  
    const resource: SheetValues = { values };
  
    try {
      const res = await sheets.spreadsheets.values.append({
        spreadsheetId,
        range,
        valueInputOption,
        requestBody: resource,
      });
      return res.data;
    } catch (error) {
      console.error(`Error al agregar datos en la hoja "${sheetName}":`, error);
      throw error;
    }
}

// Función asíncrona para filtrar datos en una hoja de cálculo de Google.
export async function getFilteredData(columnName: string, valueToSearch: string | number): Promise<(string | number)[][]> {
    const sheets = google.sheets({ version: 'v4', auth });

    // Convertir el nombre de la columna a índice.
    const columnIndex: number = columnName.toUpperCase().charCodeAt(0) - 65;

    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: 'A1:Z1000', // Ajusta el rango según tus necesidades.
        });

        const allRows = response.data.values || [];

        // Filtrar las filas según el valor específico.
        const filteredData = allRows.filter((row) => row[columnIndex] === valueToSearch);

        return filteredData;
    } catch (error) {
        console.error('Error al filtrar los datos:', error);
        throw error;
    }
}

export async function insertImageLinkToSheet(
  imageUrl: string,
  sheetName: string,
  spreadsheetId: string  // Añadido parámetro spreadsheetId
): Promise<void> {
  const sheets = google.sheets({ version: 'v4', auth });

  try {
    // Obtén la última fila con datos de la hoja específica.
    const getRes = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}!A1:Z`,
      majorDimension: 'ROWS',
    });

    const rows = getRes.data.values || [];
    const lastRowIndex = rows.length; // Última fila con datos
    const lastColumnIndex = rows[0]?.length - 1 || 0; // Última columna con datos (ajustado)

    // Calcula el rango para insertar la imagen.
    const columnLetter = String.fromCharCode(65 + lastColumnIndex);
    const range = `${sheetName}!${columnLetter}${lastRowIndex}`;

    const formula = `=IMAGE("${imageUrl}")`;

    await writeToSheet([[formula]], range, spreadsheetId);
  } catch (error) {
    console.error(`Error al insertar la imagen en la hoja "${sheetName}":`, error);
    throw error;
  }
}

export async function insertLinkToSheet(
  link: string,
  sheetName: string,
  spreadsheetId: string
): Promise<void> {
  const sheets = google.sheets({ version: 'v4', auth });

  try {
    // Obtén la última fila con datos de la hoja específica.
    const getRes = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}!A1:Z`,
      majorDimension: 'ROWS',
    });

    const rows = getRes.data.values || [];
    const lastRowIndex = rows.length; // Última fila con datos
    const lastColumnIndex = rows[0]?.length - 1 || 0; // Última columna con datos (ajustado)

    // Calcula el rango para insertar el enlace.
    const columnLetter = String.fromCharCode(65 + lastColumnIndex);
    const range = `${sheetName}!${columnLetter}${lastRowIndex}`;

    await writeToSheet([[link]], range, spreadsheetId);
  } catch (error) {
    console.error(`Error al insertar el enlace en la hoja "${sheetName}":`, error);
    throw error;
  }
}
