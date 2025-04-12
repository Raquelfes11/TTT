import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ChangePassword.module.css';

function ChangePassword({ user }) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);
  const [passwordMismatch, setPasswordMismatch] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched(true);
    setError('');

    if (newPassword.length < 8 || passwordMismatch) {
      return;
    }

    const accessToken = user?.accessToken || localStorage.getItem('accessToken');

    if (!accessToken) {
      setError('Token no disponible. Inicia sesión de nuevo.');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/users/change-password/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          old_password: oldPassword,
          new_password: newPassword,
        }),
      });

      if (response.ok) {
        alert('¡Contraseña cambiada correctamente!');
        navigate('/'); 
      } else {
        const data = await response.json();
        setError(data?.detail || data?.old_password || data?.new_password || 'Error al cambiar la contraseña.');
      }
    } catch (err) {
      setError('Error de red o del servidor.');
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setPasswordMismatch(value !== newPassword);
  };

  return (
    <div className={styles.background}>
      <div className={styles.container}>
        <h2>Cambiar Contraseña</h2>
        <form className={styles['form-subasta']} onSubmit={handleSubmit}>
          <label htmlFor="oldPassword">Contraseña Actual</label>
          <input
            type="password"
            id="oldPassword"
            placeholder="Introduce tu contraseña actual"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />

          <label htmlFor="newPassword">Nueva Contraseña</label>
          <input
            type="password"
            id="newPassword"
            placeholder="Introduce tu nueva contraseña"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              setPasswordMismatch(e.target.value !== confirmPassword); 
            }}
            required
          />

          <label htmlFor="confirmPassword">Repetir Nueva Contraseña</label>
          <input
            type="password"
            id="confirmPassword"
            placeholder="Repite tu nueva contraseña"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            required
          />

          {touched && newPassword.length < 8 && (
            <p className={styles['error-message']}>La nueva contraseña debe tener al menos 8 caracteres.</p>
          )}

          {passwordMismatch && (
            <p className={styles['error-message']}>Las contraseñas no coinciden.</p>
          )}

          {error && (
            <p className={styles['error-message']}>{error}</p>
          )}

          <button className={styles.button} type="submit">
            Cambiar Contraseña
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChangePassword;
