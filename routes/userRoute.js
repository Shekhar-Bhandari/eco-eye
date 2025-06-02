import express from "express";
import { registerController, loginController } from "../controllers/userController.js";

const userRouter = express.Router();

// REGISTER
userRouter.post("/register", registerController);

// LOGIN 
userRouter.post("/login", loginController);

export default userRouter;
