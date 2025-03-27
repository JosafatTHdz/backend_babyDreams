import { CorsOptions } from "cors";

export const corsConfig: CorsOptions = {
    origin: function (origin, callback) {
        const whiteList = [];
        whiteList.push(process.env.FRONTEND_URL);
        whiteList.push(process.env.FRONTEND_URL_MOVIL);
        whiteList.push('http://192.168.61.184:4000')
        
        // ✅ Permitir solicitudes sin origin (por ejemplo, llamadas desde Postman o servidores)
        if (!origin || whiteList.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Bloqueado por CORS: " + origin));
        }
    },
    credentials: true,
};
