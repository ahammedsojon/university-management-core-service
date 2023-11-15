import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { RoomController } from './room.controller';
import { RoomValidation } from './room.validation';

const router = express.Router();

router.get('/', RoomController.getAll);
router.get('/:id', RoomController.getSingle);
router.post('/', validateRequest(RoomValidation.create), RoomController.create);
router.patch(
  '/:id',
  validateRequest(RoomValidation.update),
  RoomController.update
);
router.delete('/:id', RoomController.deleteFromDB);

export const RoomRoute = router;
