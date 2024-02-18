import { ObjectId } from "mongodb";
import { collections } from "../services/databaseService.js";

// Define the Event class with its properties and constructor
export class Event {
    // Added a optional _id property
    public _id?: ObjectId;

    constructor(
        public title: string,
        public imageUrl: string,
        public description: string,
        public price: number,
        public id?: number // Renamed from 'id' to 'originalId' for clarity
    ) {
        // If an 'id' was passed, use it to initialize _id
        if(id) this._id = new ObjectId(id);
    }

    // Save method to update or insert the event in the database
    async save() {
        if (this._id) {
            // Update the existing event
            const result = await collections.events?.updateOne({ _id: this._id }, { $set: this });
            result
                ? console.log(`Event ID updated: ${this._id}`)
                : console.log("Failed to update event");
            return;
        } else {
            // Insert a new event
            const result = await collections.events?.insertOne(this);
            result
                ? console.log(`Event ID created: ${result.insertedId}`)
                : console.log("Failed to create event");
        }
    };

    // Static method to fetch all events from the database
    static async fetchAll() {
        return await collections.events?.find().toArray();
    };

    // Static method to find an event by its ID
    static async findById(eventId: string) {
        return await collections.events?.findOne({ _id: new ObjectId(eventId) });
    };

    // Static method to delete an event by its ID
    static async deleteById(eventId: string) {
       return await collections.events?.deleteOne({_id: new ObjectId(eventId)});
    }
}