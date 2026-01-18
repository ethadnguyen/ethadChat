import express from 'express'
import { signup, signin, logout, refreshToken } from '../controllers/authController.js';

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/logout", logout);
router.post("/refresh", refreshToken);
export default router;

