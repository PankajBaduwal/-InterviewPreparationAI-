# ⚡ Interview AI — AI-Powered Interview Preparation Platform

> **Crack your next interview with confidence.** Interview AI is a full-stack web application that generates personalized interview preparation plans using OpenAI's GPT-4.1 — complete with role-specific questions, skill gap analysis, day-by-day study roadmaps, and AI-generated resumes.

---

## 🎯 What Does This Project Do?

Interview AI takes in a **job description** and the candidate's **resume or self-description**, then uses **Artificial Intelligence** to produce a comprehensive interview strategy tailored to the specific role. It's designed for job seekers, career switchers, and placement students who want a structured, data-driven approach to interview preparation.

### The platform generates:

| Feature | Description |
|---|---|
| 🧠 **Technical Questions** | Role-specific coding, system design, and domain questions with model answers |
| 💬 **Behavioral Questions** | STAR-method questions tailored to the candidate's experience |
| 📊 **Match Score** | A 0–100% compatibility score between the candidate and the job |
| 🔍 **Skill Gap Analysis** | Identifies missing skills with severity ratings (low / medium / high) |
| 🗓️ **Day-by-Day Roadmap** | A preparation plan distributed across the exact number of days the user has |
| 📄 **AI-Generated Resume** | A tailored, ATS-friendly resume downloadable as PDF |

### Customizable Preparation:

Users can configure:
- **Number of days** until the interview → adjusts plan intensity (crash course → comprehensive)
- **Number of technical questions** to practice (1–100)
- **Number of behavioral questions** to practice (1–50)

---

## 🖥️ Screenshots

### Login Page
> Beautiful two-panel auth design with aurora gradients and feature highlights

### Home Page
> Job description input, resume upload, and preparation settings in a glassmorphism card

### Interview Report
> 3-column layout with navigation, expandable Q&A cards, SVG score ring, and skill gap tags

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 19** | UI component library |
| **Vite** | Lightning-fast dev server and bundler |
| **React Router v7** | Client-side routing and navigation |
| **Axios** | HTTP client with cookie credentials |
| **SCSS / Sass** | Advanced styling with variables, nesting, mixins |
| **Context API** | Global state management (Auth + Interview) |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js** | JavaScript runtime |
| **Express.js** | REST API framework |
| **MongoDB + Mongoose** | NoSQL database with schema validation |
| **OpenAI GPT-4.1 Mini** | AI-powered report generation |
| **Zod** | Schema validation for AI structured outputs |
| **JSON Schema** | Enforces structured JSON responses from GPT |
| **Multer** | File upload handling (resume PDF/DOCX) |
| **pdf-parse** | Extract text from uploaded PDF resumes |
| **Mammoth** | Extract text from uploaded DOCX resumes |
| **Puppeteer** | Server-side PDF generation for AI resumes |
| **JWT + Cookies** | Secure, httpOnly cookie-based authentication |
| **bcrypt** | Password hashing |

### Design
| Aspect | Details |
|---|---|
| **Theme** | Premium dark mode with aurora gradient effects |
| **Typography** | Inter (Google Fonts) |
| **Effects** | Glassmorphism, backdrop blur, SVG animations |
| **Responsive** | Mobile-first, adapts from 320px to 1440px+ |

---

## 📁 Project Structure

```
InterviewPreparation/
├── Frontend/
│   └── src/
│       ├── features/
│       │   ├── auth/           # Login, Register, Auth Context
│       │   │   ├── pages/      # Login.jsx, Register.jsx
│       │   │   ├── hooks/      # useAuth.js
│       │   │   ├── services/   # auth.api.js
│       │   │   └── components/ # Protected.jsx (route guard)
│       │   └── interview/      # Interview feature
│       │       ├── pages/      # Home.jsx, Interview.jsx
│       │       ├── hooks/      # useInterview.js
│       │       ├── services/   # interview.api.js
│       │       └── style/      # home.scss, interview.scss
│       ├── App.jsx
│       ├── app.routes.jsx
│       └── style.scss
│
├── Backend/
│   └── src/
│       ├── controllers/        # auth.controller.js, interview.controller.js
│       ├── models/             # user.model.js, interviewReport.model.js, blacklist.model.js
│       ├── routes/             # auth.routes.js, interview.routes.js
│       ├── services/           # ai.service.js (OpenAI integration)
│       ├── middlewares/        # auth.middleware.js, file.middleware.js
│       └── config/             # database.js
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+
- **MongoDB** (Atlas or local)
- **OpenAI API Key** (GPT-4.1 Mini access)

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/interview-ai.git
cd interview-ai
```

### 2. Setup Backend
```bash
cd Backend
npm install
```

Create a `.env` file in `/Backend`:
```env
MONGO_URI=mongodb+srv://your_mongo_connection_string
OPENAI_API_KEY=sk-your-openai-api-key
JWT_SECRET=your_jwt_secret
```

Start the backend:
```bash
npm run dev
```

### 3. Setup Frontend
```bash
cd Frontend
npm install
npm run dev
```

### 4. Open in browser
```
http://localhost:5173
```

---

## 🔐 Authentication Flow

1. User registers with username, email, and password
2. Password is hashed with **bcrypt** before storing
3. On login, a **JWT token** is set as an `httpOnly` cookie
4. Protected routes check the cookie via middleware
5. On logout, the token is added to a **blacklist** collection

---

## 🤖 AI Integration Details

The application uses OpenAI's **Responses API** with **structured JSON output** to ensure the AI always returns data in the exact schema expected by the frontend.

### How it works:
1. User submits job description + resume/self-description + preparation settings
2. Backend extracts resume text from PDF/DOCX
3. A detailed prompt is constructed with:
   - Candidate profile
   - Exact question counts requested
   - Exact number of roadmap days
   - Intensity tier (crash course / focused / balanced / comprehensive)
4. GPT-4.1 Mini returns a structured JSON response matching the Zod schema
5. Response is validated, saved to MongoDB, and returned to the frontend

---

## 🎨 UI/UX Highlights

- **Aurora gradient backgrounds** — soft glowing orbs in indigo and pink
- **Glassmorphism cards** — translucent panels with backdrop blur
- **SVG animated score ring** — circular progress with glow effects
- **Expandable Q&A cards** — click to reveal intention & model answers
- **Timeline roadmap** — vertical line with glowing dots per day
- **Live intensity preview** — badge changes as you type the number of days
- **Two-panel auth pages** — branding panel + form panel split layout

---

## 📌 Use Cases

- 🎓 **Placement Students** — Prepare for campus recruitment with structured plans
- 💼 **Job Seekers** — Get role-specific interview questions for any job posting
- 🔄 **Career Switchers** — Identify skill gaps and build a targeted learning roadmap
- 📝 **Resume Optimization** — Generate ATS-friendly resumes tailored to specific roles
- 🏢 **Interview Coaches** — Use as a tool to create prep material for clients

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

- [OpenAI](https://openai.com) — GPT-4.1 Mini for intelligent report generation
- [MongoDB Atlas](https://www.mongodb.com/atlas) — Cloud database hosting
- [Vite](https://vitejs.dev) — Blazing fast frontend tooling
- [Inter Font](https://rsms.me/inter/) — Beautiful, clean typeface

---

<p align="center">
  Built with ❤️ using React, Node.js, and OpenAI
</p>
