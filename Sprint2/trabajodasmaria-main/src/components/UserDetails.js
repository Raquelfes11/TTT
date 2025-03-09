import React, { useState, useEffect } from 'react';

function UserDetail({ user, setUser }) {
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const accessToken = user.accessToken || localStorage.getItem('accessToken');
      if (accessToken) {
        try {
          const response = await fetch('https://das-p2-backend.onrender.com/api/users/profile', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setUserDetails(data);
          } else {
            console.error('No se pudo obtener los detalles del usuario');
          }
        } catch (error) {
          console.error('Error al obtener detalles del usuario:', error);
        }
      }
    };

    fetchUserDetails();
  }, [user]);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('accessToken');
  };

  return (
    <div>
      {userDetails ? (
        <div>
          <h2>Detalle de Usuario</h2>
          <p>Nombre: {userDetails.first_name} {userDetails.last_name}</p>
          <p>Email: {userDetails.email}</p>
          <p>Fecha de Nacimiento: {userDetails.birth_date}</p>
          <button onClick={handleLogout}>Cerrar sesión</button>
        </div>
      ) : (
        <p>Cargando detalles...</p>
      )}
    </div>
  );
}

export default UserDetail;
