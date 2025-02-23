import { addKeyword } from '@builderbot/bot'
import { appendToSheet } from 'scripts/sheets';
import { formattedTime } from 'scripts/utils';

const spreadsheetId = '1Qa3lBybYHJPYizOxTFS4g87TLOv97lC1BD2-5kg1Y6k';

const rangos = {
    'Ph del agua': { min: 7.2, max: 7.6 },
    'Nivel de cloro libre': { min: 1, max: 3 },
    'Alcalinidad total': { min: 80, max: 120 },
    'Dureza cálcica': { min: 200, max: 400 },
    'Cianúrico': { min: 30, max: 50 },
    'Turbidez de agua': { min: 0, max: 5 }
};

export const tomaPiscinaFlow = addKeyword('4')
    .addAnswer(`🌊 *Medición de Ph del agua*\n\n` +
        `El rango recomendado para el Ph del agua es:\n` +
        `🔹 Mínimo: *${rangos['Ph del agua'].min}*\n` +
        `🔹 Máximo: *${rangos['Ph del agua'].max}*\n\n` +
        `¿En qué rango está el valor medido?\n\n` +
        `1️⃣ Menor que ${rangos['Ph del agua'].min} ⬇️\n` +
        `2️⃣ Entre ${rangos['Ph del agua'].min} y ${rangos['Ph del agua'].max} ✅\n` +
        `3️⃣ Mayor que ${rangos['Ph del agua'].max} ⬆️`, 
        { capture: true }, async(ctx, ctxFn) => {
            const opcionesValidas = ["1", "2", "3"];
            if (!opcionesValidas.includes(ctx.body)) {
                return ctxFn.fallBack("❌ *Opción no válida.* Por favor, elige una opción del 1 al 3.");
            }

            let accion = 'Mantener'; // Acción por defecto
            let rangoToma = '';
            await ctxFn.state.update({ phAgua: 'Ph del agua' });

            switch (ctx.body) {
                case '1': // Menor que el mínimo
                    rangoToma = `Menor que ${rangos['Ph del agua'].min} ⬇️`;
                    accion = 'Aumentar 📈';
                    break;
                case '2': // Entre el mínimo y el máximo
                    rangoToma = `Entre ${rangos['Ph del agua'].min} y ${rangos['Ph del agua'].max} ✅`;
                    accion = 'Mantener 🟢';
                    break;
                case '3': // Mayor que el máximo
                    rangoToma = `Mayor que ${rangos['Ph del agua'].max} ⬆️`;
                    accion = 'Disminuir 📉';
                    break;
            }

            const userInfo = ctxFn.state.getMyState();
            await appendToSheet([ 
                [
                    formattedTime, 
                    userInfo.conjunto, 
                    ctx.from, 
                    userInfo.nombreCompleto,
                    userInfo.phAgua,
                    rangoToma,
                    accion
                ]
            ], spreadsheetId , userInfo.conjunto);
        }
    )
    .addAnswer(`🧪 *Medición de Nivel de cloro libre*\n\n` +
        `El rango recomendado para el Nivel de cloro libre es:\n` +
        `🔹 Mínimo: *${rangos['Nivel de cloro libre'].min}*\n` +
        `🔹 Máximo: *${rangos['Nivel de cloro libre'].max}*\n\n` +
        `¿En qué rango está el valor medido?\n\n` +
        `1️⃣ Menor que ${rangos['Nivel de cloro libre'].min} ⬇️\n` +
        `2️⃣ Entre ${rangos['Nivel de cloro libre'].min} y ${rangos['Nivel de cloro libre'].max} ✅\n` +
        `3️⃣ Mayor que ${rangos['Nivel de cloro libre'].max} ⬆️`, 
        { capture: true }, async(ctx, ctxFn) => {
            const opcionesValidas = ["1", "2", "3"];
            if (!opcionesValidas.includes(ctx.body)) {
                return ctxFn.fallBack("❌ *Opción no válida.* Por favor, elige una opción del 1 al 3.");
            }

            let accion = 'Mantener'; // Acción por defecto
            let rangoToma = '';
            await ctxFn.state.update({ cloroLibre: 'Nivel de cloro libre' });

            switch (ctx.body) {
                case '1': // Menor que el mínimo
                    rangoToma = `Menor que ${rangos['Nivel de cloro libre'].min} ⬇️`;
                    accion = 'Aumentar 📈';
                    break;
                case '2': // Entre el mínimo y el máximo
                    rangoToma = `Entre ${rangos['Nivel de cloro libre'].min} y ${rangos['Nivel de cloro libre'].max} ✅`;
                    accion = 'Mantener 🟢';
                    break;
                case '3': // Mayor que el máximo
                    rangoToma = `Mayor que ${rangos['Nivel de cloro libre'].max} ⬆️`;
                    accion = 'Disminuir 📉';
                    break;
            }

            const userInfo = ctxFn.state.getMyState();
            await appendToSheet([ 
                [
                    formattedTime, 
                    userInfo.conjunto, 
                    ctx.from, 
                    userInfo.nombreCompleto,
                    userInfo.cloroLibre,
                    rangoToma,
                    accion
                ]
            ], spreadsheetId , userInfo.conjunto);
        }
    )
    .addAnswer(`🧼 *Medición de Alcalinidad total*\n\n` +
        `El rango recomendado para la Alcalinidad total es:\n` +
        `🔹 Mínimo: *${rangos['Alcalinidad total'].min}*\n` +
        `🔹 Máximo: *${rangos['Alcalinidad total'].max}*\n\n` +
        `¿En qué rango está el valor medido?\n\n` +
        `1️⃣ Menor que ${rangos['Alcalinidad total'].min} ⬇️\n` +
        `2️⃣ Entre ${rangos['Alcalinidad total'].min} y ${rangos['Alcalinidad total'].max} ✅\n` +
        `3️⃣ Mayor que ${rangos['Alcalinidad total'].max} ⬆️`, 
        { capture: true }, async(ctx, ctxFn) => {
            const opcionesValidas = ["1", "2", "3"];
            if (!opcionesValidas.includes(ctx.body)) {
                return ctxFn.fallBack("❌ *Opción no válida.* Por favor, elige una opción del 1 al 3.");
            }

            let accion = 'Mantener'; // Acción por defecto
            let rangoToma = '';
            await ctxFn.state.update({ alcalinidad: 'Alcalinidad total' });

            switch (ctx.body) {
                case '1': // Menor que el mínimo
                    rangoToma = `Menor que ${rangos['Alcalinidad total'].min} ⬇️`;
                    accion = 'Aumentar 📈';
                    break;
                case '2': // Entre el mínimo y el máximo
                    rangoToma = `Entre ${rangos['Alcalinidad total'].min} y ${rangos['Alcalinidad total'].max} ✅`;
                    accion = 'Mantener 🟢';
                    break;
                case '3': // Mayor que el máximo
                    rangoToma = `Mayor que ${rangos['Alcalinidad total'].max} ⬆️`;
                    accion = 'Disminuir 📉';
                    break;
            }

            const userInfo = ctxFn.state.getMyState();
            await appendToSheet([ 
                [
                    formattedTime, 
                    userInfo.conjunto, 
                    ctx.from, 
                    userInfo.nombreCompleto,
                    userInfo.alcalinidad,
                    rangoToma,
                    accion
                ]
            ], spreadsheetId , userInfo.conjunto);
        }
    )
    .addAnswer(`💧 *Medición de Dureza cálcica*\n\n` +
        `El rango recomendado para la Dureza cálcica es:\n` +
        `🔹 Mínimo: *${rangos['Dureza cálcica'].min}*\n` +
        `🔹 Máximo: *${rangos['Dureza cálcica'].max}*\n\n` +
        `¿En qué rango está el valor medido?\n\n` +
        `1️⃣ Menor que ${rangos['Dureza cálcica'].min} ⬇️\n` +
        `2️⃣ Entre ${rangos['Dureza cálcica'].min} y ${rangos['Dureza cálcica'].max} ✅\n` +
        `3️⃣ Mayor que ${rangos['Dureza cálcica'].max} ⬆️`, 
        { capture: true }, async(ctx, ctxFn) => {
            const opcionesValidas = ["1", "2", "3"];
            if (!opcionesValidas.includes(ctx.body)) {
                return ctxFn.fallBack("❌ *Opción no válida.* Por favor, elige una opción del 1 al 3.");
            }

            let accion = 'Mantener'; // Acción por defecto
            let rangoToma = '';
            await ctxFn.state.update({ durezaCalcica: 'Dureza cálcica' });

            switch (ctx.body) {
                case '1': // Menor que el mínimo
                    rangoToma = `Menor que ${rangos['Dureza cálcica'].min} ⬇️`;
                    accion = 'Aumentar 📈';
                    break;
                case '2': // Entre el mínimo y el máximo
                    rangoToma = `Entre ${rangos['Dureza cálcica'].min} y ${rangos['Dureza cálcica'].max} ✅`;
                    accion = 'Mantener 🟢';
                    break;
                case '3': // Mayor que el máximo
                    rangoToma = `Mayor que ${rangos['Dureza cálcica'].max} ⬆️`;
                    accion = 'Disminuir 📉';
                    break;
            }

            const userInfo = ctxFn.state.getMyState();
            await appendToSheet([ 
                [
                    formattedTime, 
                    userInfo.conjunto, 
                    ctx.from, 
                    userInfo.nombreCompleto,
                    userInfo.durezaCalcica,
                    rangoToma,
                    accion
                ]
            ], spreadsheetId , userInfo.conjunto);
        }
    )
    .addAnswer(`☣️ *Medición de Cianúrico*\n\n` +
        `El rango recomendado para el Cianúrico es:\n` +
        `🔹 Mínimo: *${rangos['Cianúrico'].min}*\n` +
        `🔹 Máximo: *${rangos['Cianúrico'].max}*\n\n` +
        `¿En qué rango está el valor medido?\n\n` +
        `1️⃣ Menor que ${rangos['Cianúrico'].min} ⬇️\n` +
        `2️⃣ Entre ${rangos['Cianúrico'].min} y ${rangos['Cianúrico'].max} ✅\n` +
        `3️⃣ Mayor que ${rangos['Cianúrico'].max} ⬆️`, 
        { capture: true }, async(ctx, ctxFn) => {
            const opcionesValidas = ["1", "2", "3"];
            if (!opcionesValidas.includes(ctx.body)) {
                return ctxFn.fallBack("❌ *Opción no válida.* Por favor, elige una opción del 1 al 3.");
            }

            let accion = 'Mantener'; // Acción por defecto
            let rangoToma = '';
            await ctxFn.state.update({ cianurico: 'Cianúrico' });

            switch (ctx.body) {
                case '1': // Menor que el mínimo
                    rangoToma = `Menor que ${rangos['Cianúrico'].min} ⬇️`;
                    accion = 'Aumentar 📈';
                    break;
                case '2': // Entre el mínimo y el máximo
                    rangoToma = `Entre ${rangos['Cianúrico'].min} y ${rangos['Cianúrico'].max} ✅`;
                    accion = 'Mantener 🟢';
                    break;
                case '3': // Mayor que el máximo
                    rangoToma = `Mayor que ${rangos['Cianúrico'].max} ⬆️`;
                    accion = 'Botar agua';
                    break;
            }

            const userInfo = ctxFn.state.getMyState();
            await appendToSheet([ 
                [
                    formattedTime, 
                    userInfo.conjunto, 
                    ctx.from, 
                    userInfo.nombreCompleto,
                    userInfo.cianurico,
                    rangoToma,
                    accion
                ]
            ], spreadsheetId , userInfo.conjunto);
        }
    )
    .addAnswer(`🌫️ *Medición de Turbidez de agua*\n\n` +
        `El rango recomendado para la Turbidez de agua es:\n` +
        `🔹 Mínimo: *${rangos['Turbidez de agua'].min}*\n` +
        `🔹 Máximo: *${rangos['Turbidez de agua'].max}*\n\n` +
        `¿En qué rango está el valor medido?\n\n` +
        `1️⃣ Menor que ${rangos['Turbidez de agua'].min} ⬇️\n` +
        `2️⃣ Entre ${rangos['Turbidez de agua'].min} y ${rangos['Turbidez de agua'].max} ✅\n` +
        `3️⃣ Mayor que ${rangos['Turbidez de agua'].max} ⬆️`, 
        { capture: true }, async(ctx, ctxFn) => {
            const opcionesValidas = ["1", "2", "3"];
            if (!opcionesValidas.includes(ctx.body)) {
                return ctxFn.fallBack("❌ *Opción no válida.* Por favor, elige una opción del 1 al 3.");
            }

            let accion = 'Mantener'; // Acción por defecto
            let rangoToma = '';
            await ctxFn.state.update({ turbidez: 'Turbidez de agua' });

            switch (ctx.body) {
                case '1': // Menor que el mínimo
                    rangoToma = `Menor que ${rangos['Turbidez de agua'].min} ⬇️`;
                    accion = 'Aumentar 📈';
                    break;
                case '2': // Entre el mínimo y el máximo
                    rangoToma = `Entre ${rangos['Turbidez de agua'].min} y ${rangos['Turbidez de agua'].max} ✅`;
                    accion = 'Mantener 🟢';
                    break;
                case '3': // Mayor que el máximo
                    rangoToma = `Mayor que ${rangos['Turbidez de agua'].max} ⬆️`;
                    accion = 'Clarificar';
                    break;
            }

            const userInfo = ctxFn.state.getMyState();
            await appendToSheet([ 
                [
                    formattedTime, 
                    userInfo.conjunto, 
                    ctx.from, 
                    userInfo.nombreCompleto,
                    userInfo.turbidez,
                    rangoToma,
                    accion
                ]
            ], spreadsheetId , userInfo.conjunto);

            ctxFn.flowDynamic('¡Muchas gracias! 🌟\nLos datos han sido registrados con éxito. 🎉');
            ctxFn.endFlow();
        }
    );