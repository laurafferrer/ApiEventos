import { Router } from "express";
import { 
    deleteCartItem,     // Eliminar un elemento del carrito
    getCart,            // Obtener el contenido del carrito
    getCheckOut,        // Obtener la página de pago
    getEventById,       // Obtener un evento por su ID
    getEvents,          // Obtener todos los eventos
    getIndex,           // Obtener la página de inicio
    getOrder,           // Obtener todas las órdenes
    postCart            // Agregar un producto al carrito
} from "../controllers/shopCtrl.js";

// Crear un enrutador para las rutas relacionadas con la tienda
export const shopRouter = Router();

// Definir rutas para las operaciones de la tienda
shopRouter.get('/', getIndex);                  // Obtener la página de inicio
shopRouter.get('/events', getEvents);           // Obtener todos los eventos
shopRouter.get('/events/:eventId', getEventById);   // Obtener un evento por su ID
shopRouter.post('/add-to-cart', postCart);      // Agregar un producto al carrito
shopRouter.get('/cart', getCart);               // Obtener el contenido del carrito
shopRouter.delete('/cart-delete-item', deleteCartItem);   // Eliminar un elemento del carrito
shopRouter.get('/orders', getOrder);            // Obtener todas las órdenes
shopRouter.get('/checkout', getCheckOut);       // Obtener la página de pago
