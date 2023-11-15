import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { BuildingController } from './building.controller';
import { BuildingValidation } from './building.validation';

const router = express.Router();

router.get('/', BuildingController.getAll);
router.get('/:id', BuildingController.getSingle);
router.post(
  '/',
  validateRequest(BuildingValidation.create),
  BuildingController.create
);
router.patch(
  '/:id',
  validateRequest(BuildingValidation.update),
  BuildingController.update
);
router.delete('/:id', BuildingController.deleteFromDB);

export const BuildingRoute = router;
