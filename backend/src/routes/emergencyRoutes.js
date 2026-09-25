import { Router } from 'express';
import { createEmergency } from '../controllers/emergencyController.js';
const router=Router();
// The visitor can request nearby places without an account; location is only sent after an explicit button press.
router.post('/',createEmergency);
export default router;
