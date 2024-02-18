import { Request, Response, NextFunction } from "express";
import { Event } from "../models/Event";

// Get all events
export const getEvents = async (req: Request, res: Response) => {
    const events = await Event.fetchAll();
    res.json(events);
};

// Fet the form for adding a new event
export const getAddEventForm = (req: Request, res: Response, next: NextFunction) => {
    console.log("Devolvemos el formulario para meter eventos");
    res.json({ pageTitle: "Formulario", path: "/admin/add-event", editing: false });
};

// Post a new event to the database
export const postAddEvent = async (req: Request, res: Response, next: NextFunction) => {
    const { title, imageUrl, description, price } = req.body;
    if (title) {
        console.log('Ha llegado el siguiente evento: ', title);
        const evento = new Event(
            title,
            imageUrl,
            description,
            price
        );
        await evento.save(); 
        res.json(evento);
    } else {
        res.status(400).json({ error: 'Missing title field' });
    }
};

// Get the form for editing an existing event
export const getEditEventForm = async (req: Request, res: Response, next: NextFunction) => {
    console.log("getEditEventForm: Devolvemos el formulario para editar eventos");
    const editMode = req.query.edit === 'true';
    try {
        if (!editMode) {
            return res.status(400).json({ error: 'Missing edit query parameter or not set to true' });
        }
        const eventId = req.params.eventId;
        const event = await Event.findById(eventId);
        if (event) {
            res.json(event);
        } else {
            res.status(404).json({ error: 'Event not found' });
        }
    } catch (error) {
        console.error("Error al obtener evento para editar:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Put an updated event to the database
export const putEditEvent = async (req: Request, res: Response, next: NextFunction) => {
    console.log("putEditEvent");
    
    const { title, imageUrl, description, price, _id } = req.body;
    const event = await Event.findById(_id);
    if (event) {
        event.title = title;
        event.imageUrl = imageUrl;
        event.description = description;
        event.price = price;
        await event.save();
        return res.json(event);
    } else {
        res.status(404).json({ error: 'Event not found' });
    }
};

// Función delete
export const postDeleteEvent = async (req: Request, res: Response, next: NextFunction) => {
    const eventId = req.body._id;
    const event = await Event.findById(eventId);
    if (event) {
        await event.delete();
        return res.json(eventId+ " deleted");
    } else {
        res.status(404).json({ error: 'Event not found' });
    }
};

export const getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.body.user;
    const orders = await user.getOrders();
    res.json(orders);
};