import React, { useState, useRef } from 'react'
import "../style/home.scss"
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate } from 'react-router'
import { useAuth } from '../../auth/hooks/useAuth'

const Home = () => {
    const { loading, generateReport, reports } = useInterview()
    const { handleLogout } = useAuth()
    const [jobDescription, setJobDescription] = useState("")
    const [selfDescription, setSelfDescription] = useState("")
    const [daysUntilInterview, setDaysUntilInterview] = useState("")
    const [numTechnicalQuestions, setNumTechnicalQuestions] = useState("")
    const [numBehavioralQuestions, setNumBehavioralQuestions] = useState("")
    const [error, setError] = useState("")
    const [selectedResumeName, setSelectedResumeName] = useState("")
    const resumeInputRef = useRef()
    const navigate = useNavigate()

    const charCount = jobDescription.length

    const handleGenerateReport = async () => {
        setError("")
        const resumeFile = resumeInputRef.current?.files?.[0]

        if (!jobDescription.trim()) {
            setError("Please paste the job description before generating a report.")
            return
        }
        if (!resumeFile && !selfDescription.trim()) {
            setError("Please upload a resume or enter a self description.")
            return
        }
        const days = parseInt(daysUntilInterview)
        const tech = parseInt(numTechnicalQuestions)
        const behav = parseInt(numBehavioralQuestions)

        if (!days || days < 1) {
            setError("Please enter a valid number of days until your interview (minimum 1).")
            return
        }
        if (!tech || tech < 1 || tech > 100) {
            setError("Please enter a valid number of technical questions (1–100).")
            return
        }
        if (!behav || behav < 1 || behav > 50) {
            setError("Please enter a valid number of behavioral questions (1–50).")
            return
        }

        try {
            const data = await generateReport({
                jobDescription,
                selfDescription,
                resumeFile,
                daysUntilInterview: days,
                numTechnicalQuestions: tech,
                numBehavioralQuestions: behav
            })
            if (data?._id) {
                navigate(`/interview/${data._id}`)
            } else {
                setError("Unable to generate interview report. Please try again.")
            }
        } catch (err) {
            console.error(err)
            setError(err?.response?.data?.message || err.message || "An error occurred while generating the report.")
        }
    }

    // Determine intensity label for live preview
    const days = parseInt(daysUntilInterview)
    const intensityInfo =
        !days ? null :
        days <= 3  ? { label: "Intensive Crash Course", color: "#f43f5e", icon: "🔥", desc: "High-speed, high-priority prep" } :
        days <= 7  ? { label: "Focused Preparation",    color: "#f59e0b", icon: "⚡", desc: "Core topics + 1 mock interview" } :
        days <= 14 ? { label: "Balanced Preparation",   color: "#6366f1", icon: "📚", desc: "Full coverage with revision sessions" } :
                     { label: "Comprehensive Plan",      color: "#10b981", icon: "🎯", desc: "Deep dives, multiple mock rounds" }

    if (loading) {
        return (
            <main className='loading-screen'>
                <h1>Generating your personalized plan…</h1>
            </main>
        )
    }

    return (
        <div className='home-page'>

            {/* ── Top Nav ── */}
            <nav className='home-nav'>
                <div className='home-nav__brand'>
                    <div className='brand-icon'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                    </div>
                    <span>Interview AI</span>
                </div>
                <button
                    onClick={async () => { await handleLogout(); navigate('/login') }}
                    style={{
                        background: 'transparent', border: '1px solid rgba(255,255,255,0.08)',
                        color: '#94a3b8', padding: '0.45rem 0.875rem', borderRadius: '0.5rem',
                        fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                        display: 'flex', alignItems: 'center', gap: '0.4rem', transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(244,63,94,0.4)'; e.currentTarget.style.color = '#fda4af'; e.currentTarget.style.background = 'rgba(244,63,94,0.06)' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.background = 'transparent' }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                    Sign Out
                </button>
            </nav>

            {/* ── Header ── */}
            <header className='page-header'>
                <div className='eyebrow'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                    AI-Powered Interview Prep
                </div>
                <h1>Create Your Custom<br /><span className='highlight'>Interview Strategy</span></h1>
                <p>Tell us your timeline and goals — our AI builds a personalized plan with exactly the right questions and roadmap for you.</p>
            </header>

            {/* ── Main Card ── */}
            <div className='interview-card'>
                <div className='interview-card__body'>

                    {/* ── Left Panel – Job Description ── */}
                    <div className='panel panel--left'>
                        <div className='panel__header'>
                            <span className='panel__icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                            </span>
                            <h2>Target Job Description</h2>
                            <span className='badge badge--required'>Required</span>
                        </div>
                        <textarea
                            onChange={(e) => setJobDescription(e.target.value)}
                            className='panel__textarea'
                            placeholder={`Paste the full job description here…\ne.g. "Senior Frontend Engineer at Google — React, TypeScript, system design…"`}
                            maxLength={5000}
                        />
                        <div className='char-counter'>{charCount} / 5000</div>
                    </div>

                    <div className='panel-divider' />

                    {/* ── Right Panel – Profile + Settings ── */}
                    <div className='panel panel--right'>
                        <div className='panel__header'>
                            <span className='panel__icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                            </span>
                            <h2>Your Profile</h2>
                        </div>

                        {/* Resume Upload */}
                        <div className='upload-section'>
                            <label className='section-label'>
                                Upload Resume
                                <span className='badge badge--best'>Best Results</span>
                            </label>
                            <label className='dropzone' htmlFor='resume'>
                                <span className='dropzone__icon'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>
                                </span>
                                <p className='dropzone__title'>Click to upload or drag &amp; drop</p>
                                <p className='dropzone__subtitle'>PDF or DOCX · Max 3MB</p>
                                <input
                                    ref={resumeInputRef}
                                    hidden type='file' id='resume' name='resume' accept='.pdf,.docx'
                                    onChange={(e) => setSelectedResumeName(e.target.files?.[0]?.name || "")}
                                />
                            </label>
                            {selectedResumeName && <p className='selected-file'>{selectedResumeName}</p>}
                        </div>

                        <div className='or-divider'><span>or</span></div>

                        {/* Self Description */}
                        <div className='self-description'>
                            <label className='section-label' htmlFor='selfDescription'>Quick Self-Description</label>
                            <textarea
                                onChange={(e) => setSelfDescription(e.target.value)}
                                id='selfDescription' name='selfDescription'
                                className='panel__textarea panel__textarea--short'
                                placeholder="Briefly describe your experience, key skills, and years of experience…"
                            />
                        </div>
                    </div>
                </div>

                {/* ── Prep Settings Row ── */}
                <div className='prep-settings'>
                    <div className='prep-settings__header'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07M8.46 8.46a5 5 0 0 0 0 7.07"/></svg>
                        <span>Preparation Settings</span>
                        <span className='prep-settings__required-note'>All fields required</span>
                    </div>

                    <div className='prep-settings__grid'>
                        {/* Days */}
                        <div className='prep-input-group'>
                            <label htmlFor='daysUntilInterview'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                                Days Until Interview
                            </label>
                            <input
                                type='number' id='daysUntilInterview' name='daysUntilInterview'
                                placeholder='e.g. 7'
                                min='1' max='90'
                                value={daysUntilInterview}
                                onChange={e => setDaysUntilInterview(e.target.value)}
                            />
                            {intensityInfo && (
                                <div className='intensity-badge' style={{ borderColor: intensityInfo.color + '44', color: intensityInfo.color, background: intensityInfo.color + '14' }}>
                                    <span>{intensityInfo.icon}</span>
                                    <div>
                                        <strong>{intensityInfo.label}</strong>
                                        <span>{intensityInfo.desc}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Tech Questions */}
                        <div className='prep-input-group'>
                            <label htmlFor='numTechnicalQuestions'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                                Technical Questions
                            </label>
                            <input
                                type='number' id='numTechnicalQuestions' name='numTechnicalQuestions'
                                placeholder='e.g. 10'
                                min='1' max='100'
                                value={numTechnicalQuestions}
                                onChange={e => setNumTechnicalQuestions(e.target.value)}
                            />
                            <p className='prep-input-group__hint'>How many technical questions to generate (1–100)</p>
                        </div>

                        {/* Behavioral Questions */}
                        <div className='prep-input-group'>
                            <label htmlFor='numBehavioralQuestions'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                                Behavioral Questions
                            </label>
                            <input
                                type='number' id='numBehavioralQuestions' name='numBehavioralQuestions'
                                placeholder='e.g. 5'
                                min='1' max='50'
                                value={numBehavioralQuestions}
                                onChange={e => setNumBehavioralQuestions(e.target.value)}
                            />
                            <p className='prep-input-group__hint'>How many behavioral questions to generate (1–50)</p>
                        </div>
                    </div>
                </div>

                {/* ── Card Footer ── */}
                <div className='interview-card__footer'>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <span className='footer-info'>AI-Powered · Approx 30–60 seconds</span>
                        {error && <div className='form-error'>{error}</div>}
                    </div>
                    <button onClick={handleGenerateReport} className='generate-btn' disabled={loading}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                        Generate My Interview Plan
                    </button>
                </div>
            </div>

            {/* ── Recent Reports ── */}
            {reports.length > 0 && (
                <section className='recent-reports'>
                    <h2>My Recent Interview Plans</h2>
                    <ul className='reports-list'>
                        {reports.map(report => (
                            <li
                                key={report._id}
                                className='report-item'
                                onClick={() => navigate(`/interview/${report._id}`)}
                            >
                                <h3>{report.title || 'Untitled Position'}</h3>
                                <p className='report-meta'>
                                    {new Date(report.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    {report.daysUntilInterview && ` · ${report.daysUntilInterview}-day plan`}
                                </p>
                                <p className={`match-score ${report.matchScore >= 80 ? 'score--high' : report.matchScore >= 60 ? 'score--mid' : 'score--low'}`}>
                                    Match Score: {report.matchScore}%
                                </p>
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            <footer className='page-footer'>
                <a href='#'>Privacy Policy</a>
                <a href='#'>Terms of Service</a>
                <a href='#'>Help Center</a>
            </footer>
        </div>
    )
}

export default Home