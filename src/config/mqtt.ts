import mqtt from "mqtt";
import IoTData from "../models/IoT";

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

            const newData = new IoTData({
                temperature: data.temperature,
                humidity: data.humidity,
                obstaculo: data.obstaculo,
                balanceoActivo: data.balanceoActivo,
                carruselActivo: data.carruselActivo,
            });

            await newData.save();
            console.log("📡 Datos guardados desde MQTT:", data);
        }
    } catch (error) {
        console.error("❌ Error procesando datos MQTT:", error);
    }
});

export default mqttClient;
