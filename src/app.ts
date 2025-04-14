import { createBot, createProvider, createFlow, addKeyword, EVENTS } from '@builderbot/bot'
import { MemoryDB as Database } from '@builderbot/bot'
import { BaileysProvider as Provider } from '@builderbot/provider-baileys'
import { isActive, obtenerNombreYRolYConjunto, arregloNumeros } from '../scripts/utils'
import { menuTodero } from '~/flows/todero/menuTodero'
import { menuCliente } from '~/flows/cliente/menuCliente'
import { menuSupervisor } from '~/flows/supervisor/menuSupervisor'
import { menuServiciosGenerales } from '~/flows/servicios-generales/menuServiciosGenerales'
import { menuSalvavidas } from '~/flows/salvavidas/menuSalvavidas'
import { menuAdministrador } from '~/flows/administrador/menuAdmi'
import { flowDirector } from './flows/director/flowDirector'
const PORT = process.env.PORT ?? 3008

const bienvenida = `¡Hola! Soy Controlito, tu asistente virtual de Control S.A.S.. 
Estoy aquí para ayudarte con lo que necesites, siempre dispuesto a escucharte. 🌟`;


const flowPrincipal = addKeyword<Provider, Database>(EVENTS.ACTION)
    .addAnswer(bienvenida, {
        media: 'https://github.com/GabrielMalpicaC/ControlitoTeEscucha/blob/main/imgs/controlito.jpg?raw=true'
    }, async (ctx, ctxFn) => {

        const persona = obtenerNombreYRolYConjunto(arregloNumeros, ctx.from);
        await ctxFn.state.update({ nombreCompleto: persona.nombre, rol: persona.rol, conjunto: persona.conjunto });
        const userInfo = ctxFn.state.getMyState();
        await ctxFn.flowDynamic(`Hola *${userInfo.nombreCompleto}*\nEstas en el menú de *${userInfo.rol.toUpperCase()}*`);

        const rolesFlujos = {
            'Administrador': menuAdministrador,
            'Supervisor': menuSupervisor,
            'Todero': menuTodero,
            'ServiciosGenerales': menuServiciosGenerales,
            'Salvavidas': menuSalvavidas,
            'Cliente': menuCliente,
        };

        const flujo = rolesFlujos[persona.rol] || rolesFlujos['Cliente'];

        return ctxFn.gotoFlow(flujo);
    });

    const flowRouter = addKeyword(EVENTS.WELCOME).addAction(async (ctx, ctxFn) => {
        const isUserActive = await isActive(ctx, ctxFn)
    
        if (!isUserActive) {
            console.log('Usuario no activo, finalizando flujo.')
            return ctxFn.endFlow()
        }
        return ctxFn.gotoFlow(flowPrincipal)
    })
    

const main = async () => {

    const adapterFlow = createFlow([
        flowRouter,
        flowDirector,
        flowPrincipal,
        menuTodero,
        menuCliente,
        menuAdministrador,
        menuServiciosGenerales,
        menuSalvavidas,
        menuSupervisor,
    ])
    
    const adapterProvider = createProvider(Provider)
    const adapterDB = new Database()

    const { handleCtx, httpServer } = await createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    adapterProvider.server.post(
        '/v1/messages',
        handleCtx(async (bot, req, res) => {
            const { number, message, urlMedia } = req.body
            await bot.sendMessage(number, message, { media: urlMedia ?? null })
            return res.end('sended')
        })
    )

    adapterProvider.server.post(
        '/v1/register',
        handleCtx(async (bot, req, res) => {
            const { number, name } = req.body
            await bot.dispatch('REGISTER_FLOW', { from: number, name })
            return res.end('trigger')
        })
    )

    adapterProvider.server.post(
        '/v1/samples',
        handleCtx(async (bot, req, res) => {
            const { number, name } = req.body
            await bot.dispatch('SAMPLES', { from: number, name })
            return res.end('trigger')
        })
    )

    adapterProvider.server.post(
        '/v1/blacklist',
        handleCtx(async (bot, req, res) => {
            const { number, intent } = req.body
            if (intent === 'remove') bot.blacklist.remove(number)
            if (intent === 'add') bot.blacklist.add(number)

            res.writeHead(200, { 'Content-Type': 'application/json' })
            return res.end(JSON.stringify({ status: 'ok', number, intent }))
        })
    )

    httpServer(+PORT)
}

main()
