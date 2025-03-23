import { Request, Response } from "express";
import Device, { IDevice } from "../models/Device";

declare global {
    namespace Express {
        interface Request {
            device?: IDevice
        }
    }
}

export const requireDevice = async (req: Request, res: Response, next: Function) => {
    const userId = req.user.id
    const device = await Device.findOne({ userId })
    if (!device) {
        res.status(403).json({ error: "Debes registrar tu dispositivo primero." })
        return
    }
    // Opcional: adjunta la MAC al request para reutilizarla
    req.device = device;
    next();
};
