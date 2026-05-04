import { Router } from 'express';
import { invokeGenAI, invokeResumePdf } from '../services/ai.service.js';
import upload from '../middlewares/file.middleware.js';

const aiRouter = Router();

aiRouter.post('/generate', invokeGenAI);
aiRouter.post('/resume-pdf', upload, invokeResumePdf);

export default aiRouter;
