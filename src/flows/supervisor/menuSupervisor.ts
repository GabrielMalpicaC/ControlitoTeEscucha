import { addKeyword, EVENTS } from '@builderbot/bot'
import { MemoryDB as Database } from '@builderbot/bot'
import { BaileysProvider as Provider } from '@builderbot/provider-baileys'
import { diagnosticoActividad } from './diagnosticoActividad';
import { ingresoSupervisor } from './ingresoSupervisor';
import { salidaSupervisor } from './salidaSupervisor';


const menuSupervisorOpciones = `👋 Hola, ¿cómo puedo ayudarte?

1️⃣ 📝 Registro de asistencia
2️⃣ 🚪 Registro de salida
3️⃣ 📊 Diagnóstico de actividad
0️⃣ ❌ Salir

💬 Responde con el número de la opción que deseas. 😊`

export const menuSupervisor = addKeyword<Provider, Database>(EVENTS.ACTION)
    .addAnswer(menuSupervisorOpciones, 
        { capture: true }, 
        async (ctx, ctxFn) => {
            const opciones = ["1", "2", "3" ];
            if (!opciones.includes(ctx.body)) {
                return ctxFn.fallBack("❌ No elegiste una opción válida, por favor intenta nuevamente.");
            }
            if (ctx.body === "0") {
                return ctxFn.endFlow("👋 ¡Gracias por usar el servicio! Hasta luego.");
            }
        }, 
        [ ingresoSupervisor, salidaSupervisor, diagnosticoActividad ]
    );