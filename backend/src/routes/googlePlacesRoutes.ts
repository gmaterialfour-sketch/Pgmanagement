import { Router } from 'express';
import { getNearbyInfrastructure, getPlaceReviews, autocompleteAddress } from '../controllers/googlePlacesController';

const router = Router();

router.get('/places/:placeId/reviews', getPlaceReviews);
router.get('/nearby-infrastructure', getNearbyInfrastructure);
router.get('/autocomplete', autocompleteAddress);

export default router;
