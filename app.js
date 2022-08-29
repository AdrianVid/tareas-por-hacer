import colors from "colors";
import { guardarDB, leerDB } from "./helpers/guardarArchivo.js";

import {
  inquirerMenu,
  pausa,
  leerInput,
  listadoTareasBorrar,
  confirmar,
  mostrarListadoChecklist,
} from "./helpers/inquirer.js";

import { Tareas } from "./models/tareas.js";

const main = async () => {
  let opt = "";

  const tareas = new Tareas();

  const tareasDb = leerDB();

  if (tareasDb) {
    tareas.cargarTareasFromArray(tareasDb);
  }

  do {
    opt = await inquirerMenu();

    switch (opt) {
      case "1": // crear opcion
        const desc = await leerInput("Descripcion: ");
        tareas.crearTarea(desc);
        break;

      case "2":
        tareas.listadoCompleto();

        break;
      case "3": // Listar completadas
        tareas.listarPendientesCompletadas(true);

        break;
      case "4": // Listar penientes
        tareas.listarPendientesCompletadas(false);

        break;
      case "5": // Compleado | Pendiente
        const ids = await mostrarListadoChecklist(tareas.listadoArr);
        tareas.toggleCompletadas(ids);

        break;
      case "6": // Borrar tareas
        const id = await listadoTareasBorrar(tareas.listadoArr);
        if (id !== "0") {
          const ok = await confirmar("¿Estas seguro?");
          if (ok) {
            tareas.borrarTarea(id);
            console.log("Tarea borrada");
          }
        }

        break;
    }

    guardarDB(tareas.listadoArr);

    await pausa();
  } while (opt !== "0");

  //pausa();
};

main();
