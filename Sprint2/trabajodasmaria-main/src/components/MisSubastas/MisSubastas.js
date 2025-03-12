import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './MisSubastas.module.css';

function MisSubastas({ user }) {
  const [subastas, setSubastas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Aquí deberíamos traer las subastas creadas por el usuario, por ejemplo desde una API o localStorage.
    // Esto es solo un ejemplo con datos estáticos.
    const userSubastas = JSON.parse(localStorage.getItem('subastas')) || [];
    setSubastas(userSubastas.filter(subasta => subasta.creatorId === user.id));
  }, [user]);

  const handleCreateSubasta = () => {
    navigate('/crear-subasta');  // Redirige a la página para crear una nueva subasta
  };

  const handleDeleteSubasta = (id) => {
    const updatedSubastas = subastas.filter(subasta => subasta.id !== id);
    setSubastas(updatedSubastas);
    localStorage.setItem('subastas', JSON.stringify(updatedSubastas)); // Guardamos los cambios en el localStorage
  };

  const handleUpdateSubasta = (id) => {
    navigate(`/editar-subasta/${id}`);  // Redirige a la página para editar la subasta
  };

  const handleClearSubastas = () => {
    setSubastas([]);
    localStorage.removeItem('subastas');
  };

  return (
    <div className={styles['mis-subastas']}>
      <h2>Mis Subastas</h2>

      <button className={styles['btn-create']} onClick={handleCreateSubasta}>
        Crear Subasta
      </button>

      <button className={styles['btn-clear']} onClick={handleClearSubastas}>
        Limpiar Subastas
      </button>

      {subastas.length > 0 ? (
        <div className={styles['subastas-list']}>
          {subastas.map(subasta => (
            <div className={styles['subasta-card']} key={subasta.id}>
              <h3>{subasta.title}</h3>
              <p>{subasta.description}</p>
              <button onClick={() => handleUpdateSubasta(subasta.id)}>Actualizar</button>
              <button onClick={() => handleDeleteSubasta(subasta.id)}>Borrar</button>
            </div>
          ))}
        </div>
      ) : (
        <p>No tienes subastas creadas aún.</p>
      )}
    </div>
  );
}

export default MisSubastas;
