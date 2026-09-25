import { Router } from 'express';
import * as c from '../controllers/tripController.js';
import { searchWeb } from '../controllers/searchController.js';
import auth from '../middleware/auth.js';
const router=Router();router.use(auth);
router.get('/',c.listTrips);router.post('/',c.createTrip);router.put('/:id',c.updateTrip);router.delete('/:id',c.removeTrip);
router.get('/discover/hotels',c.hotels);router.get('/discover/activities',c.activities);router.get('/discover/weather',c.weather);router.get('/discover/search',searchWeb);router.post('/itinerary/generate',c.itinerary);router.patch('/:id/activities/:activityId/toggle',c.toggleActivity);router.post('/:id/activities',c.addActivity);router.delete('/:id/activities/:activityId',c.deleteActivity);
export default router;

