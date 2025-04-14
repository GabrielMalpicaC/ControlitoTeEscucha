import { addKeyword, EVENTS } from '@builderbot/bot'
import { MemoryDB as Database } from '@builderbot/bot'
import { BaileysProvider as Provider } from '@builderbot/provider-baileys'
import { leerArchivo } from '../../../scripts/utils'
import { danioFlow as danioFlow } from './danioFlow'

const menuSolicitudes = leerArchivo('./mensajes/menucliente.txt');

export const menuCliente = addKeyword<Provider, Database>(EVENTS.ACTION)
    .addAnswer(menuSolicitudes, 
        { capture: true }, 
        async (ctx, ctxFn) => {
            const opciones = ["1", "0"];
            if (!opciones.includes(ctx.body)) {
                return ctxFn.fallBack("❌ No elegiste una opción válida, por favor intenta nuevamente.");
            }
            if (ctx.body === "0") {
                return ctxFn.endFlow("👋 ¡Gracias por usar el servicio! Hasta luego.");
            }
        }, 
        [ danioFlow, ]
    );
