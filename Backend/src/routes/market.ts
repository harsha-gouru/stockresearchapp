import { Router } from 'express';
const router = Router();
router.get('/indices', (req, res) => { res.json({ message: 'Market data endpoints - to be implemented' }); });
export default router;
