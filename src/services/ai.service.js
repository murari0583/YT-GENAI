import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { PDFParse } from 'pdf-parse';

let ai = null;

function getAiClient() {
    if (ai) {
        return ai;
    }

    const apiKey = process.env.GOOGLE_GENAI_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error("GOOGLE_GENAI_API_KEY or GEMINI_API_KEY is not set");
    }

    ai = new GoogleGenAI({ apiKey });
    return ai;
}

const technicalQuestionSchema = z.object({
    question: z.string(),
    intention: z.string(),
    answer: z.string()
});

const behavioralQuestionSchema = z.object({
    question: z.string(),
    intention: z.string(),
    answer: z.string()
});

const skillsGapSchema = z.object({
    skill: z.string(),
    severity: z.enum(["low", "medium", "high"]),
    type: z.string()
});

const interviewMetadataSchema = z.object({
    candidateName: z.string(),
    positionApplied: z.string(),
    dateOfInterview: z.string(),
    interviewerName: z.string()
});

const recommendationSchema = z.object({
    overallRecommendation: z.string(),
    recommendationStrength: z.enum(["low", "medium", "high"]),
    strengths: z.array(z.string())
});

const roadmapItemSchema = z.object({
    week: z.string(),
    focus: z.string(),
    tasks: z.array(z.string()),
    expectedOutcome: z.string()
});

const responseSchema = z.object({
    interviewMetadata: interviewMetadataSchema,
    matchScore: z.number().min(0).max(100),
    technicalQuestions: z.array(technicalQuestionSchema),
    behavioralQuestions: z.array(behavioralQuestionSchema),
    skillsGap: z.array(skillsGapSchema),
    recommendation: recommendationSchema,
    weeklyRoadmap: z.array(roadmapItemSchema),
    preparationTips: z.string(),
    overallFeedback: z.string()
});

function extractJsonText(rawText) {
    const text = String(rawText || "").trim();
    if (!text) {
        throw new Error("Model returned empty response text");
    }

    // Handle models that wrap JSON inside markdown fences.
    const fencedMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    return fencedMatch ? fencedMatch[1].trim() : text;
}

function escapePdfText(value) {
    return String(value || '')
        .replace(/\\/g, '\\\\')
        .replace(/\(/g, '\\(')
        .replace(/\)/g, '\\)')
        .replace(/\r?\n/g, ' ')
        .replace(/[^\x20-\x7E]/g, '');
}

function createSimplePdfBuffer(title, bodyText) {
    const lines = String(bodyText || '')
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line.length > 0)
        .slice(0, 46);

    const contentLines = [
        'BT',
        '/F1 16 Tf',
        `50 770 Td (${escapePdfText(title)}) Tj`,
        '/F1 11 Tf',
        '0 -24 Td'
    ];

    for (const line of lines) {
        contentLines.push(`(${escapePdfText(line)}) Tj`);
        contentLines.push('0 -14 Td');
    }

    contentLines.push('ET');
    const streamContent = contentLines.join('\n');

    const objects = [];
    const addObject = (content) => {
        objects.push(content);
        return objects.length;
    };

    addObject('<< /Type /Catalog /Pages 2 0 R >>');
    addObject('<< /Type /Pages /Kids [3 0 R] /Count 1 >>');
    addObject('<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>');
    addObject(`<< /Length ${Buffer.byteLength(streamContent, 'utf8')} >>\nstream\n${streamContent}\nendstream`);
    addObject('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');

    let pdf = '%PDF-1.4\n';
    const offsets = [0];

    objects.forEach((obj, idx) => {
        offsets.push(Buffer.byteLength(pdf, 'utf8'));
        pdf += `${idx + 1} 0 obj\n${obj}\nendobj\n`;
    });

    const xrefOffset = Buffer.byteLength(pdf, 'utf8');
    pdf += `xref\n0 ${objects.length + 1}\n`;
    pdf += '0000000000 65535 f \n';

    for (let i = 1; i <= objects.length; i++) {
        pdf += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
    }

    pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
    return Buffer.from(pdf, 'utf8');
}

