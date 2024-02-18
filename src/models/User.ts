import { ObjectId } from "mongodb";
import { collections } from "../services/databaseService.js";
import { title } from "node:process";
import { Order, OrderItem } from "./Order.js";
import { Event } from "./Event.js";

// Interfaz para representar una dirección
interface address {
    calle: string, // Nombre de la calle
    telf: string, // Número de teléfono
    CP: string // Código postal
}

// Interfaz para representar un elemento del carrito
export interface CartItem {
    pid: ObjectId, // Identificador del producto
    qty: number // Cantidad del producto
}

// Clase que representa un usuario
export class User {
    public _id?: ObjectId // Identificador del usuario
    public cart: CartItem[] = [] // Carrito del usuario

    // Constructor de la clase User
    constructor(
        public DNI: string, // Documento de identidad del usuario
        public name: string, // Nombre del usuario
        public mail: string, // Correo electrónico del usuario
        public contacto: address, // Información de contacto del usuario
        cart?: CartItem[], // Elementos iniciales del carrito (opcional)
        id?: string // Identificador del usuario (opcional)
    ) {
        if (id) this._id = new ObjectId(id)
        this.cart = cart ? cart : [] // Inicialización del carrito
    }

    // Método para guardar el usuario en la base de datos
    async save() {
        const result1 = await collections.users?.findOne({ DNI: this.DNI })
        if (result1) {
            this._id = result1._id
            return this
        }

        const result = await collections.users?.insertOne(this)
        console.log(result)
        result
            ? console.log(`Id del user creado ${result.insertedId}`)
            : console.log("No se ha podido crear el usuario")
        return this
    }

    // Método estático para buscar un usuario por su ID
    static async fetchById(id: string) {
        return await collections.users?.findOne({ _id: new ObjectId(id) })
    }

    // Método para añadir un elemento al carrito del usuario
    async addToCart(id: string) {
        const index = this.cart.findIndex(c => c.pid.toHexString() === id)
        if (index >= 0) {
            this.cart[index].qty += 1
        } else {
            const eventId = new ObjectId(id)
            this.cart.push({ pid: eventId, qty: 1 })
        }
        return await collections.users?.updateOne({ _id: this._id }, { $set: { cart: this.cart } })
    }

    // Método para obtener los elementos del carrito del usuario
    async getCart() {
        const eventsIds = this.cart.map(ci => ci.pid)
        const events = await collections.events?.find({ _id: { $in: eventsIds } }).toArray()

        return events?.map(e => {
            const qty = this.cart.find(ci => e._id.toHexString() === ci.pid.toHexString())?.qty
            return {
                id: e._id,
                title: e.title,
                price: e.price,
                qty: qty
            }
        })
    }

    // Método para eliminar un elemento del carrito del usuario
    async deleteCartItem(id: string) {
        const index = this.cart.findIndex(c => c.pid.toHexString() === id)
        if (index >= 0) {
            this.cart.splice(index, 1)
            return await collections.users?.updateOne({ _id: this._id }, { $set: { cart: this.cart } })
        }
    }

    // Método para añadir una orden basada en el carrito del usuario
    async addOrder() {
        if (this.cart.length > 0 && this._id) {
            const eventsId = this.cart.map(ci => ci.pid)
            const events = await collections.events?.find({ _id: { $in: eventsId } }).toArray()
            if (events) {
                const items: OrderItem[] = events.map(e => {
                    const qty = this.cart.find(ci => ci.pid.toHexString() === e._id.toHexString())!.qty
                    return {
                        event: e as Event, // Convertir el tipo a Event
                        qty: qty
                    }
                })
                const time = new Date()
                this.cart = []
                const result = await collections.users!.updateOne({ _id: this._id }, { $set: { cart: [] } })
                result
                    ? console.log('UpdateCart: ', result)
                    : console.log('Cart no vaciado')
                const newOrder: Order = { user: this, date: time, items: items}
                return await collections.orders?.insertOne(newOrder)
            }
        } else {
            return null
        }
    }

    // Método para obtener las órdenes asociadas al usuario
    async getOrders() {
        return await collections.orders?.find({ 'user._id': this._id }).toArray()
    }
}
