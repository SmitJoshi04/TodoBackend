import express from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
} from "../controllers/task.controller.js";
const router = express.Router();

router.post("/", verifyJWT, upload.single("image"), createTask);
router.get("/", verifyJWT, getTasks);
router.put("/:id", verifyJWT, upload.single("image"), updateTask);
router.delete("/:id", verifyJWT, deleteTask);

export default router;
