import mongoose from "mongoose"

export interface IDevice extends mongoose.Document {
  macAddress: string
  name?: string
  userId: mongoose.Types.ObjectId
  createdAt: Date
}

const deviceSchema = new mongoose.Schema({
  macAddress: { type: String, required: true, unique: true },
  name: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now }
})

const Device = mongoose.model("Device", deviceSchema)
export default Device
