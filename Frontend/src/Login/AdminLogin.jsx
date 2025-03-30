import React, { useState, useEffect } from 'react';
import './Admin.css';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loginAttempts, setLoginAttempts] = useState(0);
    const [isLocked, setIsLocked] = useState(false);
    const [lockTime, setLockTime] = useState(null);

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
                // Would store authentication token here in a real app
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

    const handleLogout = () => {
        setIsLoggedIn(false);
        setUsername('');
        setPassword('');
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
            {isLoggedIn ? (
                <div className="admin-dashboard">
                    <h2>Admin Dashboard</h2>
                    <p>Welcome, Administrator!</p>
                    <p>You have successfully logged in to the admin panel.</p>
                    <button
                        onClick={handleLogout}
                        className="admin-logout-button"
                    >
                        Logout
                    </button>
                </div>
            ) : (
                <div className="admin-login-form-container">
                    <h2>Admin Login</h2>
                    <form onSubmit={handleLogin} className="admin-login-form">
                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(event) => setUsername(event.target.value)}
                                disabled={isLocked || isLoading}
                                className="admin-login-input"
                                autoComplete="username"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                disabled={isLocked || isLoading}
                                className="admin-login-input"
                                autoComplete="current-password"
                            />
                        </div>

                        {error && <div className="error-message">{error}</div>}

                        {isLocked && (
                            <div className="lockout-message">
                                Account temporarily locked. Try again in {getTimeRemaining()}.
                            </div>
                        )}

                        <button
                            type="submit"
                            className="admin-login-button"
                            disabled={isLocked || isLoading}
                        >
                            {isLoading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default AdminLogin;