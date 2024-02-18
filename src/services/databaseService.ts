import * as mongoDB from 'mongodb';
import * as dotenv from 'dotenv';

import { Event } from '../models/Event.js';
import { User } from '../models/User.js';
import { Order } from '../models/Order.js';

export const collections: {
    events?: mongoDB.Collection<Event>,
    users?: mongoDB.Collection<User>,
    orders?: mongoDB.Collection<Order>
} = {};

export async function connectToDatabase(){
    dotenv.config();
    const client: mongoDB.MongoClient = new mongoDB.MongoClient(process.env.DB_CONN_STRING!);
    await client.connect();
    const db: mongoDB.Db = client.db(process.env.DB_NAME);

    collections.events = db.collection<Event>(process.env.EVENT_COLLECTION!);
    collections.users = db.collection<User>(process.env.USER_COLLECTION!);
    collections.orders = db.collection<Order>(process.env.ORDER_COLLECTION!);
    

    console.log(`Hemos conectado a la base de datos: ${db.databaseName} y la colección: ${collections.events.collectionName}`);
    console.log(`Hemos conectado a la base de datos: ${db.databaseName} y la colección: ${collections.users.collectionName}`);
    console.log(`Hemos conectado a la base de datos: ${db.databaseName} y la colección: ${collections.orders.collectionName}`);
}