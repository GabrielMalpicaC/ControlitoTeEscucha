import { addKeyword } from '@builderbot/bot'
import { appendToSheet } from 'scripts/sheets';
import { formattedTime } from 'scripts/utils';

const spreadsheetId = '17mXZ_HJbQE5YnExDzqc0scA2tpt1svBZV_LrtdfdFWo';
const menuPQRS = `📝 ¿En qué te podemos ayudar?

1️⃣ 📢 Queja
2️⃣ 🗣️ Sugerencia
3️⃣ 💡 Reclamo
4️⃣ ❓ Consulta
5️⃣ 🔄 Solicitud de seguimiento
0️⃣ ❌ Salir

💬 Responde con el número de la opción que deseas. 😊`;

export const pqrsFlow = addKeyword('2')
    .addAnswer(menuPQRS, { capture: true }, async (ctx, ctxFn) => {
        // Definir las opciones válidas y sus correspondientes valores
        const opcionesMap = {
            '1': 'Queja',
            '2': 'Sugerencia',
            '3': 'Reclamo',
            '4': 'Consulta',
            '5': 'Solicitud de seguimiento',
        };
    
        // Verificar si la opción seleccionada es válida
        if (!opcionesMap[ctx.body]) {
            return ctxFn.fallBack("❌ No elegiste una opción válida, por favor intenta nuevamente.");
        }
    
        // Actualizar el estado con la opción seleccionada
        await ctxFn.state.update({ peticion: opcionesMap[ctx.body] });
    })
    .addAnswer("🧑‍💻 Describe tu solicitud para que pueda ser atendida:", { capture: true }, 
        async (ctx, ctxFn) => {
            await ctxFn.state.update({ solicitud: ctx.body });
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
                    userInfo.nombreCompleto, 
                    userInfo.peticion,
                    userInfo.solicitud
                ]
            ], spreadsheetId , userInfo.conjunto);
            ctxFn.endFlow();
        }
);

