import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Para la navegación después de hacer logout
import './page.module.css';  // Asegúrate de importar el archivo CSS

function Profile() {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();  // Redirigir al login después del logout

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('accessToken');  // Obtenemos el token desde localStorage

      if (!token) {
        setError('No autorizado');
        return;
      }

      try {
        const response = await fetch('https://das-p2-backend.onrender.com/api/users/profile/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        if (response.ok) {
          setUserData(data);  // Si todo va bien, guardamos los datos del usuario
        } else {
          setError('No se pudo obtener la información del usuario');
        }
      } catch (error) {
        setError('Error de conexión con el servidor');
      }
    };

    fetchProfile();  // Llamamos a la función para obtener los datos
  }, []);  // Este efecto solo se ejecutará una vez, al montar el componente

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('username');
    navigate('/login');  // Redirigimos al usuario a la página de login después de hacer logout
  };

  if (error) return <p>{error}</p>;
  if (!userData) return <p>Cargando...</p>;

  return (
    <div className="profile-container">
      <div className="profile-box">
        <h1>Perfil de {userData.username}</h1>
        <p>Email: {userData.email}</p>
        <p>Nombre: {userData.first_name} {userData.last_name}</p>
        <p>Fecha de nacimiento: {userData.birth_date}</p>
        <p>Localidad: {userData.locality}</p>
        <p>Municipio: {userData.municipality}</p>
        <button onClick={handleLogout}>Cerrar sesión</button>
      </div>
    </div>
  );
}

export default Profile;
