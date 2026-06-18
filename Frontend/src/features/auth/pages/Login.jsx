import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import "../auth.form.scss"
import { useAuth } from '../hooks/useAuth'

const Login = () => {
    const { loading, handleLogin } = useAuth()
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        try {
            const result = await handleLogin({ email, password })
            if (result?.user) navigate('/')
        } catch (err) {
            setError(err?.response?.data?.message || "Invalid email or password. Please try again.")
        }
    }

    return (
        <div className='auth-page'>

            {/* ── Left Branding Panel ── */}
            <div className='auth-panel'>
                <div className='panel-brand'>
                    <div className='panel-brand__icon'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                        </svg>
                    </div>
                    <span className='panel-brand__name'>Interview AI</span>
                </div>

                <div className='panel-hero'>
                    <div className='panel-hero__badge'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                        AI-Powered Preparation
                    </div>
                    <h1>Ace Your Next<br /><span className='gradient-text'>Interview</span></h1>
                    <p>Get a personalized AI-generated interview strategy built around your unique profile and target role.</p>

                    <div className='panel-features'>
                        <div className='feature-item'>
                            <div className='feature-item__icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                            </div>
                            <div className='feature-item__text'>
                                <strong>Technical Questions</strong>
                                Role-specific coding &amp; system design prep
                            </div>
                        </div>
                        <div className='feature-item'>
                            <div className='feature-item__icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                            </div>
                            <div className='feature-item__text'>
                                <strong>Behavioral Questions</strong>
                                STAR-method answers tailored to you
                            </div>
                        </div>
                        <div className='feature-item'>
                            <div className='feature-item__icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
                            </div>
                            <div className='feature-item__text'>
                                <strong>Personalized Road Map</strong>
                                Day-by-day preparation schedule
                            </div>
                        </div>
                    </div>
                </div>

                <p className='panel-footer'>© 2025 Interview AI · All rights reserved</p>
            </div>

            {/* ── Right Form Panel ── */}
            <div className='auth-form-panel'>
                <div className='auth-box'>
                    <div className='auth-box__header'>
                        <h2>Welcome back 👋</h2>
                        <p>Don't have an account? <Link to="/register">Create one free</Link></p>
                    </div>

                    <form className='auth-box__form' onSubmit={handleSubmit}>
                        {error && <div className='auth-error'>{error}</div>}

                        <div className='input-group'>
                            <label htmlFor='email'>Email address</label>
                            <div className='input-wrap'>
                                <span className='input-icon'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                                </span>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className='input-group'>
                            <label htmlFor='password'>Password</label>
                            <div className='input-wrap'>
                                <span className='input-icon'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                                </span>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button type="submit" className='auth-submit-btn' disabled={loading}>
                            {loading ? 'Signing in…' : 'Sign In →'}
                        </button>
                    </form>

                    <div className='auth-box__footer'>
                        Don't have an account? <Link to="/register">Create one free</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login