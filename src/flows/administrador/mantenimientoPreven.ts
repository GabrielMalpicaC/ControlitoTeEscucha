import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs';
import { addKeyword } from '@builderbot/bot'
import { uploadFile } from 'scripts/drive';
import { appendToSheet } from 'scripts/sheets';
import { formattedTime } from 'scripts/utils';

const spreadsheetId = '15_w3R_YefMUBYVlLygygQoO-39cNdj3W7VnX0N2Apf8';
const driveId = '1rt0xak1pFBaMsoTFG-nhLpbajaVUkSh-'
export const mantenimientoPreventivoFlow = addKeyword('1')
    .addAnswer("📍 *¿Dónde se ubica el daño?* (Por favor, describe la ubicación):", { capture: true }, 
        async (ctx, ctxFn) => {
            if (ctx.body.length < 3) { // Validación mínima de longitud
                return ctxFn.fallBack("❌ La descripción es muy corta. Por favor, proporciona más detalles.");
            }
            await ctxFn.state.update({ ubicacion: ctx.body });
        }
    )
    .addAnswer("📝 *¿Sobre qué elemento está el daño?*\n\nEjemplo: puerta, piso, ventana, etc. 🛠️", 
        { capture: true }, 
        async (ctx, ctxFn) => {
            const nombreRegex = /^[a-zA-ZÀ-ÿ\s]+$/;
            if (!nombreRegex.test(ctx.body)) {
                return ctxFn.fallBack("❌ *Nombre no válido.* Por favor, ingresa un nombre válido (solo letras y espacios).");
            }
            await ctxFn.state.update({ elemento: ctx.body });
        }
    )
    .addAnswer("🔧 Describe detalladamente el daño:", { capture: true }, 
        async (ctx, ctxFn) => {
            await ctxFn.state.update({ descripcionDanio: ctx.body });
        }
    )
    .addAnswer("📸 Por favor, envía una foto del daño:", { capture: true }, 
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
    .addAnswer("✅ ¡Gracias por la información! Nuestro equipo se pondrá en contacto contigo pronto. Si necesitas más ayuda, no dudes en escribirnos. 😊", null,
        async (ctx, ctxFn) => {
            const userInfo = ctxFn.state.getMyState();
            await appendToSheet([ 
                [
                    formattedTime, 
                    userInfo.conjunto, 
                    ctx.from, 
                    userInfo.nombreCompleto, 
                    userInfo.ubicacion,
                    userInfo.elemento,
                    userInfo.descripcionDanio
                ]
            ], spreadsheetId , userInfo.conjunto);
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
                // Limpiar archivo temporal después de subir
                if (fs.existsSync(userInfo.localPath)) {
                    fs.unlinkSync(userInfo.localPath);
                }
            }
            ctxFn.endFlow();
        }
);

