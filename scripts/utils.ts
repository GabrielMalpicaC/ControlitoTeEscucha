import fs from 'fs';
import path from 'path';

type GlobalState = {
    encendido?: boolean;
    convOff?: Record<string, string>;
};

type CtxFn = {
    globalState: {
        getMyState: () => Promise<GlobalState>;
        update: (state: GlobalState) => Promise<void>;
    };
    flowDynamic: (message: string) => Promise<void>;
};

export const conjuntos = [
    { '1': 'Alborada' },
    { '2': 'Balcones de Gratamira' },
    { '3': 'Buganviles' },
    { '4': 'Centauros A' },
    { '5': 'Cerrocampestre' },
    { '6': 'Emaús' },
    { '7': 'Mi Finca en el Llano' },
    { '8': 'Montearroyo' },
    { '9': 'Nueva Esperanza 2' },
    { '10': 'Parques de Castillas' },
    { '11': 'Quintas de Morelia' },
    { '12': 'Quintas de San Souuci' },
    { '13': 'Serramonte 3' },
    { '14': 'Torres de Mediterraneo' },
    { '15': 'Torres de San Juan' }
];

export const arregloNumeros = [
    { conjunto: "Alborada", nombre: "JOHAN SANTIAGO CARACAS BASTIDAS", numero: "573219230538", rol: "TODERO" },
    { conjunto: "Alborada", nombre: "MIGUEL ANGEL LOPEZ MAHECHA", numero: "573242535592", rol: "SALVAVIDAS" },
    { conjunto: "Alborada", nombre: "BRAYAN ANDRES GIRATA QUIROGA", numero: "573224358921", rol: "TODERO" },
    { conjunto: "Alborada", nombre: "YENNY FABIOLA ORTEGA VALENCIA", numero: "573143270566", rol: "ServiciosGenerales" },
    { conjunto: "Alborada", nombre: "KELLYS VILLA", numero: "573222365977", rol: "ServiciosGenerales" },
    { conjunto: "Alborada", nombre: "CATALINA", numero: "573506202424", rol: "ADMINISTRADOR" },
    { conjunto: "Balcones de Gratamira", nombre: "OLGA M. GUTIERREZ. M", numero: "3112397741", rol: "ADMINISTRADOR" },
    { conjunto: "Buganviles", nombre: "GLACIDIA VASQUEZ", numero: "573203085992", rol: "ADMINISTRADOR" },
    { conjunto: "Centauros A", nombre: "ANA BEATRIZ HINESTROZA HURTADO", numero: "573154233893", rol: "ServiciosGenerales" },
    { conjunto: "Centauros A", nombre: "STELLA DURAN CABRERA", numero: "573215428265", rol: "ServiciosGenerales" },
    { conjunto: "Centauros A", nombre: "CLAUDIA BANQUET ACOSTA", numero: "573224592274", rol: "ServiciosGenerales" },
    { conjunto: "Centauros A", nombre: "FERLEY ANTONIO HERNANDEZ HERNANDEZ", numero: "573144919096", rol: "TODERO" },
    { conjunto: "Centauros A", nombre: "OLGA", numero: "573202336479", rol: "ADMINISTRADOR" },
    { conjunto: "Cerrocampestre", nombre: "DANIEL LOMBANA BOLAÑOS", numero: "573214576682", rol: "TODERO SALVAVIDAS" },
    { conjunto: "Cerrocampestre", nombre: "DANI HUMBERTO BOHORQUEZ AVENDAÑO", numero: "573138009791", rol: "TODERO" },
    { conjunto: "Cerrocampestre", nombre: "SANDRA MARGOTH MORENO", numero: "573213373759", rol: "ADMINISTRADOR" },
    { conjunto: "Emaús", nombre: "DULYS", numero: "3114923689", rol: "ADMINISTRADOR" },
    { conjunto: "Emaús", nombre: "LIZ VANESSA MUCA YUCUNA", numero: "573122652567", rol: "SALVAVIDAS" },
    { conjunto: "Montearroyo", nombre: "HEVER MARTINEZ", numero: "573106455233", rol: "ADMINISTRADOR" },
    { conjunto: "Montearroyo", nombre: "NOE NIÑO QUINTERO", numero: "573238306651", rol: "TODERO" },
    { conjunto: "Montearroyo", nombre: "OSCAR FABIAN APACHE FORERO", numero: "573207704524", rol: "TODERO" },
    { conjunto: "Montearroyo", nombre: "CARLOS ALBERTO PAEZ VALDEZ", numero: "573208934355", rol: "SALVAVIDAS" },
    { conjunto: "Montearroyo", nombre: "INGRID PUREZA GUTIERREZ RODRIGUEZ", numero: "573108036180", rol: "ServiciosGenerales" },
    { conjunto: "Montearroyo", nombre: "RUBBY IDALITH DURAN RIVERA", numero: "573204133729", rol: "ServiciosGenerales" },
    { conjunto: "Nueva Esperanza 2", nombre: "OSCAR FABIAN APACHE FORERO", numero: "573207704524", rol: "TODERO" },
    { conjunto: "Nueva Esperanza 2", nombre: "GERMAN RODRIGUEZ", numero: "573209789304", rol: "TODERO" },
    { conjunto: "Nueva Esperanza 2", nombre: "OSCAR VIGOYA", numero: "573222518567", rol: "ADMINISTRADOR" },
    { conjunto: "Parques de Castillas", nombre: "PATRICIA", numero: "573046647834", rol: "ADMINISTRADOR" },
    { conjunto: "Quintas de Morelia", nombre: "YENNY YACE", numero: "573202755027", rol: "ADMINISTRADOR" },
    { conjunto: "Quintas de Morelia", nombre: "LUIS ESTEBAN DIAZ ALEJO", numero: "573206185156", rol: "SALVAVIDAS" },
    { conjunto: "Quintas de Morelia", nombre: "DIDIER ESNEIDER PARRADO PARRADO", numero: "573208351201", rol: "TODERO" },
    { conjunto: "Quintas de Morelia", nombre: "ORLANDO ASPRILLA", numero: "573102215009", rol: "TODERO" },
    { conjunto: "Quintas de Morelia", nombre: "STYVEN YOSSEPH LOPEZ RAMIREZ", numero: "573134200689", rol: "SALVAVIDAS" },
    { conjunto: "Quintas de San Souuci", nombre: "CAMILO VEGA", numero: "573112298950", rol: "ADMINISTRADOR" },
    { conjunto: "Quintas de San Souuci", nombre: "DANEIL ALEXANDER BAUTISTA", numero: "573204133729", rol: "TODERO - SALVAVIDAS" },
    { conjunto: "Serramonte 3", nombre: "DIANA SOFIA BARRERA", numero: "573134588357", rol: "ADMINISTRADOR" },
    { conjunto: "Serramonte 3", nombre: "LUIS EDUARDO BOHORQUEZ AVENDAÑO", numero: "573118599288", rol: "TODERO" },
    { conjunto: "Serramonte 3", nombre: "STEBAN ENRIQUE ALFONSO SALAZAR", numero: "573228910843", rol: "SALVAVIDAS" },
    { conjunto: "Torres de Mediterraneo", nombre: "JUAN ESTEBAN ROJAS BEJARANO", numero: "3114672696", rol: "SALVAVIDAS" },
    { conjunto: "Torres de Mediterraneo", nombre: "ALEXANDRA", numero: "573153873859", rol: "ADMINISTRADOR" },
    { conjunto: "Torres de San Juan", nombre: "LEIDER FABIO RAMIREZ SALAZAR", numero: "573108648636", rol: "SALVAVIDAS" },
    { conjunto: "Torres de San Juan", nombre: "CARMEN CECILIA MORENO BENITEZ", numero: "573204408817", rol: "ServiciosGenerales" },
    { conjunto: "Torres de San Juan", nombre: "NESTOR HERRERA MEDINA", numero: "573227291260", rol: "TODERO" },
    { conjunto: "Torres de San Juan", nombre: "JUAN ALBERTO MONTAÑEZ", numero: "573222957838", rol: "TODERO" },
    { conjunto: "Torres de San Juan", nombre: "ELENA MARIA BABATIVA GOMEZ", numero: "573219791545", rol: "ServiciosGenerales" },
    { conjunto: "Torres de San Juan", nombre: "ROCIO", numero: "573144603942", rol: "ADMINISTRADOR" },
];

