import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Admin.css';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [gender, setGender] = useState('');
    const [aadhar, setAadhar] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const [loginAttempts, setLoginAttempts] = useState(0);
    const [isLocked, setIsLocked] = useState(false);
    const [lockTime, setLockTime] = useState(null);
    const navigate = useNavigate();


    // Check if account is locked and update timer
    useEffect(() => {
        if (isLocked) {
            const interval = setInterval(() => {
                const now = new Date();
                const timeLeft = Math.ceil((lockTime - now) / 1000);

                if (timeLeft <= 0) {
                    setIsLocked(false);
                    setLoginAttempts(0);
                    clearInterval(interval);
                }
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [isLocked, lockTime]);

    const handleLogin = async (event) => {
        event.preventDefault();

        // Don't proceed if account is locked
        if (isLocked) return;

        // Basic validation
        if (!username.trim() || !password.trim()) {
            setError('Username and password are required');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // Simulate API call with setTimeout
            await new Promise(resolve => setTimeout(resolve, 800));

            // In a real app, this would be an API call to validate credentials
            const adminCredentials = {
                username: 'admin',
                password: 'password123',
            };

            if (username === adminCredentials.username && password === adminCredentials.password) {
                setIsLoggedIn(true);
                setLoginAttempts(0);
                navigate('/admin'); // Redirect to admin page after login
            } else {
                const newAttempts = loginAttempts + 1;
                setLoginAttempts(newAttempts);

                // Lock account after 3 failed attempts
                if (newAttempts >= 3) {
                    const lockoutTime = new Date();
                    lockoutTime.setMinutes(lockoutTime.getMinutes() + 15); // 15 minute lockout
                    setLockTime(lockoutTime);
                    setIsLocked(true);
                    setError('Too many failed attempts. Account locked for 15 minutes.');
                } else {
                    setError(`Invalid credentials. ${3 - newAttempts} attempts remaining.`);
                }
            }
        } catch (err) {
            setError('Login service unavailable. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async (event) => {
        event.preventDefault();

        // Basic validation
        if (!username.trim() || !password.trim()) {
            setError('Username and password are required');
            return;
        }

        if (!name.trim() || !email.trim() || !phone.trim() || !gender || !aadhar.trim()) {
            setError('All fields are required');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters long');
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address');
            return;
        }

        // Validate phone number (10 digits)
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(phone)) {
            setError('Phone number must be 10 digits');
            return;
        }

        // Validate Aadhar number (12 digits)
        const aadharRegex = /^[0-9]{12}$/;
        if (!aadharRegex.test(aadhar)) {
            setError('Aadhar number must be 12 digits');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // Simulate API call with setTimeout
            await new Promise(resolve => setTimeout(resolve, 800));

            // In a real app, this would be an API call to register the user
            console.log(`Registering user: ${username} with details:`, {
                name,
                email,
                phone,
                gender,
                aadhar,
                password
            });

            // Show success message and switch to login
            setError(null);
            setIsRegistering(false);
            setUsername('');
            setPassword('');
            setConfirmPassword('');
            setName('');
            setEmail('');
            setPhone('');
            setGender('');
            setAadhar('');

            // Set a success message
            setError('Registration successful! Please login with your credentials.');
        } catch (err) {
            setError('Registration service unavailable. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggleRegister = () => {
        setIsRegistering(!isRegistering);
        setError(null);
        setUsername('');
        setPassword('');
        setConfirmPassword('');
        setName('');
        setEmail('');
        setPhone('');
        setGender('');
        setAadhar('');
    };

    // Calculate time remaining for lockout
    const getTimeRemaining = () => {
        if (!isLocked || !lockTime) return '';
        const now = new Date();
        const timeLeft = Math.ceil((lockTime - now) / 1000);

        if (timeLeft <= 0) return '';

        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    };

    return (
        <div className="admin-login-container">
            <div className="login-background"></div>

            {isLoggedIn ? (
                <div className="admin-dashboard">
                    <div className="dashboard-header">
                        <h2>Admin Dashboard</h2>
                        <div className="welcome-badge">Administrator</div>
                    </div>
                    <div className="dashboard-content">
                        <div className="welcome-icon">
                            <svg viewBox="0 0 24 24" width="48" height="48" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                        </div>
                        <p className="welcome-message">Welcome to your admin control panel</p>
                        <p className="login-success">You have successfully logged in and can now manage your application.</p>
                    </div>
                    <button
                        onClick={() => {
                            setIsLoggedIn(false);
                            setUsername('');
                            setPassword('');
                            navigate('/');
                        }}
                        className="admin-logout-button"
                    >
                        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="logout-icon">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                            <polyline points="16 17 21 12 16 7"></polyline>
                            <line x1="21" y1="12" x2="9" y2="12"></line>
                        </svg>
                        Logout
                    </button>
                </div>
            ) : (
                <div className="admin-login-form-container">
                    <div className="form-header">
                        <div className="form-logo">
                            <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            </svg>
                        </div>
                        <h2>{isRegistering ? 'Create Account' : 'Welcome Back'}</h2>
                        <p className="form-subtitle">{isRegistering ? 'Register a new admin account' : 'Sign in to your admin panel'}</p>
                    </div>

                    <form onSubmit={isRegistering ? handleRegister : handleLogin} className="admin-login-form">
                        {isRegistering && (
                            <>
                                <div className="form-group">
                                    <label htmlFor="name">Full Name</label>
                                    <div className="input-with-icon">
                                        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="input-icon">
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                            <circle cx="12" cy="7" r="4"></circle>
                                        </svg>
                                        <input
                                            id="name"
                                            type="text"
                                            value={name}
                                            onChange={(event) => setName(event.target.value)}
                                            disabled={isLoading}
                                            className="admin-login-input"
                                            placeholder="Enter your full name"
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="email">Email Address</label>
                                    <div className="input-with-icon">
                                        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="input-icon">
                                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                            <polyline points="22,6 12,13 2,6"></polyline>
                                        </svg>
                                        <input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(event) => setEmail(event.target.value)}
                                            disabled={isLoading}
                                            className="admin-login-input"
                                            placeholder="Enter your email address"
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="phone">Phone Number</label>
                                    <div className="input-with-icon">
                                        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="input-icon">
                                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                                        </svg>
                                        <input
                                            id="phone"
                                            type="tel"
                                            value={phone}
                                            onChange={(event) => setPhone(event.target.value)}
                                            disabled={isLoading}
                                            className="admin-login-input"
                                            placeholder="Enter your 10-digit phone number"
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="gender">Gender</label>
                                    <div className="input-with-icon select-wrapper">
                                        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="input-icon">
                                            <circle cx="12" cy="12" r="10"></circle>
                                            <path d="M12 8c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4z"></path>
                                        </svg>
                                        <select
                                            id="gender"
                                            value={gender}
                                            onChange={(event) => setGender(event.target.value)}
                                            disabled={isLoading}
                                            className="admin-login-input"
                                        >
                                            <option value="">Select gender</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="aadhar">Aadhar Number</label>
                                    <div className="input-with-icon">
                                        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="input-icon">
                                            <rect x="3" y="4" width="18" height="16" rx="2" ry="2"></rect>
                                            <line x1="16" y1="2" x2="16" y2="6"></line>
                                            <line x1="8" y1="2" x2="8" y2="6"></line>
                                            <line x1="3" y1="10" x2="21" y2="10"></line>
                                        </svg>
                                        <input
                                            id="aadhar"
                                            type="text"
                                            value={aadhar}
                                            onChange={(event) => setAadhar(event.target.value)}
                                            disabled={isLoading}
                                            className="admin-login-input"
                                            placeholder="Enter your 12-digit Aadhar number"
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <div className="input-with-icon">
                                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="input-icon">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                                <input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(event) => setUsername(event.target.value)}
                                    disabled={isLocked || isLoading}
                                    className="admin-login-input"
                                    autoComplete="username"
                                    placeholder="Enter your username"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <div className="input-with-icon">
                                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="input-icon">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                </svg>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                    disabled={isLocked || isLoading}
                                    className="admin-login-input"
                                    autoComplete="new-password"
                                    placeholder={isRegistering ? "Create a password" : "Enter your password"}
                                />
                            </div>
                        </div>

                        {isRegistering && (
                            <div className="form-group">
                                <label htmlFor="confirm-password">Confirm Password</label>
                                <div className="input-with-icon">
                                    <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="input-icon">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                    </svg>
                                    <input
                                        id="confirm-password"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(event) => setConfirmPassword(event.target.value)}
                                        disabled={isLoading}
                                        className="admin-login-input"
                                        autoComplete="new-password"
                                        placeholder="Confirm your password"
                                    />
                                </div>
                            </div>
                        )}

                        {!isRegistering && !isLocked && (
                            <div className="form-options">
                                <div className="remember-me">
                                    <input type="checkbox" id="remember" />
                                    <label htmlFor="remember">Remember me</label>
                                </div>
                                <a href="#" className="forgot-password">Forgot password?</a>
                            </div>
                        )}

                        {error && (
                            <div className={error.includes('successful') ? "success-message" : "error-message"}>
                                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="message-icon">
                                    {error.includes('successful') ? (
                                        <>
                                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                        </>
                                    ) : (
                                        <>
                                            <circle cx="12" cy="12" r="10"></circle>
                                            <line x1="12" y1="8" x2="12" y2="12"></line>
                                            <line x1="12" y1="16" x2="12" y2="16"></line>
                                        </>
                                    )}
                                </svg>
                                <span>{error}</span>
                            </div>
                        )}

                        {isLocked && (
                            <div className="lockout-message">
                                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="message-icon">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                </svg>
                                <span>Account temporarily locked. Try again in {getTimeRemaining()}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            className={`admin-login-button ${isLoading ? 'loading' : ''}`}
                            disabled={isLocked || isLoading}
                        >
                            {isLoading ? (
                                <span className="button-content">
                                    <svg className="spinner" viewBox="0 0 24 24" width="18" height="18">
                                        <circle cx="12" cy="12" r="10" fill="none" strokeWidth="4" stroke="currentColor" strokeDasharray="30 30" strokeDashoffset="0"></circle>
                                    </svg>
                                    <span>{isRegistering ? 'Creating Account...' : 'Signing In...'}</span>
                                </span>
                            ) : (
                                <span className="button-content">
                                    {isRegistering ? 'Create Account' : 'Sign In'}
                                </span>
                            )}
                        </button>

                        <div className="auth-toggle">
                            {isRegistering ? (
                                <span>
                                    Already have an account?{' '}
                                    <button
                                        type="button"
                                        onClick={handleToggleRegister}
                                        className="toggle-button"
                                        disabled={isLoading}
                                    >
                                        Sign In
                                    </button>
                                </span>
                            ) : (
                                <span>
                                    Don't have an account?{' '}
                                    <button
                                        type="button"
                                        onClick={handleToggleRegister}
                                        className="toggle-button"
                                        disabled={isLocked || isLoading}
                                    >
                                        Register
                                    </button>
                                </span>
                            )}
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default AdminLogin;