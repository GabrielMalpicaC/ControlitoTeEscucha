import { addKeyword, EVENTS } from '@builderbot/bot'
import { MemoryDB as Database } from '@builderbot/bot'
import { BaileysProvider as Provider } from '@builderbot/provider-baileys'
import { leerArchivo } from '../../../scripts/utils'
import { ingresoServiciosGenerales } from './ingresoServiciosGenerales';
import { salidaServiciosGenerales } from './salidaServiciosGenerales';
import { malUsoZonaComun } from './malUsoZona';


const menuAseadoraOpciones = leerArchivo('./mensajes/menuserviciosgenerales.txt');

export const menuServiciosGenerales = addKeyword<Provider, Database>(EVENTS.ACTION)
    .addAnswer(menuAseadoraOpciones, 
        { capture: true }, 
        async (ctx, ctxFn) => {
            const opciones = ["1", "2", "3", "4", "0"];
            if (!opciones.includes(ctx.body)) {
                return ctxFn.fallBack("❌ No elegiste una opción válida, por favor intenta nuevamente.");
            }
            if (ctx.body === "0") {
                return ctxFn.endFlow("👋 ¡Gracias por usar el servicio! Hasta luego.");
            }
        }, 
        [ ingresoServiciosGenerales, salidaServiciosGenerales, malUsoZonaComun ]
    );