const currentDate = new Date();
const year = currentDate.getFullYear();
const month = String(currentDate.getMonth() + 1).padStart(2, '0');
const day = String(currentDate.getDate()).padStart(2, '0');
const hours = String(currentDate.getHours()).padStart(2, '0');
const minutes = String(currentDate.getMinutes()).padStart(2, '0');
const seconds = String(currentDate.getSeconds()).padStart(2, '0');
export const formattedTime = `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;

export function leerArchivo(txtFile: string): string | null {
    const archivoRuta = path.resolve(txtFile); // Resuelve la ruta absoluta del archivo
    if (fs.existsSync(archivoRuta)) { // Verifica si el archivo existe
      const contenido = fs.readFileSync(archivoRuta, 'utf-8'); // Lee el archivo en formato utf-8
      return contenido;
    } else {
      console.error('El archivo no existe.');
      return null;
    }
  }

// Verificar si el bot global está activo
export const isActive = async (_, { globalState }) => {
    // Obtener el estado actual de 'encendido' desde el estado global
    const encendido = await globalState.get('encendido');

    // Si 'encendido' no está definido, inicializarlo como `true` (por defecto)
    if (encendido === undefined) {
        await globalState.update({ encendido: true }); // Establecer el valor predeterminado
        return true; // Devolver `true` porque el bot está encendido por defecto
    }

    // Devolver el valor actual de 'encendido'
    return encendido;
};


// Verificar si una conversación está activa
export const isConvActive = async (number: string, { globalState }): Promise<boolean> => {
    // Obtener el estado de conversaciones desactivadas desde el estado global
    const convOff = await globalState.get('convOff') || {};

    // Verificar si el número está en el objeto convOff
    if (convOff[number]) {
        const deactivationDate = new Date(convOff[number]); // Fecha de desactivación
        const currentDate = new Date(); // Fecha actual
        const hoursDiff = (currentDate.getTime() - deactivationDate.getTime()) / (1000 * 60 * 60); // Diferencia en horas

        // Si han pasado más de 48 horas, la conversación se reactiva
        return hoursDiff >= 48;
    }

    // Si el número no está en convOff, la conversación está activa
    return true;
};

// Activar / Desactivar conversación
export const toggleActive = async (number: string, ctxFn: CtxFn): Promise<boolean> => {
    const currentGlobalState = await ctxFn.globalState.getMyState();
    const convOff = currentGlobalState.convOff ?? {};
    const isActive = await isConvActive(number, ctxFn);

    if (isActive) {
        // Si está activa, desactivarla
        convOff[number] = new Date().toISOString(); // Guardar la fecha actual en formato ISO
        await ctxFn.flowDynamic("Conversación desactivada.");
    } else {
        // Si está desactivada, activarla
        delete convOff[number]; // Remover el número de convOff
        await ctxFn.flowDynamic("Conversación reactivada.");
    }

    // Actualizar el estado global con el nuevo convOff
    currentGlobalState.convOff = convOff;
    await ctxFn.globalState.update(currentGlobalState);

    return !isActive; // Devolver el nuevo estado
};

// Listar conversaciones desactivadas
export const conversationsOff = async (ctxFn: CtxFn): Promise<[string, string][]> => {
    const currentGlobalState = await ctxFn.globalState.getMyState();
    const convOff = currentGlobalState.convOff ?? {};
    const result: [string, string][] = [];

    for (const number in convOff) {
        if (Object.prototype.hasOwnProperty.call(convOff, number)) {
            const deactivationDate = new Date(convOff[number]);
            const currentDate = new Date();
            const timeDiff = 48 * 60 * 60 * 1000 - (currentDate.getTime() - deactivationDate.getTime()); // Tiempo restante en ms

            if (timeDiff > 0) {
                const hours = Math.floor(timeDiff / (1000 * 60 * 60));
                const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
                result.push([number, `Tiempo restante para reactivarse - ${hours}hs ${minutes}minutos`]);
            } else {
                // El tiempo ya ha pasado, lo removemos
                delete convOff[number];
            }
        }
    }

    // Actualizar el estado global si hemos removido números desactivados
    currentGlobalState.convOff = convOff;
    await ctxFn.globalState.update(currentGlobalState);

    return result;
};


export const definirConjunto = (conjuntos, input) => {
    // Convertir el input a entero y calcular el índice
    const conjuntoIndex = parseInt(input) - 1;

    // Validar si el índice está dentro del rango del arreglo
    if (conjuntoIndex >= 0 && conjuntoIndex < conjuntos.length) {
        // Acceder al valor correspondiente
        return conjuntos[conjuntoIndex][input];
    } else {
        // Si el índice está fuera de rango, manejar el error
        return "El conjunto no existe o el input es inválido.";
    }
};

export function obtenerNombreYRolYConjunto(
    arreglo: { numero: string; nombre: string; rol: string; conjunto?: string }[],
    numero: string
): { nombre: string; rol: string; conjunto?: string } {
    // Buscar el objeto en el arreglo
    const encontrado = arreglo.find(objeto => objeto.numero === numero);

    // Si no se encuentra, retornar el rol de "Cliente" y conjunto vacío
    if (!encontrado) {
        return { nombre: '', rol: 'Cliente', conjunto: '' };
    }

    // Verificar si el rol es uno de los casos especiales
    if (encontrado.rol.includes('Todero') && encontrado.rol.includes('Salvavidas')) {
        // Obtener el día de la semana (0 = Domingo, 6 = Sábado)
        const diaDeLaSemana = new Date().getDay();

        // Determinar si es fin de semana (Sábado o Domingo)
        const esFinDeSemana = diaDeLaSemana === 0 || diaDeLaSemana === 6;

        // Asignar el rol según el día
        if (esFinDeSemana) {
            return { 
                nombre: encontrado.nombre, 
                rol: 'Salvavidas', 
                conjunto: encontrado.conjunto 
            };
        } else {
            return { 
                nombre: encontrado.nombre, 
                rol: 'Todero', 
                conjunto: encontrado.conjunto 
            };
        }
    }

    // Si el rol es "Supervisor", no devolver el conjunto
    if (encontrado.rol === 'Supervisor') {
        return { 
            nombre: encontrado.nombre, 
            rol: encontrado.rol 
        };
    }

    // Si no es un caso especial, retornar el rol y conjunto normal
    return { 
        nombre: encontrado.nombre, 
        rol: encontrado.rol, 
        conjunto: encontrado.conjunto 
    };
}

const utils = { 
    isActive, 
    isConvActive, 
    toggleActive,
    conversationsOff, 
    definirConjunto,
    leerArchivo 
};

export default utils;