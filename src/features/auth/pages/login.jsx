import React, { useState } from 'react'
import "../auth.form.scss"
import { Link } from 'react-router-dom'

import { useNavigate } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const username = e.target.username.value;
        const password = e.target.password.value;       

        try {
            await login(username, password);
            navigate("/");
        }       
        catch (error) {
            console.error("Login failed:", error);
            setError(error.response?.data?.message || 'Login failed. Please try again.');
        }       
    };  
  return (
    <div>
        <main>
            <div className="form-container">
                <h1>Login</h1>
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleSubmit}>

                    <div className="input-group">

                        <label htmlFor ="username">Username</label>
                        <input type="text" id="username" name="username" placeholder='Enter your username' />

                    </div>
                    <div className="input-group">
                        <label htmlFor ="password">Password</label>
                        <input type="password" id="password" name="password" placeholder='Enter your password' />   
                    </div>
                    <button type="submit" className='button primary-button'>Login</button>


                </form>

                <p> Don't  have an account ? <Link to="/register">Register</Link></p>


            </div>
        </main>
      
    </div>
  )
}

export default Login
