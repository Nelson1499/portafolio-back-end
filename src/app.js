import express from "express";
import cors from "cors";
import morgan from "morgan";
import routerEmail from "./routes/email.routes";
import routerProjects from "./routes/projects.routes";
import routerUser from "./routes/users.routes";
import path from "path";
import { connectToDatabase } from "./config/database";
const PORT = process.env.PORT || 8000;

const app = express();
app.use(morgan("dev"));
app.set("port", PORT);

const corsOptions = {
  origin: 'https://nelson1499.github.io',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204 
};

app.use(cors(corsOptions));

app.use(express.json());
connectToDatabase();

app.use(express.static(path.join(__dirname, "public")));
app.use("/api", routerEmail);
app.use("/api", routerProjects);
app.use("/api", routerUser);

export default app;
