import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import connectDb from "./src/db/mongodb";
import errorHandling from "./src/error/asyncError";
import router from './src/router/index.route'
import morgan from "morgan";
import cors from "cors";
import './src/cron/markAbsent';
import './src/cron/payroll';


dotenv.config();
connectDb();

const PORT = process.env.PORT || 9000;
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));


// Routes & Error Handling
app.use("/", router);
app.use(errorHandling as (err: any, req: Request, res: Response, next: NextFunction) => void);

app.listen(PORT, () =>{
      console.log(`server is running on  ${PORT}`)
})