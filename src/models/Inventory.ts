import mongoose, { Document, Schema } from "mongoose";

export interface IInventory extends Document {
    stock: Number
    price: Number
    minStock: Number
    lastUpdate: Date
}

const inventorySchema = new Schema({
    stock: { 
        type: Number, 
        required: true, 
        min: 0 
    },
    price: { 
        type: Number, 
        required: true, 
        min: 0 
    },
    minStock: { 
        type: Number, 
        required: true, 
        min: 0 },
    lastUpdated: { 
        type: Date, 
        default: Date.now 
    }
});

const Inventory = mongoose.model<IInventory>('Inventory', inventorySchema)
export default Inventory
