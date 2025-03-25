import { Request, Response } from "express";
import IoTData from "../models/IoT"
import mqttClient from "../config/mqtt";

// 🔹 Guardar datos enviados por MQTT
export const saveIoTData = async (req: Request, res: Response) => {
    try {
        const { temperature, humidity, obstaculo, balanceoActivo, carruselActivo } = req.body;

        if (temperature === undefined || humidity === undefined) {
            res.status(400).json({ error: "Los datos de temperatura y humedad son requeridos." });
            return 
        }

        const newData = new IoTData({
            temperature,
            humidity,
            obstaculo,
            balanceoActivo,
            carruselActivo
        });

        await newData.save();
        res.status(201).json({ message: "Datos guardados correctamente." });
    } catch (error) {
        res.status(500).json({ error: "Error al guardar datos en la base de datos." });
    }
};

// 🔹 Obtener datos en tiempo real para un dispositivo específico
export const getRealtimeData = async (req: Request, res: Response) => {
    const { deviceId } = req.params;
  
    try {
      const latestData = await IoTData.findOne({ deviceId }).sort({ timestamp: -1 });
  
      if (!latestData) {
        res.status(404).json({ error: "No hay datos disponibles para este dispositivo." });
        return
      }
  
      res.json(latestData);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener datos en tiempo real." });
    }
  };

// 🔹 Obtener el historial de datos
export const getHistoryData = async (req: Request, res: Response) => {
    try {
        const history = await IoTData.find().sort({ timestamp: -1 }).limit(50); // Últimos 50 datos
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener historial de datos." });
    }
};

// 🔹 Handler para balanceo
export const controlBalanceo = (req: Request, res: Response) => {
    const { estado, macAddress: mac } = req.body; // true/false
    console.log("estado", estado, "mac", mac)
    const comando = estado ? "on" : "off";

    const topic = `esp32/${mac}/control/balanceo`;

    mqttClient.publish("esp32/control/balanceo", comando, (err) => {
        if (err) {
            console.error("❌ Error publicando a MQTT:", err);
            return res.status(500).json({ error: "Error al publicar en MQTT" });
        }
        console.log(`📡 balanceo -> ${comando}`);
        res.json({ success: true, message: `Balanceo ${comando}` });
    });
};

// 🔹 Handler para carrusel
export const controlCarrusel = (req: Request, res: Response) => {
    const { estado } = req.body; // true/false
    console.log("estado", estado)
    const comando = estado ? "on" : "off";

    mqttClient.publish("esp32/control/carrusel", comando, (err) => {
        if (err) {
            console.error("❌ Error publicando a MQTT:", err);
            return res.status(500).json({ error: "Error al publicar en MQTT" });
        }
        console.log(`📡 carrusel -> ${comando}`);
        res.json({ success: true, message: `Carrusel ${comando}` });
    });
};