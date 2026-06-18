const OpenAI = require("openai")
const { z } = require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema")
const puppeteer = require("puppeteer")

const openaiApiKey = process.env.OPENAI_API_KEY
if (!openaiApiKey) {
    throw new Error(
        "Missing env var OPENAI_API_KEY. Add your OpenAI API key to Backend/.env or the system environment before running npm run dev."
    )
}

const openai = new OpenAI({
    apiKey: openaiApiKey
})


const interviewReportSchema = z.object({
    matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job describe"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z.enum([ "low", "medium", "high" ]).describe("The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances")
    })).describe("List of skill gaps in the candidate's profile along with their severity"),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, starting from 1"),
        focus: z.string().describe("The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc."),
        tasks: z.array(z.string()).describe("List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.")
    })).describe("A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively"),
    title: z.string().describe("The title of the job for which the interview report is generated"),
})

async function generateInterviewReport({ resume, selfDescription, jobDescription, daysUntilInterview, numTechnicalQuestions, numBehavioralQuestions }) {

    // Determine preparation intensity label based on days
    const intensity =
        daysUntilInterview <= 3  ? "INTENSIVE CRASH COURSE (1–3 days): Focus only on the highest-priority topics. Prioritize speed and impact." :
        daysUntilInterview <= 7  ? "FOCUSED PREPARATION (4–7 days): Cover core technical topics, key behavioral scenarios, and one mock interview." :
        daysUntilInterview <= 14 ? "BALANCED PREPARATION (8–14 days): Cover all technical and behavioral areas with revision sessions." :
                                   "COMPREHENSIVE PREPARATION (15+ days): Cover all topics with multiple revision rounds, deep dives, and multiple mock interviews."

    const prompt = `You are an expert interview coach. Generate a highly personalized interview preparation report for the candidate below.

CANDIDATE PROFILE:
- Resume: ${resume || "Not provided"}
- Self Description: ${selfDescription || "Not provided"}
- Target Job Description: ${jobDescription}

PREPARATION PARAMETERS (YOU MUST FOLLOW THESE EXACTLY):
- Days until interview: ${daysUntilInterview}
- Preparation intensity: ${intensity}
- Number of technical questions to generate: EXACTLY ${numTechnicalQuestions} (no more, no less)
- Number of behavioral questions to generate: EXACTLY ${numBehavioralQuestions} (no more, no less)
- Number of days in preparation roadmap: EXACTLY ${daysUntilInterview} days (one entry per day, from Day 1 to Day ${daysUntilInterview})

INSTRUCTIONS:
1. TECHNICAL QUESTIONS: Generate EXACTLY ${numTechnicalQuestions} technical questions relevant to the job description and the candidate's background. Each question must have:
   - The question itself (specific, realistic, role-relevant)
   - The interviewer's intention behind it
   - A detailed model answer covering key points, approach and code/examples where relevant

2. BEHAVIORAL QUESTIONS: Generate EXACTLY ${numBehavioralQuestions} behavioral questions using STAR-method framing. Each must have:
   - The question itself
   - The interviewer's intention behind it
   - A model answer outline (Situation, Task, Action, Result structure)

3. SKILL GAPS: Identify specific gaps between the candidate's profile and the job requirements with severity ratings.

4. PREPARATION PLAN: Create a day-by-day plan with EXACTLY ${daysUntilInterview} entries (Day 1 through Day ${daysUntilInterview}).
   - Distribute topics logically: fundamentals first, then depth, then mock interviews and revision toward the end
   - Each day must have a clear focus theme and 3–6 concrete, actionable tasks
   - Intensity: ${intensity}
   - Final 1–2 days should always be: revision, mock interview, and interview-day tips

5. MATCH SCORE: Assign a realistic score (0–100) based on how well the candidate's current profile matches the job.

6. TITLE: Extract the job title from the job description.
`

    const response = await openai.responses.create({
        model: "gpt-4.1-mini",
        input: prompt,
        text: {
            format: {
                type: "json_schema",
                name: "interview_report",
                schema: zodToJsonSchema(interviewReportSchema)
            }
        }
    })

    const responseText = response.output_text || response.output?.map(outputItem => {
        if (typeof outputItem === "string") return outputItem
        if (Array.isArray(outputItem?.content)) {
            return outputItem.content.map(c => c.text || "").join("")
        }
        return ""
    }).join("")

    return JSON.parse(responseText)

}



async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" })

    const pdfBuffer = await page.pdf({
        format: "A4", margin: {
            top: "20mm",
            bottom: "20mm",
            left: "15mm",
            right: "15mm"
        }
    })

    await browser.close()

    return pdfBuffer
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {

    const resumePdfSchema = z.object({
        html: z.string().describe("The HTML content of the resume which can be converted to PDF using any library like puppeteer")
    })

    const prompt = `Generate resume for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}

                        the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
                        The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
                        The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
                        you can highlight the content using some colors or different font styles but the overall design should be simple and professional.
                        The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
                        The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description.
                    `

    const response = await openai.responses.create({
        model: "gpt-4.1-mini",
        input: prompt,
        text: {
            format: {
                type: "json_schema",
                name: "resume_pdf",
                schema: zodToJsonSchema(resumePdfSchema)
            }
        }
    })

    const responseText = response.output_text || response.output?.map(outputItem => {
        if (typeof outputItem === "string") return outputItem
        if (Array.isArray(outputItem?.content)) {
            return outputItem.content.map(c => c.text || "").join("")
        }
        return ""
    }).join("")

    const jsonContent = JSON.parse(responseText)

    const pdfBuffer = await generatePdfFromHtml(jsonContent.html)

    return pdfBuffer

}

module.exports = { generateInterviewReport, generateResumePdf }