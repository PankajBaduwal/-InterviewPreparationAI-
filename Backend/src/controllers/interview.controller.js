const path = require("path")
const pdfParse = require("pdf-parse")
const mammoth = require("mammoth")
const { generateInterviewReport, generateResumePdf } = require("../services/ai.service")
const interviewReportModel = require("../models/interviewReport.model")




/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 */
async function generateInterViewReportController(req, res) {
    const { selfDescription, jobDescription, daysUntilInterview, numTechnicalQuestions, numBehavioralQuestions } = req.body

    if (!jobDescription || (!selfDescription && !req.file)) {
        return res.status(400).json({
            message: "Job description is required, and either a resume file or a self description must be provided."
        })
    }

    const days = parseInt(daysUntilInterview)
    const techCount = parseInt(numTechnicalQuestions)
    const behavCount = parseInt(numBehavioralQuestions)

    if (!days || days < 1) {
        return res.status(400).json({ message: "Please provide a valid number of days until your interview (minimum 1)." })
    }
    if (!techCount || techCount < 1 || techCount > 100) {
        return res.status(400).json({ message: "Please provide a valid number of technical questions (1–100)." })
    }
    if (!behavCount || behavCount < 1 || behavCount > 50) {
        return res.status(400).json({ message: "Please provide a valid number of behavioral questions (1–50)." })
    }

    let resumeText = ""
    if (req.file) {
        const extension = path.extname(req.file.originalname || "").toLowerCase()

        if (extension === ".pdf") {
            const parsed = await pdfParse(req.file.buffer)
            resumeText = parsed.text || ""
        } else if (extension === ".docx") {
            const parsed = await mammoth.extractRawText({ buffer: req.file.buffer })
            resumeText = parsed.value || ""
        } else {
            return res.status(400).json({
                message: "Unsupported resume file format. Please upload a PDF or DOCX file."
            })
        }
    }

    const interViewReportByAi = await generateInterviewReport({
        resume: resumeText,
        selfDescription,
        jobDescription,
        daysUntilInterview: days,
        numTechnicalQuestions: techCount,
        numBehavioralQuestions: behavCount
    })

    const interviewReport = await interviewReportModel.create({
        user: req.user.id,
        resume: resumeText,
        selfDescription,
        jobDescription,
        daysUntilInterview: days,
        numTechnicalQuestions: techCount,
        numBehavioralQuestions: behavCount,
        ...interViewReportByAi
    })

    res.status(201).json({
        message: "Interview report generated successfully.",
        interviewReport
    })

}

/**
 * @description Controller to get interview report by interviewId.
 */
async function getInterviewReportByIdController(req, res) {

    const { interviewId } = req.params

    const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    res.status(200).json({
        message: "Interview report fetched successfully.",
        interviewReport
    })
}


/** 
 * @description Controller to get all interview reports of logged in user.
 */
async function getAllInterviewReportsController(req, res) {
    const interviewReports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

    res.status(200).json({
        message: "Interview reports fetched successfully.",
        interviewReports
    })
}


/**
 * @description Controller to generate resume PDF based on user self description, resume and job description.
 */
async function generateResumePdfController(req, res) {
    const { interviewReportId } = req.params

    const interviewReport = await interviewReportModel.findById(interviewReportId)

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    const { resume, jobDescription, selfDescription } = interviewReport

    const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription })

    res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
    })

    res.send(pdfBuffer)
}

module.exports = { generateInterViewReportController, getInterviewReportByIdController, getAllInterviewReportsController, generateResumePdfController }