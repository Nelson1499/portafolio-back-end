import { Router } from "express";
import { users } from "../controller/controllerUser";
import { authorize } from "../middleware/session";

const router = Router();
router.post("/auth-signup", users.signup);
router.post("/auth-login", users.login);
router.post("/auth-google", users.authGoogle);
router.get("/auth/:id", authorize, users.authGet);

export default router;
