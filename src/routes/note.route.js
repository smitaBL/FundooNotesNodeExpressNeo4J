import express from 'express';
import * as noteController from '../controllers/note.controller'
import { userAuth } from '../middlewares/auth.middleware';


const router = express.Router();


//route to create a new user
router.post('', userAuth, noteController.createNote);




export default router;
