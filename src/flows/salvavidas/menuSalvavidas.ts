import { addKeyword, EVENTS } from '@builderbot/bot'
import { MemoryDB as Database } from '@builderbot/bot'
import { BaileysProvider as Provider } from '@builderbot/provider-baileys'
import { ingresoSalvavidas } from './ingresoSalvavidas';
import { salidaSalvavidas } from './salidaSalvavidas';
import { reporteFaltaPiscina } from './faltaPiscina';


const menuSalvavidasOpciones = `👋 Hola, ¿cómo puedo ayudarte?

1️⃣ 📝 Registro de asistencia
2️⃣ 🚪 Registro de salida
3️⃣ 🏊‍♂️⚠️ Reporte de falta en la piscina
0️⃣ ❌ Salir

💬 Responde con el número de la opción que deseas. 😊`;

export const menuSalvavidas = addKeyword<Provider, Database>(EVENTS.ACTION)
    .addAnswer(menuSalvavidasOpciones, 
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
        [ ingresoSalvavidas, salidaSalvavidas, reporteFaltaPiscina ]
    );