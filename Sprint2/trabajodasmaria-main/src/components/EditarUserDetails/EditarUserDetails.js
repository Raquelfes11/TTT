import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './EditarUserDetails.module.css';

function EditarDetallesUsuario({ user }) {
  const [formData, setFormData] = useState({
    first_name: user.first_name || '',
    last_name: user.last_name || '',
    email: user.email || '',
    municipality: user.municipality || '',
    locality: user.locality || '',
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:8000/api/users/profile/', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(Object.values(errorData).join(' '));
        return;
      }

      const data = await response.json();
      console.log('Actualizado:', data);
      navigate('/usuario'); // o a donde quieras redirigir
    } catch (err) {
      console.error(err);
      setError('Error al actualizar los datos.');
    }
  };

  const handleGoToForgotPassword = () => {
    navigate('/ChangePassword');
  };

  return (
    <div className={styles['editar-subasta-page']}>
      <div className={styles['form-container']}>
        <div className={styles['form-box']}>
          <h2 className={styles['h2-subasta']}>Editar Perfil</h2>
          <form className={styles['form-subasta']} onSubmit={handleSubmit}>
            <label>Nombre</label>
            <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} />

            <label>Apellido</label>
            <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} />

            <label>Email</label>
            <input type="text" name="email" value={formData.email} onChange={handleChange} />

            <label>Municipio</label>
            <input type="text" name="municipality" value={formData.municipality} onChange={handleChange} />

            <label>Localidad</label>
            <input type="text" name="locality" value={formData.locality} onChange={handleChange} />

            {error && <p style={{ color: 'red', fontSize: '12px' }}>{error}</p>}
            
            <button type="submit">Guardar Cambios</button>
          </form>

          <button className={styles.button} onClick={handleGoToForgotPassword}>
                ¿Cambiar contraseña?
            </button>
        </div>
      </div>
    </div>
  );
}

export default EditarDetallesUsuario;
