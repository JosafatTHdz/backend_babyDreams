import mongoose, { Schema, Document } from 'mongoose'

export interface IUser extends Document {
    handle: string
    name: string,
    email: string,
    phone: string,
    password: string
    role: string
}

const userSchema = new Schema({
    handle : {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true
    },
    name : {
        type: String,
        required: true,
        trim: true,
    },
    email : {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },
    phone : {
        type: String,
        required: true,
        trim: true
    },
    password : {
        type: String,
        required: true,
        trim: true,
    },
    role : {
        type: String,
        default: 'user',
        enum: ['user', 'admin']
    }
})

const User = mongoose.model<IUser>('User', userSchema)
export default User