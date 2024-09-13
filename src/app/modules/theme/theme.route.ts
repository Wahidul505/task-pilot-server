import express from 'express';
import { ThemeController } from './theme.controller';

const router = express.Router();

router.post('/', ThemeController.insertIntoDB);
router.get('/', ThemeController.getAllFromDB);
router.get('/:id', ThemeController.getSingleData);
router.patch('/:id', ThemeController.updateSingleData);
router.delete('/:id', ThemeController.deleteSingleData);

export const ThemeRoutes = router;
