import { User } from "./User.js";
import { Event } from "./Event.js";

// Define OrderItem interface
export interface OrderItem {
    event: Event,
    qty: number // Quantity
}

// Define Order interface
export interface Order {
    date: Date,
    user: User,
    items: OrderItem[] // OrderItem array
}