import { addKeyword } from '@builderbot/bot'
import { appendToSheet } from 'scripts/sheets';
import { formattedTime } from 'scripts/utils';

const spreadsheetId = '1yfTMp4_8ah1qPlX-z-_VC3lMKcAQ2aCwHatNT5o-rbo';

export const altaPrioridadFlow = addKeyword('4')
    .addAnswer("Cual es la instruccion de alta prioridad/inmediata:", { capture: true }, 
        async (ctx, ctxFn) => {
            await ctxFn.state.update({ instruccion: ctx.body });
        }
    )
    .addAnswer("A que persona será dirigida esta actividad:", { capture: true }, 
        async (ctx, ctxFn) => {
            await ctxFn.state.update({ responsable: ctx.body });
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
                    userInfo.instruccion,
                    userInfo.responsable
                ]
            ], spreadsheetId , 'Alta prioridad');
            ctxFn.endFlow();
        }
    );