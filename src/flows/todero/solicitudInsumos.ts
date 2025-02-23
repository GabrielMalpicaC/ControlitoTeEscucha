import { addKeyword } from '@builderbot/bot';
import { appendToSheet } from 'scripts/sheets';
import { formattedTime } from 'scripts/utils';
import { uploadFile } from 'scripts/drive';

const spreadsheetId = '1thSgVyj01wDT5aqzpdWAFbGz9VsHIGJW_ZF7mm4VaJk';
const driveId = '1PFuyYI-S1huUX75eMyCLPb9EUZ1Tf2bC'

// Flujo de agregar productos
export const flujoPedidoInsumosTodero = addKeyword('5')
    .addAnswer("📸Por favor, envíame una foto con los insumos que deseas pedir. 📦✨\n\nAsegúrate de que la foto sea clara y esté bien iluminada. 😊", { capture: true }, 
        async (ctx, ctxFn) => {
            
            // Verificar si el mensaje contiene una imagen
            if (!ctx.message || !ctx.message.imageMessage) {
                return ctxFn.fallBack("❌ Debes enviar una imagen válida.");
            }
            
            const { imageMessage } = ctx.message;
            const mimeType = imageMessage.mimetype;
            
            // Validar que sea una imagen por MIME type
            if (!mimeType.startsWith('image/')) {
                return ctxFn.fallBack("🚫 El archivo debe ser una imagen (JPEG, PNG, etc.). Por favor, intenta nuevamente.");
            }
            
            // Guardar el archivo y subirlo
            const userInfo = ctxFn.state.getMyState();
            const localPath = await ctxFn.provider.saveFile(ctx, { path: './uploads' });
            
            // Pasar el mimeType a la función uploadFile
            uploadFile(localPath, ctx.from + '-' + ctx.pushName, userInfo.conjunto, driveId, spreadsheetId, mimeType);
        }
    )
    .addAnswer('📝 *Confirmando tu pedido...*\nEn breve recibirás más información. 🚚', null, async (ctx, ctxFn) => {
        const userInfo = ctxFn.state.getMyState();
        try {
            await appendToSheet([
                [
                    formattedTime,
                    userInfo.conjunto,
                    ctx.from,
                    userInfo.nombreCompleto,
                ]
            ], spreadsheetId, userInfo.conjunto);
        } catch (error) {
            console.log('Error: ' + error);
        }
        ctxFn.endFlow();
    });