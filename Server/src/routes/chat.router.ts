import express from "express";
import { createChat, sendMessage, getMessages, assignAdminToChat, closeChat } from "../controller/chat.controller";
import { authMiddleware } from '../middlewares/chat.middleware';

const router = express.Router();

router.post("/create"/* , authMiddleware('user') */, createChat);

router.post("/send"/* , authMiddleware('user') */, sendMessage);

router.get("/messages"/* , authMiddleware('user') */, getMessages);

router.post("/assign"/* , authMiddleware('admin') */, assignAdminToChat);

router.post("/close"/* , authMiddleware('admin') */, closeChat);

export default router;
