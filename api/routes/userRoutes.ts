import express from 'express';
import {loginRequired, profile, register, sign_in} from '../controllers/userController'; 

const router = express.Router();

router.post('/tasks', loginRequired, profile);
router.post('/auth/register', register);
router.post('/auth/sign_in', sign_in);

export default router;