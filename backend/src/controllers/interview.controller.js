import { invokeGenAI } from '../services/ai.service.js';
import { PDFParse } from 'pdf-parse';

async function conductInterview(req, res) {
	try {
		const resumeFile = req.files?.resume?.[0];
		let resume = req.body?.resume;

		if (resumeFile) {
			const parser = new PDFParse({ data: resumeFile.buffer });
			const parsedPdf = await parser.getText();
			await parser.destroy();
			resume = parsedPdf.text?.trim();
		}

		const { selfDescription, jobDescription } = req.body;

		if (!resume || !selfDescription || !jobDescription) {
			return res.status(400).json({
				message: 'resume (pdf or text), selfDescription, and jobDescription are required'
			});
		}

		req.body = {
			...req.body,
			resume,
			selfDescription,
			jobDescription
		};

		return invokeGenAI(req, res);
	} catch (error) {
		console.error('Error processing interview request:', error);
		return res.status(400).json({ message: 'Failed to read PDF resume file' });
	}
}

export default { conductInterview };