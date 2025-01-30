import express,{Application} from "express";
import path from "path";
import cors from "cors";
import morgan from "morgan"
import v1Router from "../routes";
import { AppDataSource } from "../config/database";

class Server {
    public app: Application;
    public PORT = process.env.PORT || 8080;

    constructor(){
        this.app = express();
        this.config();
        this.router();
        this.database();
    }
    
    database(): void {
        AppDataSource.initialize()
            .then(() => {
                console.log("Database connected");
            })
            .catch((error) => {
                console.error("Database connection error:", error);
                AppDataSource.destroy(); 
            });
    }
    

    config():void {
        this.app.use(morgan("dev"));
        this.app.use(
            cors({
                origin: "*",
                methods: ["GET","POST","PUT","DELETE"],
                allowedHeaders: ["Content-Type","Authorization"]
            })
        );
        this.app.use(express.json());
        this.app.use(express.static(path.join(__dirname,'../../public')));

        this.app.use('/assets', express.static(path.join(__dirname, '../../src/assets')));

   
    }

    router():void {
        this.app.use("/api/v1",v1Router);
    }

    start(): void {
        this.app.listen(this.PORT, () => {
            console.log(`Server running at http://localhost:${this.PORT}`);
        });
    }
}

export default Server;