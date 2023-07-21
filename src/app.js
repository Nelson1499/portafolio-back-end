// const express = require("express");
import express from "express";
// const cors = require("cors");
import cors from "cors";
import morgan from "morgan";
// const { MongoClient } = require("mongodb");
import routerEmail from "./routes/email.routes";
import routerProjects from "./routes/projects.routes";
import routerUser from "./routes/users.routes";
import path from "path";
const PORT = process.env.PORT || 8000;

const app = express();
app.use(morgan("dev"));
app.set("port", PORT);
app.use(cors());

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use("/api", routerEmail);
app.use("/api", routerProjects);
app.use("/api", routerUser);

export default app;
