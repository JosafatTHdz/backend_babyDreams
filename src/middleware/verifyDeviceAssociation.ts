import { Request, Response, NextFunction } from 'express';

export const verifyDeviceAssociation = (req: Request, res: Response, next: NextFunction) => {
  // Se asume que ya se ha autenticado al usuario y se almacena en req.user
  if (!req.user || !req.user.deviceId) {
    res.status(403).json({ error: "No tienes un dispositivo asociado. Vincula tu ESP32 para acceder al panel IoT." });
    return 
  }
  next();
};
