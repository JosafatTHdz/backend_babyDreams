// POST /api/devices/register
import { Request, Response } from "express";
import Device from "../models/Device"; // modelo nuevo

export const getMyDevices = async (req: Request, res: Response) => {
    const userId = req.user.id;
    try {
        const devices = await Device.find({ userId });
        res.json(devices);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener dispositivos del usuario." });
    }
};

export const registerDevice = async (req: Request, res: Response) => {
    const { macAddress, name } = req.body;
    const userId = req.user.id; // necesitas tener middleware de auth para obtener esto

    try {
        const existing = await Device.findOne({ macAddress });
        if (existing) {
            res.status(400).json({ message: "MAC ya registrada por otro usuario." });
            return
        }

        const newDevice = new Device({
            macAddress,
            name,
            userId
        });

        await newDevice.save();
        res.status(201).json({ message: "Dispositivo registrado correctamente." });
    } catch (err) {
        res.status(500).json({ message: "Error registrando dispositivo." });
    }
};
