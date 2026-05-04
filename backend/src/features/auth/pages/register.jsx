import React, { useState } from 'react'
import "../auth.form.scss"
import { useNavigate, Link } from "react-router-dom"
import { register } from '../services/auth.api'

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(username, email, password);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div>
      <main>
        <div className="form-container">
          <h1>Register</h1>
          {error && <p className="error">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="username">Username</label>
              <input type="text" id="username" name="username" placeholder="Enter your username" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>

            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" name="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>

            <button type="submit" className="button primary-button">Register</button>
          </form>
          <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
      </main>
    </div>
  )
}

export default Register
