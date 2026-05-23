import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/me', authMiddleware, AuthController.me);
router.post('/signup', AuthController.signup);
router.post('/signin', AuthController.signin);
router.post('/logout', AuthController.logout);
router.post('/refresh-token', AuthController.refresh);
router.post('/forgot-password', AuthController.forgotPassword);
router.post('/reset-password', AuthController.resetPassword);

export default router;
