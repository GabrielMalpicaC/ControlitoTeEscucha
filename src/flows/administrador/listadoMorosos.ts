import { addKeyword } from '@builderbot/bot'
import { uploadFile } from 'scripts/drive';
import { appendToSheet } from 'scripts/sheets';
import { formattedTime } from 'scripts/utils';

const spreadsheetId = '1FUsUMxnrnMfK4DAwIMGpCygmNW8hbcYIN-IIbvLqIrM';
const driveId = '1Q2OetRkW7NxIulGnUOLnLfC4hWzJd_Qt';

export const listadoMorososFlow = addKeyword('5')
    .addAnswer("📋 Adjunta un PDF con el listado de personas morosas en el pago de la administración:", { capture: true }, 
        async (ctx, ctxFn) => {

            const documentMessage = ctx.message.documentWithCaptionMessage?.message?.documentMessage;

            if (!documentMessage) {
                return ctxFn.fallBack("🚫 No se ha detectado ningún archivo. Por favor, adjunta un PDF.");
            }

            const fileName = documentMessage.fileName;
            const mimeType = documentMessage.mimetype;

            console.log("Nombre del archivo:", fileName);
            console.log("MIME type:", mimeType);

            if (mimeType !== 'application/pdf' || !fileName.toLowerCase().endsWith('.pdf')) {
                return ctxFn.fallBack("🚫 El archivo debe ser un PDF. Por favor, intenta nuevamente.");
            }

            const userInfo = ctxFn.state.getMyState();
            const localPath = await ctxFn.provider.saveFile(ctx, { path: './uploads' });

            uploadFile(localPath, fileName, userInfo.conjunto, driveId, spreadsheetId, mimeType);
        }
    )
    .addAnswer("✅ ¡Gracias por la información!", null,
        async (ctx, ctxFn) => {
            const userInfo = ctxFn.state.getMyState();
            await appendToSheet([ 
                [
                    formattedTime, 
                    userInfo.conjunto, 
                    ctx.from, 
                    userInfo.nombreCompleto,
                ]
            ], spreadsheetId , userInfo.conjunto);
            ctxFn.endFlow();
        }
);