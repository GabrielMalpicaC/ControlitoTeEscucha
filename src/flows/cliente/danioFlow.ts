import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs';
import { addKeyword } from '@builderbot/bot'
import { uploadFile } from 'scripts/drive';
import { appendToSheet } from 'scripts/sheets';
import { conjuntos, definirConjunto, formattedTime, menuConjuntos } from 'scripts/utils';

const spreadsheetId = '18ImTrxRuJP7hc_-uc2QGHJEzLYqmuFjiNn3gSyezQso';
const driveId = '1yOum-0TtyZzArce4UNRG5ETM1j-nQ-y4'
const menuconjuntos = menuConjuntos

export const danioFlow = addKeyword('1')
    .addAnswer(menuconjuntos, { capture: true }, 
        async (ctx, ctxFn) => {
            const opciones = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15"];
            if (!opciones.includes(ctx.body)) {
                return ctxFn.fallBack("❌ No elegiste una opción válida, por favor intenta nuevamente.")
            }
            const conjuntoSeleccionado = definirConjunto(conjuntos, ctx.body);
            await ctxFn.state.update({ conjunto: conjuntoSeleccionado });
        }
    )
    .addAnswer("👤 ¿Cuál es tu nombre completo? Por favor, escríbelo:", { capture: true }, 
        async (ctx, ctxFn) => {
            const nombreRegex = /^[a-zA-ZÀ-ÿ\s]+$/;
            if(!nombreRegex.test(ctx.body)){
                return ctxFn.fallBack('❌ Porfavor ingresa un nombre válido y apellido')
            }
            await ctxFn.state.update({ nombreUsuario: ctx.body });
        }
    )
    .addAnswer("🏢 ¿En qué torre estás? (Si es una casa, escribe 'NA'):", { capture: true }, 
        async (ctx, ctxFn) => {
            const torreRegex = /^(NA|na|Na|nA|\d+)$/;
            if(!torreRegex.test(ctx.body)){
                return ctxFn.fallBack('❌ Porfavor ingresa una torre válida, o NA si vives en una casa')
            }
            await ctxFn.state.update({ torreUsuario: ctx.body });
        }
    )
    .addAnswer("🏠 ¿Cuál es el número de apartamento? (Si es una casa, indica el número de la casa):", { capture: true }, 
        async (ctx, ctxFn) => {
            const numeroRegex = /^\d+$/;
            if(!numeroRegex.test(ctx.body)){
                return ctxFn.fallBack('❌ Porfavor ingresa un apartamento o casa válida')
            }
            await ctxFn.state.update({ apartamentoUsuario: ctx.body });
        }
    )
    .addAnswer("🔧 Describe brevemente el daño y menciona la ubicación exacta dentro del conjunto:", { capture: true }, 
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
                    userInfo.nombreUsuario, 
                    userInfo.torreUsuario, 
                    userInfo.apartamentoUsuario, 
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
