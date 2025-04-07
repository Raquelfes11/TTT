import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './page.module.css';  

function LoginForm({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailPattern.test(email);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (!validateEmail(value)) {
      setEmailError('Formato de email no válido');
    } else {
      setEmailError('');
    }
    validateForm(value, password);
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    validateForm(email, value);
  };

  const validateForm = (email, password) => {
    if (validateEmail(email) && password.trim() !== '') {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://das-p2-backend.onrender.com/api/users/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        const userInfo = {
          username: data.username,
          accessToken: data.access,
        };
        localStorage.setItem("user", JSON.stringify(userInfo));
        if (userData.accessToken) {
          localStorage.setItem("accessToken", userData.accessToken);
        }
        onLogin(data);
        navigate('/'); 
      } else {
        setError('Usuario o contraseña incorrectos');
      }
    } catch (error) {
      setError('Error de conexión con el servidor');
    }
  };

  return (
    <div className={styles['login-page']}> 
      <section className={styles['form-container-login-page']}>
        <article className={styles['form-box-login-page']}>
          <h1 className={styles['h1-login-page']}>Sign in to TTT</h1>
          {error && <p className={styles['error-message']}>{error}</p>}
          <form onSubmit={handleSubmit} className={styles['form-login-page']}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email-login"
              placeholder="Email Address"
              value={email}
              onChange={handleEmailChange}
              required
            />
            {emailError && <span className={styles['error-message']}>{emailError}</span>}

            <section className={styles['password-container']}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password-login"
                placeholder="Enter your password"
                value={password}
                onChange={handlePasswordChange}
                required
              />
              <Link to="/forgot-password" className={styles['forgot-password-link']}>Forgot Password?</Link>
            </section>

            <button type="submit" className={styles['login-button']} disabled={isButtonDisabled}>Log In</button>

            <p>Don't have an account? <Link to="/register"><strong><u>Register for free</u></strong></Link>.</p>
          </form>
        </article>
      </section>
    </div>
  );
}

export default LoginForm;
