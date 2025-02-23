import { addKeyword, EVENTS } from '@builderbot/bot'
import { MemoryDB as Database } from '@builderbot/bot'
import { BaileysProvider as Provider } from '@builderbot/provider-baileys'
import { leerArchivo } from '../../../scripts/utils'

import { mantenimientoPreventivoFlow } from './mantenimientoPreven';
import { pqrsFlow } from './PQRS';
import { flujoPedidoInsumosAdministrador } from './solicitudInsumos';
import { altaPrioridadFlow } from './altaPrioridad';
import { listadoMorososFlow } from './listadoMorosos';


const menuAdministradorOpciones = leerArchivo('./mensajes/menuadministrador.txt');

export const menuAdministrador = addKeyword<Provider, Database>(EVENTS.ACTION)
    .addAnswer(menuAdministradorOpciones, 
        { capture: true }, 
        async (ctx, ctxFn) => {
            const opciones = ["1", "2", "3", "4" , "5" ,"0"];
            if (!opciones.includes(ctx.body)) {
                return ctxFn.fallBack("❌ No elegiste una opción válida, por favor intenta nuevamente.");
            }
            if (ctx.body === "0") {
                return ctxFn.endFlow("👋 ¡Gracias por usar el servicio! Hasta luego.");
            }
        }, 
        [ mantenimientoPreventivoFlow, pqrsFlow, flujoPedidoInsumosAdministrador , altaPrioridadFlow, listadoMorososFlow ]
    );