import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';  
import './page.module.css';  

function Profile() {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('accessToken');  

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
          setUserData(data);  
        } else {
          setError('No se pudo obtener la información del usuario');
        }
      } catch (error) {
        setError('Error de conexión con el servidor');
      }
    };

    fetchProfile();  
  }, []); 

  const handleLogout = () => {
    setUser(null); // <-- Asegurar que se borra el usuario
    navigate('/');  // <-- Redirigir a home
    localStorage.removeItem('accessToken');
    localStorage.removeItem('username');
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
