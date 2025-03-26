import mqtt from "mqtt";
import IoTData from "../models/IoT";
import Device from "../models/Device";
import { Server as SocketIOServer } from "socket.io";

const mqttClient = mqtt.connect("mqtts://jfae02f3.ala.us-east-1.emqxsl.com", {
    port: 8883,
    username: "esp32",
    password: "12345678",
});

mqttClient.on("connect", () => {
    console.log("✅ Conectado al broker MQTT");
    mqttClient.subscribe("esp32/datos");
});

mqttClient.on("message", async (topic, message) => {
    try {
      if (topic === "esp32/datos") {
        const data = JSON.parse(message.toString());
        const { temperature, humidity, obstaculo, balanceoActivo, carruselActivo, macAddress } = data;
  
        if (
          typeof macAddress !== "string" ||
          typeof temperature !== "number" ||
          typeof humidity !== "number" ||
          typeof obstaculo !== "boolean" ||
          typeof balanceoActivo !== "boolean" ||
          typeof carruselActivo !== "boolean"
        ) {
          return console.error("❌ Datos inválidos");
        }
  
        const dispositivo = await Device.findOne({ macAddress: macAddress.toUpperCase() });
        if (!dispositivo) {
          console.log("⚠️ Dispositivo no encontrado:", macAddress);
          return;
        }
  
        const nuevaLectura = new IoTData({
          temperature,
          humidity,
          obstaculo,
          balanceoActivo,
          carruselActivo,
          deviceId: dispositivo._id,
        })
  
        await nuevaLectura.save()
        console.log("✅ Datos guardados para dispositivo:", macAddress)
      }
    } catch (error) {
      console.error("❌ Error al procesar MQTT:", error)
    }
  })

export default mqttClient;
