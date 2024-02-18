import { Request, Response, NextFunction } from "express";
import { User } from "../models/User.js";
import { Event } from "../models/Event.js";

// Get the main page
export const getIndex = (req: Request, res: Response, next: NextFunction) => {
    res.json({ pageTitle: 'Tienda', path: '/' });
};

// Get all events
export const getEvents = async (req: Request, res: Response, next: NextFunction) => {
    const events = await Event.fetchAll();
    res.json(events);
};

// Get a single event by its id
export const getEventById = async (req: Request, res: Response, next: NextFunction) => {
    const eventId = req.params.eventId;
    const event = await Event.findById(eventId);
    if (event) {
        res.json(event);
    } else {
        res.status(404).json({ pageTitle: 'Evento no encontrado', path: '' });
    }
};

// Get elemnts from the user's cart
export const getCart = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.body.user as User;
    const items = await user.getCart();
    res.json(items);
};

// Add an event to the user's cart
export const postCart = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.body.user;
    const eventId = req.body.eventId;
    await user.addToCart(eventId);
    res.json(eventId + " added")
};

// Delete an event from the user's cart
export const deleteCartItem = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.body.user;
    const eventId = req.body.eventId;
    await user.deleteCartItem(eventId);
    res.json(eventId + " deleted")
};

// Get the user's orders
export const getOrder = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.body.user;
    const orders = await user.getOrders();
    res.json(orders);
};

// Make the purchase process
export const getCheckOut = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.body.user;
    try {
        const result = await user.addOrder();
        result
            ? console.log('Orden añadida: ', result)
            : console.log('Error en la orden');
            return res.json(result);
    } catch (error) {
        console.log(error);
    } 
};