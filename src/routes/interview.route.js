import express from 'express';
import authUser from '../middlewares/auth.middleware.js';

import interviewcontroller from '../controllers/interview.controller.js';

import upload from '../middlewares/file.middleware.js';




const interviewRouter = express.Router();

// aiinterview route

interviewRouter.post('/', authUser, upload, interviewcontroller.conductInterview);

export default interviewRouter;