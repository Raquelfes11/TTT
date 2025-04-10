import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './page.module.css';  

function LoginForm({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const navigate = useNavigate();

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    validateForm(e.target.value, password);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    validateForm(username, e.target.value);
  };

  const validateForm = (username, password) => {
    if (username.trim() !== '' && password.trim() !== '') {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/api/users/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.ok) {
        const userInfo = {
          username: data.username,
          accessToken: data.access,
        };
        localStorage.setItem("user", JSON.stringify(userInfo));
        localStorage.setItem("accessToken", userInfo.accessToken);
        onLogin(data);
        navigate('/'); 
        window.location.reload();
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
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username-login"
              placeholder="Username"
              value={username}
              onChange={handleUsernameChange}
              required
            />

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

