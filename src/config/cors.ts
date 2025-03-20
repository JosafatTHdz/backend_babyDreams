import { CorsOptions } from "cors";

export const corsConfig: CorsOptions = {
    origin: function (origin, callback) {
        const whiteList = [];
        whiteList.push(process.env.FRONTEND_URL);
        whiteList.push(process.env.FRONTEND_URL_MOVIL);
        
        // ✅ Permitir solicitudes sin origin (por ejemplo, llamadas desde Postman o servidores)
        if (!origin || whiteList.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("❌ Bloqueado por CORS: " + origin));
        }
    },
    credentials: true, // ✅ Asegura que las cookies y autenticación funcionen
};
