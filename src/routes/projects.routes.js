import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuid } from "uuid";
import { Projects } from "../controller/controllerProjects";
import { authorizeAdmin } from "../middleware/middleware";
import { authorize } from "../middleware/session";

// Configurar multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const urlImage = "../public/image/";
    const pathUrl = path.join(__dirname, urlImage);
    fs.mkdirSync(pathUrl, { recursive: true });
    cb(null, pathUrl);
  },
  filename: (req, file, cb) => {
    cb(null, `${uuid()}_${file.originalname}`);
  },
});
const upload = multer({ storage });

const router = Router();
router.post(
  "/project",
  authorize,
  authorizeAdmin,
  upload.array("images"),
  Projects.uploadProject
);
router.get("/project", Projects.getProjects);
router.put("/project", authorizeAdmin, Projects.editProject);
router.delete("/project", authorizeAdmin, Projects.deleteProject);

export default router;
