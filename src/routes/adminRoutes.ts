import { Router } from "express";
import { 
    getAddEventForm,        // Obtener la página para agregar un nuevo evento
    getAllOrders,       // Obtener todas las órdenes
    getEditEventForm,       // Obtener la página para editar un evento existente
    getEvents,          // Obtener todos los eventos
    postAddEvent,       // Manejar la solicitud POST para agregar un nuevo evento
    postDeleteEvent,    // Manejar la solicitud DELETE para eliminar un evento
    putEditEvent        // Manejar la solicitud PUT para editar un evento
} from "../controllers/adminCtrl.js";

// Crear un enrutador para las rutas relacionadas con la administración
export const adminRouter = Router();

// Definir rutas para las operaciones de administración de eventos
adminRouter.get('/events', getEvents);               // Obtener todos los eventos
adminRouter.get('/add-event', getAddEventForm);          // GET para presentar el formulario de agregar evento
adminRouter.post('/add-event', postAddEvent);        // POST para recibir los datos del formulario de agregar evento
adminRouter.get('/edit-event/:eventId', getEditEventForm);   // Obtener la página para editar un evento existente
adminRouter.put('/edit-event', putEditEvent);        // PUT para recibir los datos del formulario de editar evento
adminRouter.delete('/delete-event', postDeleteEvent);    // DELETE para eliminar un evento
adminRouter.get('/orders', getAllOrders);            // Obtener todas las órdenes
