import express from 'express';
const router = express.Router();

import userRoute from './user.route';
import noteROute from './note.route'
/**
 * Function contains Application routes
 *
 * @returns router
 */
const routes = () => {
  router.get('/', (req, res) => {
    res.json('Welcome');
  });
  router.use('/users', userRoute);
  router.use('/note', noteROute);

  return router;
};

export default routes;
