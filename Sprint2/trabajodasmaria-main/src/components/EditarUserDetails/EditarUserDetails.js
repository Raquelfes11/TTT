import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './EditarUserDetails.module.css';


function EditarDetallesUsuario({ user }) {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const [touched, setTouched] = useState(false);
    const navigate = useNavigate();
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setTouched(true);
      setError('');
  
      if (newPassword.length < 8) {
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
          navigate('/'); // Redirige a la página principal
        } else {
          const data = await response.json();
          setError(data?.detail || data?.old_password || data?.new_password || 'Error al cambiar la contraseña.');
        }
      } catch (err) {
        setError('Error de red o del servidor.');
      }
    };
  
    return (
      <div className={styles.background}>
        <div className={styles.container}>
          <h2>Cambiar Contraseña</h2>
          <form onSubmit={handleSubmit}>
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
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
  
            {touched && newPassword.length < 8 && (
              <p className={styles['error-message']}>La nueva contraseña debe tener al menos 8 caracteres.</p>
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
  
  export default EditarDetallesUsuario;
  
  





// /change-users-details