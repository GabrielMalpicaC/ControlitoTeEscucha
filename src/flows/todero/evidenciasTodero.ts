import { addKeyword } from '@builderbot/bot'
import { uploadFile } from 'scripts/drive';
import { appendToSheet } from 'scripts/sheets';
import { formattedTime } from 'scripts/utils';

const spreadsheetId = '1YWx_MhJ8mSxZiA6RaZv91sX965KMBxtvenN9FdXWdL0';
const driveId = '1PFuyYI-S1huUX75eMyCLPb9EUZ1Tf2bC';

export const evidenciasTodero = addKeyword('3')
    .addAnswer("📍 *¿En qué ubicación hiciste la actividad?*\nPor favor, descríbela de manera detallada. 😊", 
        { capture: true }, 
        async (ctx, ctxFn) => {
            await ctxFn.state.update({ ubicacion: ctx.body });
        }
    )
    .addAnswer("📝 *¿Sobre qué elemento trabajaste?*\n\nEjemplo: puerta, piso, ventana, etc. 🛠️", 
        { capture: true }, 
        async (ctx, ctxFn) => {
            const nombreRegex = /^[a-zA-ZÀ-ÿ\s]+$/;
            if (!nombreRegex.test(ctx.body)) {
                return ctxFn.fallBack("❌ *Nombre no válido.* Por favor, ingresa un nombre válido (solo letras y espacios).");
            }
            await ctxFn.state.update({ elemento: ctx.body });
        }
    )
    .addAnswer("📋 *¿Cuál es la actividad que realizaste?*\n\nPor favor, descríbela de manera detallada. 😊", 
        { capture: true }, 
        async (ctx, ctxFn) => {
            await ctxFn.state.update({ actividad: ctx.body });
        }
    )
    .addAnswer("📸 *¡Necesitamos una foto como evidencia!*\n\nPor favor, envíame una imagen de la actividad realizada. 😊", 
        { capture: true }, 
        async (ctx, ctxFn) => {
            // Verificar si el mensaje contiene una imagen
            if (!ctx.message || !ctx.message.imageMessage) {
                return ctxFn.fallBack("❌ *Debes enviar una imagen.* Por favor, adjunta una foto válida.");
            }

            const { imageMessage } = ctx.message;
            const mimeType = imageMessage.mimetype;

            // Validar que sea una imagen por MIME type
            if (!mimeType.startsWith('image/')) {
                return ctxFn.fallBack("🚫 *Archivo no válido.* El archivo debe ser una imagen (JPEG, PNG, etc.). Por favor, intenta nuevamente.");
            }

            // Guardar el archivo y subirlo
            const userInfo = ctxFn.state.getMyState();
            const localPath = await ctxFn.provider.saveFile(ctx, { path: './uploads' });

            // Pasar el mimeType a la función uploadFile
            uploadFile(localPath, ctx.from + '-' + ctx.pushName, userInfo.conjunto, driveId, spreadsheetId, mimeType);
        }
    )
    .addAnswer("✅ *¡Gracias por tu colaboración!*\n\nEl registro de la actividad ha sido exitoso. 😊\n\n¡Tu trabajo es muy valioso para nosotros! 🌟", 
        null, 
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
                    userInfo.actividad
                ]
            ], spreadsheetId , userInfo.conjunto);
            ctxFn.endFlow();
        }
    );