async function generateInterviewQuestions(resume, selfDescription, jobDescription) {
    const jsonSchema = {
        type: "object",
        properties: {
            interviewMetadata: {
                type: "object",
                properties: {
                    candidateName: { type: "string" },
                    positionApplied: { type: "string" },
                    dateOfInterview: { type: "string" },
                    interviewerName: { type: "string" }
                },
                required: ["candidateName", "positionApplied", "dateOfInterview", "interviewerName"]
            },
            matchScore: { type: "number" },
            technicalQuestions: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        question: { type: "string" },
                        intention: { type: "string" },
                        answer: { type: "string" }
                    },
                    required: ["question", "intention", "answer"]
                }
            },
            behavioralQuestions: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        question: { type: "string" },
                        intention: { type: "string" },
                        answer: { type: "string" }
                    },
                    required: ["question", "intention", "answer"]
                }
            },
            skillsGap: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        skill: { type: "string" },
                        severity: { type: "string", enum: ["low", "medium", "high"] },
                        type: { type: "string" }
                    },
                    required: ["skill", "severity", "type"]
                }
            },
            recommendation: {
                type: "object",
                properties: {
                    overallRecommendation: { type: "string" },
                    recommendationStrength: { type: "string", enum: ["low", "medium", "high"] },
                    strengths: {
                        type: "array",
                        items: { type: "string" }
                    }
                },
                required: ["overallRecommendation", "recommendationStrength", "strengths"]
            },
            weeklyRoadmap: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        week: { type: "string" },
                        focus: { type: "string" },
                        tasks: {
                            type: "array",
                            items: { type: "string" }
                        },
                        expectedOutcome: { type: "string" }
                    },
                    required: ["week", "focus", "tasks", "expectedOutcome"]
                }
            },
            preparationTips: { type: "string" },
            overallFeedback: { type: "string" }
        },
        required: [
            "interviewMetadata",
            "matchScore",
            "technicalQuestions",
            "behavioralQuestions",
            "skillsGap",
            "recommendation",
            "weeklyRoadmap",
            "preparationTips",
            "overallFeedback"
        ]
    };

    const prompt = `You are an expert interviewer. Return ONLY valid JSON for this interview report.
Keep model answers concise (max 2 short lines each) so the output remains compact and valid.
Always include:
- interviewMetadata: candidateName, positionApplied, dateOfInterview, interviewerName
- recommendation: overallRecommendation, recommendationStrength (low|medium|high), strengths (array)
- weeklyRoadmap: 4 items (Week 1 to Week 4). Each item must include week, focus, tasks (2-4 bullets), expectedOutcome.
If any metadata value is unavailable, set it to "Not provided".

Candidate resume:
${resume}

Candidate self-description:
${selfDescription}

Job description:
${jobDescription}`;

    const response = await getAiClient().models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            maxOutputTokens: 4096,
            responseMimeType: "application/json",
            responseJsonSchema: jsonSchema
        }
    });

    const jsonText = extractJsonText(response.text);

    let parsed;
    try {
        parsed = JSON.parse(jsonText);
    } catch {
        throw new Error(`Model returned non-JSON output: ${jsonText.slice(0, 300)}`);
    }

    return responseSchema.parse(parsed);
}

async function generateTailoredResumeText(resume, selfDescription, jobDescription) {
    const prompt = `You are an expert resume writer.
Create an ATS-friendly one-page resume tailored to the given job.

ATS rules to follow strictly:
- Use simple plain text only. No tables, no columns, no icons, no emojis, no decorative characters.
- Use standard section headings and concise bullet points starting with "- ".
- Mirror important job-description keywords naturally (skills, tools, role terms).
- Prioritize measurable impact in bullets (numbers, percentages, scale where possible).
- Keep tense consistent and grammar clean.
- Do not invent fake companies, dates, or certifications. If unknown, omit.

Return plain text only (no markdown, no code block), with these section headings in this order:
NAME
CONTACT
TARGET ROLE
PROFESSIONAL SUMMARY
CORE SKILLS
EXPERIENCE HIGHLIGHTS
PROJECT HIGHLIGHTS
EDUCATION
CERTIFICATIONS (optional)

For CORE SKILLS, provide a comma-separated keyword list optimized for ATS scanning.
For EXPERIENCE HIGHLIGHTS and PROJECT HIGHLIGHTS, provide 3-5 bullets each.

Keep bullet points concise and achievement-focused.

Original resume text:
${resume}

Candidate self-description:
${selfDescription}

Job description:
${jobDescription}`;

    const response = await getAiClient().models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            maxOutputTokens: 2048,
            responseMimeType: 'text/plain'
        }
    });

    const text = String(response.text || '').trim();
    if (!text) {
        throw new Error('Model returned empty resume content');
    }

    return text;
}

async function invokeGenAI(req, res) {
    const { resume, selfDescription, jobDescription } = req.body;

    if (!resume || !selfDescription || !jobDescription) {
        return res.status(400).json({
            message: "resume, selfDescription, and jobDescription are required"
        });
    }

    try {
        const report = await generateInterviewQuestions(resume, selfDescription, jobDescription);
        return res.status(200).json({
            message: "Interview report generated successfully",
            data: report
        });
    } catch (error) {
        console.error("Error generating interview report:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

async function invokeResumePdf(req, res) {
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

        const tailoredResumeText = await generateTailoredResumeText(resume, selfDescription, jobDescription);
        const pdfBuffer = createSimplePdfBuffer('Tailored Resume', tailoredResumeText);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="tailored-resume.pdf"');
        return res.status(200).send(pdfBuffer);
    } catch (error) {
        console.error('Error generating resume PDF:', error);
        return res.status(500).json({ message: 'Failed to generate resume PDF' });
    }
}

export { generateInterviewQuestions, invokeGenAI, invokeResumePdf };