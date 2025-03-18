import mongoose, { Document, Schema, Types } from "mongoose";

export interface IProduct extends Document {
    name: string
    description: string
    category: Types.ObjectId
    stock: number
    price: number
    image: string
    createdAt: Date
    updatedAt: Date
}

const productSchema = new Schema({
    name : {
        type: String,
        required: true,
    },
    description : {
        type: String,
        required: true,
    },
    category : {
        type: Types.ObjectId,
        required: true
    },
    stock : {
        type: Number,
        required: true
    },
    price : {
        type: Number,
        required: true
    },
    image : {
        type: String,
        default: ''
    },
},
{ timestamps: true}
)

const Product = mongoose.model<IProduct>('Product', productSchema)
export default Product