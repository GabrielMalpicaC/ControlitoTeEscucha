import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs';
import { addKeyword } from '@builderbot/bot';
import { uploadFile } from 'scripts/drive';
import { appendToSheet } from 'scripts/sheets';
import { conjuntos, definirConjunto, formattedTime, menuConjuntos } from 'scripts/utils';

const spreadsheetId = '1yPdxjd8eQ3rVrn1PDD026imqOnWld6vO_YcmWHeq1sk';
const driveId = '1qtvzBCTHGpunYO7ZhlJGQiJp7ERYFV9-';
const menuconjuntos = menuConjuntos

export const diagnosticoActividad = addKeyword('3')
    .addAnswer(menuconjuntos, { capture: true }, 
        async (ctx, ctxFn) => {
            const opciones = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15"];
            if (!opciones.includes(ctx.body)) {
                return ctxFn.fallBack("❌ No elegiste una opción válida, por favor intenta nuevamente.");
            }
            const conjuntoSeleccionado = definirConjunto(conjuntos, ctx.body);
            await ctxFn.state.update({ conjunto: conjuntoSeleccionado });
        }
    )
    .addAnswer("📍 *¿Dónde se realizó la actividad?* (Por favor, describe la ubicación):", { capture: true }, 
        async (ctx, ctxFn) => {
            if (ctx.body.length < 3) { // Validación mínima de longitud
                return ctxFn.fallBack("❌ La descripción es muy corta. Por favor, proporciona más detalles.");
            }
            await ctxFn.state.update({ ubicacion: ctx.body });
        }
    )
    .addAnswer("📝 *¿Sobre qué elemento se trabajó?*\n\nEjemplo: puerta, piso, ventana, etc. 🛠️", 
        { capture: true }, 
        async (ctx, ctxFn) => {
            const nombreRegex = /^[a-zA-ZÀ-ÿ\s]+$/;
            if (!nombreRegex.test(ctx.body)) {
                return ctxFn.fallBack("❌ *Nombre no válido.* Por favor, ingresa un nombre válido (solo letras y espacios).");
            }
            await ctxFn.state.update({ elemento: ctx.body });
        }
    )
    .addAnswer("📋 *¿Qué tipo de actividad se realizó?* (Por favor, describe el tipo de actividad):", { capture: true }, 
        async (ctx, ctxFn) => {
            if (ctx.body.length < 5) { // Validación mínima de longitud
                return ctxFn.fallBack("❌ La descripción es muy corta. Por favor, proporciona más detalles.");
            }
            await ctxFn.state.update({ actividad: ctx.body });
        }
    )
    .addAnswer("👤 *¿Quién es el responsable de la actividad?* (Nombre completo):", { capture: true }, 
        async (ctx, ctxFn) => {
            const nombreRegex = /^[a-zA-ZÀ-ÿ\s]+$/; // Valida nombres con letras y espacios
            if (!nombreRegex.test(ctx.body)) {
                return ctxFn.fallBack("❌ Por favor, ingresa un nombre válido.");
            }
            await ctxFn.state.update({ responsable: ctx.body });
        }
    )
    .addAnswer("⭐ *Califica la actividad del 1 al 5:*\n(1 = Muy mala, 5 = Excelente)", { capture: true }, 
        async (ctx, ctxFn) => {
            const calificacionRegex = /^[1-5]$/; // Valida números del 1 al 5
            if (!calificacionRegex.test(ctx.body)) {
                return ctxFn.fallBack("❌ Por favor, ingresa un número del 1 al 5.");
            }
            await ctxFn.state.update({ calificacion: ctx.body });
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
    .addAnswer("✅ *¡Gracias por la información! El registro de la actividad fue exitoso.* 😊", null,
        async (ctx, ctxFn) => {
            const userInfo = ctxFn.state.getMyState();
            try {
                await appendToSheet([
                    [
                        formattedTime,
                        userInfo.conjunto,
                        ctx.from,
                        userInfo.nombreCompleto,
                        userInfo.ubicacion,
                        userInfo.elemento,
                        userInfo.actividad,
                        userInfo.responsable
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