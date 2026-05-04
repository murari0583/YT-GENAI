
import mongoose from "mongoose";

const interviewReportSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    jobDescription: {
        type: String,
        required: true
    },
    resumeText: {
        type: String,
        required: true
    },
    selfDescription: {
        type: String,
        required: true
    },
      matchScore:{
        type: Number,
        min: 0,
        max: 100

    },
    technicalQuestions: [
        {
            question: { type: String },
            intention: { type: String },
            answer: { type: String }
        }
    ],
    behavioralQuestions: [
        {
            question: { type: String },
            intention: { type: String },
            answer: { type: String }
        }
    ],
    skillsGap: [
        {
            skill: { type: String },
            severity: { type: String, enum: ["low", "medium", "high"] },
            type: { type: String }
        }
    ],
    preparationTips: {
        type: String
    },
    overallFeedback: {
        type: String
    }
}, { timestamps: true });

const interviewReportModel = mongoose.model("InterviewReport", interviewReportSchema);

export default interviewReportModel;