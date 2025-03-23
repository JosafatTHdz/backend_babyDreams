import mongoose from "mongoose";

const IoTDataSchema = new mongoose.Schema({
    temperature: { type: Number, required: true },
    humidity: { type: Number, required: true },
    obstaculo: { type: Boolean, required: true },
    balanceoActivo: { type: Boolean, required: true },
    carruselActivo: { type: Boolean, required: true },
    timestamp: { type: Date, default: Date.now },
    deviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Device", required: true }
});

const IoTData = mongoose.model("IoTData", IoTDataSchema);
export default IoTData;
