import { Router } from 'express';
import received from './received';
import expected from './expected';

const router = Router();

router.use('/', received);
router.use('/', expected);

export default router;
