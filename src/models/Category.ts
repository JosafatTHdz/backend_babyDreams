import mongoose, { Document, Schema } from "mongoose";

export interface ICategory extends Document {
    name: string;
    description: string;
    image: string;
    createdAt: Date;
}

const categorySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Category = mongoose.model<ICategory>("Category", categorySchema);
export default Category;