import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs';
import { addKeyword } from '@builderbot/bot';
import { appendToSheet } from 'scripts/sheets';
import { formattedTime } from 'scripts/utils';
import { uploadFile } from 'scripts/drive';

const spreadsheetId = '1DmTSQcwQOvshWo-_efey0ymflc70i9kO6lfOeWCQR8w';
const driveId = '15yn50VK95G1CUQ7SwrVPcI92yLcM6CLW';

export const malUsoZonaComun = addKeyword('3')
    .addAnswer("🏢 *Por favor, indica el número de la torre o multifamiliar:*\n(Si no aplica, escribe 'NA')", { capture: true }, 
        async (ctx, ctxFn) => {
            const torreRegex = /^(NA|\d+)$/i; // Valida números o "NA"
            if (!torreRegex.test(ctx.body)) {
                return ctxFn.fallBack("❌ Entrada no válida. Por favor, escribe un número o 'NA' si no aplica.");
            }
            const torre = ctx.body.toUpperCase() === 'NA' ? 'No aplica' : `Torre ${ctx.body}`;
            await ctxFn.state.update({ torre });
        }
    )
    .addAnswer("🏠 *Por favor, indica el número del apartamento o casa:*", { capture: true }, 
        async (ctx, ctxFn) => {
            const aptoCasaRegex = /^\d+$/; // Valida solo números
            if (!aptoCasaRegex.test(ctx.body)) {
                return ctxFn.fallBack("❌ Entrada no válida. Por favor, escribe un número.");
            }
            const aptoCasa = `Apto/Casa ${ctx.body}`; // Guarda el formato "Apto/Casa [número]"
            await ctxFn.state.update({ aptoCasa });
        }
    )
    .addAnswer("📋 *Describe la falta o el problema de manera detallada:*", { capture: true }, 
        async (ctx, ctxFn) => {
            if (ctx.body.length < 10) { // Validación mínima de longitud
                return ctxFn.fallBack("❌ La descripción es muy corta. Por favor, proporciona más detalles.");
            }
            await ctxFn.state.update({ descripcion: ctx.body });
        }
    )
    .addAnswer("📸 *Por favor, envía una foto como evidencia.* 😊", { capture: true }, 
        async (ctx, ctxFn) => {
            if (!ctx.message || !ctx.message.imageMessage) {
                return ctxFn.fallBack("❌ Debes enviar una imagen válida.");
            }
            
            const { imageMessage } = ctx.message;
            const mimeType = imageMessage.mimetype;
            await ctxFn.state.update({ mimeType: mimeType });
            
            if (!mimeType.startsWith('image/')) {
                return ctxFn.fallBack("🚫 El archivo debe ser una imagen (JPEG, PNG, etc.). Por favor, intenta nuevamente.");
            }
    
            // Usar directorio temporal del sistema
            const tempDir = os.tmpdir();
            const uploadDir = path.join(tempDir, 'whatsapp-uploads');
                
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }
    
            const localPath = await ctxFn.provider.saveFile(ctx, { path: uploadDir });
            await ctxFn.state.update({ localPath: localPath });
    
        }
    )
    .addAnswer("✅ *¡Gracias por la información! El registro de la falta fue exitoso.* 😊", null,
        async (ctx, ctxFn) => {
            const userInfo = ctxFn.state.getMyState();
            try {
                await appendToSheet([
                    [
                        formattedTime,
                        userInfo.conjunto,
                        userInfo.torre,
                        userInfo.aptoCasa,
                        userInfo.descripcion,
                    ]
                ], spreadsheetId, userInfo.conjunto);
            } catch (error) {
                console.log('Error al guardar en la hoja de cálculo:', error);
            }
            try {
                await uploadFile(
                    userInfo.localPath, 
                    `${ctx.from}-${ctx.pushName}`, 
                    userInfo.conjunto, 
                    driveId, 
                    spreadsheetId, 
                    userInfo.mimeType
                );
            } catch (error) {
                console.error('Error al subir archivo:', error);
                return ctxFn.fallBack("❌ Ocurrió un error al subir tu imagen. Por favor, inténtalo nuevamente.");
            } finally {
                if (fs.existsSync(userInfo.localPath)) {
                    fs.unlinkSync(userInfo.localPath);
                }
            }
            ctxFn.endFlow();
        }
    );