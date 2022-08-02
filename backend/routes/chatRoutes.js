import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { accessChat, fetchChats, createGroupchat, renameGroup, addToGroup, removeFromGroup } from "../controllers/chatControllers.js";

const router = express.Router();

router.route('/').post(protect, accessChat)
    .get(protect, fetchChats);
router.route('/group').post(protect, createGroupchat);
router.route('/rename').put(protect, renameGroup);
router.route('/groupadd').put(protect, addToGroup);
router.route('/groupremove').put(protect, removeFromGroup);

export default router;