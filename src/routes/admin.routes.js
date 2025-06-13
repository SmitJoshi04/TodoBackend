import { Router } from "express";
import { getAllUsers, blockUser, unblockUser } from "../controllers/admin.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/admin.middleware.js";

const router = Router();

router.use(verifyJWT, isAdmin);

router.get("/users", getAllUsers);
router.patch("/block/:userId", blockUser);
router.patch("/unblock/:userId", unblockUser);

export default router; 