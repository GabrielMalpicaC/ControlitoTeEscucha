import { addKeyword } from '@builderbot/bot'
import { appendToSheet } from 'scripts/sheets';
import { conjuntos, definirConjunto, leerArchivo, formattedTime } from 'scripts/utils';

const spreadsheetId = '1N0E-4I3rDk6MDddAK_QaaL-8XDGSFXu_mzBE3eFGv5U';
const menuconjuntos = leerArchivo('./mensajes/menuconjuntos.txt');

export const ingresoSupervisor = addKeyword('1')
    .addAnswer(menuconjuntos, { capture: true }, 
        async (ctx, ctxFn) => {
            try {
                const opcionesValidas = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15"];

                // Validar la opción seleccionada
                if (!opcionesValidas.includes(ctx.body)) {
                    return ctxFn.fallBack("❌ No elegiste una opción válida, por favor intenta nuevamente.");
                }

                await ctxFn.state.update({ estado: 'Ingreso' });
                const conjuntoSeleccionado = definirConjunto(conjuntos, ctx.body);
                await ctxFn.state.update({ conjunto: conjuntoSeleccionado });

            } catch (error) {
                console.error("Error procesando la solicitud:", error);
                return ctxFn.fallBack("❌ Ocurrió un error, por favor intenta nuevamente.");
            }
        }
    )
    .addAnswer("🗺️ Por favor, envía tu ubicación actual:", { capture: true }, 
        async (ctx, ctxFn) => {
            // Validar que el mensaje contiene una ubicación
            if (!ctx.message.locationMessage) {
                return ctxFn.fallBack("❌ Debes enviar tu ubicación compartiéndola directamente desde WhatsApp.");
            }

            const userLatitude = ctx.message.locationMessage.degreesLatitude;
            const userLongitude = ctx.message.locationMessage.degreesLongitude;
            const ubicacion = `https://www.google.com/maps?q=${userLatitude},${userLongitude}`;   

            await ctxFn.state.update({ ubicacion: ubicacion });
        }
    )
    .addAnswer("✅ ¡Gracias por la información! Tu ingreso se ha registrado con éxito. 😊", null,
        async (ctx, ctxFn) => {
            const userInfo = ctxFn.state.getMyState();
            await appendToSheet([ 
                [
                    formattedTime, 
                    userInfo.conjunto, 
                    ctx.from, 
                    userInfo.nombreCompleto,
                    userInfo.estado,
                    userInfo.ubicacion
                ]
            ], spreadsheetId , userInfo.conjunto);
            ctxFn.endFlow();
        }
    );