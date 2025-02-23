import { addKeyword } from '@builderbot/bot'
import { isActive } from 'scripts/utils';


export const flowDirector = addKeyword(["!active", "!help"])
    .addAction(async (ctx, ctxFn) => {
        //Lista de números de administradores autorizados
        const adminNum = ["573196748953", "573187140247"];

        // Validación de número de administrador
        if (!adminNum.includes(ctx.from)) {
            return ctxFn.flowDynamic("⚠️ Lo siento, no tienes permiso para usar este comando.");
        }

        // Comando de ayuda
        if (ctx.body.includes("!help")) {
            return ctxFn.flowDynamic("🤖 Comandos disponibles:\n✅ *!active* - Activa o desactiva el bot para todas las conversaciones.");
        }

        // Comando para encender/apagar el bot
        if (ctx.body.includes("!active")) {
            const estadoActual = await isActive(ctx, ctxFn);
            await ctxFn.globalState.update({ encendido: !estadoActual });
            return ctxFn.flowDynamic(
                estadoActual ? "🔴 Bot desactivado." : "🟢 Bot activado."
            );
        }
    });
