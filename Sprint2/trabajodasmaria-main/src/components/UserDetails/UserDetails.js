import React, { useState, useEffect } from 'react';
import styles from "./UserDetails.module.css";

function UserDetail({ user, setUser }) {
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    if (!user) return; // Si user es null, no cargar detalles
    
    const fetchUserDetails = async () => {
      const accessToken = user?.accessToken || localStorage.getItem('accessToken');
      if (accessToken) {
        try {
          const response = await fetch('http://localhost:8000/api/users/profile/', {
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
  

  return (
    <div className={styles.background}>
      <div className={styles.container}>
        {userDetails ? (
          <div>
            <h2>Detalle de Usuario</h2>
            <p><strong>Nombre de Usuario:</strong> {userDetails.username}</p>
            <p><strong>Nombre Completo:</strong> {userDetails.first_name} {userDetails.last_name}</p>
            <p><strong>Email:</strong> {userDetails.email}</p>
            <p><strong>Fecha de Nacimiento:</strong> {userDetails.birth_date}</p>
            <p><strong>Comunidad Autónoma:</strong> {userDetails.municipality}</p>
            <p><strong>Provincia:</strong> {userDetails.locality}</p>
          </div>
        ) : (
          <p>Cargando detalles...</p>
        )}
      </div>
    </div>
  );
}

export default UserDetail;