import { Router } from 'express';

const router = Router();

router.get('/search', (req, res) => {
  res.json({ message: 'Stock search - to be implemented' });
});

router.get('/:symbol', (req, res) => {
  res.json({ message: 'Get stock details - to be implemented' });
});

export default router;
