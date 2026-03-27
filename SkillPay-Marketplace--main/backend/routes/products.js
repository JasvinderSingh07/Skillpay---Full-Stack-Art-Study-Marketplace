import express from 'express';
import { list, getOne, create, update, remove, catalogArt, catalogStudy } from '../controllers/productController.js';

const router = express.Router();

router.get('/', list);
router.get('/:id', getOne);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove);

router.get('/catalog/art', catalogArt);
router.get('/catalog/study', catalogStudy);

export default router;