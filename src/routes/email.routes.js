import { Router } from "express";
import Email from "../controller/controllerEmail";

const router = Router();
router.post("/send", Email);

export default router;