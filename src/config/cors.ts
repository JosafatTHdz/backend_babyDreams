import { CorsOptions} from 'cors'
export const corsConfig : CorsOptions = {
    origin: function(origin, callback) {
        const whiteList = []
        whiteList.push(process.env.FRONTEND_URL)
        whiteList.push(process.env.FRONTEND_URL_MOVIL)
        if (process.argv[2] === '--api') {
            whiteList.push(undefined)
        }
        if (whiteList.includes(origin)) { 
            callback(null, true)
        }else {
            callback(new Error('Error de CORS'))
        }
    }
}