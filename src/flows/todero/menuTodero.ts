import { addKeyword, EVENTS } from '@builderbot/bot'
import { MemoryDB as Database } from '@builderbot/bot'
import { BaileysProvider as Provider } from '@builderbot/provider-baileys'
import { leerArchivo } from '../../../scripts/utils'

import { ingresoTodero } from './ingresoTodero';
import { evidenciasTodero } from './evidenciasTodero';
import { salidaTodero } from './salidaTodero';
import { tomaPiscinaFlow } from './tomaPiscinas';
import { flujoPedidoInsumosTodero } from './solicitudInsumos';

const menuToderoOpciones = leerArchivo('./mensajes/menutodero.txt');

export const menuTodero = addKeyword<Provider, Database>(EVENTS.ACTION)
    .addAnswer(menuToderoOpciones, 
        { capture: true }, 
        async (ctx, ctxFn) => {
            const opciones = ["1", "2", "3", "4", "5", "0"];
            if (!opciones.includes(ctx.body)) {
                return ctxFn.fallBack("❌ No elegiste una opción válida, por favor intenta nuevamente.");
            }
            if (ctx.body === "0") {
                return ctxFn.endFlow("👋 ¡Gracias por usar el servicio! Hasta luego.");
            }
        }, 
        [ingresoTodero, salidaTodero, evidenciasTodero, tomaPiscinaFlow, flujoPedidoInsumosTodero]
    );