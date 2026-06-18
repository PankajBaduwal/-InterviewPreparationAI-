import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import "../auth.form.scss"

const Register = () => {
    const navigate = useNavigate()
    const { loading, handleRegister } = useAuth()
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        try {
            const result = await handleRegister({ username, email, password })
            if (result?.user) navigate("/")
        } catch (err) {
            setError(err?.response?.data?.message || "Registration failed. Please try again.")
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
                        Free to Get Started
                    </div>
                    <h1>Land Your<br /><span className='gradient-text'>Dream Job</span></h1>
                    <p>Create your free account and get an AI-powered interview strategy built around your resume and target role in seconds.</p>

                    <div className='panel-features'>
                        <div className='feature-item'>
                            <div className='feature-item__icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                            </div>
                            <div className='feature-item__text'>
                                <strong>Resume Analysis</strong>
                                AI reads your resume to find skill gaps
                            </div>
                        </div>
                        <div className='feature-item'>
                            <div className='feature-item__icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                            </div>
                            <div className='feature-item__text'>
                                <strong>Match Score</strong>
                                See how well you match the role
                            </div>
                        </div>
                        <div className='feature-item'>
                            <div className='feature-item__icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                            </div>
                            <div className='feature-item__text'>
                                <strong>Day-by-Day Plan</strong>
                                Know exactly what to study each day
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
                        <h2>Create your account ✨</h2>
                        <p>Already have an account? <Link to="/login">Sign in here</Link></p>
                    </div>

                    <form className='auth-box__form' onSubmit={handleSubmit}>
                        {error && <div className='auth-error'>{error}</div>}

                        <div className='input-group'>
                            <label htmlFor='username'>Username</label>
                            <div className='input-wrap'>
                                <span className='input-icon'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                </span>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    placeholder="yourname"
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

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
                                    placeholder="Create a strong password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button type="submit" className='auth-submit-btn' disabled={loading}>
                            {loading ? 'Creating account…' : 'Create Free Account →'}
                        </button>
                    </form>

                    <div className='auth-box__footer'>
                        Already have an account? <Link to="/login">Sign in here</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register