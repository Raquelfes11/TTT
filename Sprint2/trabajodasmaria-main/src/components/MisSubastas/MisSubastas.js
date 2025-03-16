import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './MisSubastas.module.css';

function MisSubastas({ user }) {  // <-- Recibir user como prop
  const [subastas, setSubastas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {  // <-- Asegurar que user existe antes de filtrar
      const userSubastas = JSON.parse(localStorage.getItem('subastas')) || [];
      setSubastas(userSubastas.filter(subasta => subasta.creatorId === user.id)); // <-- Filtrar por user.id
    }
  }, [user]);

  const handleCreateSubasta = () => {
    navigate('/crear-subasta');  
  };

  const handleDeleteSubasta = (id) => {
    const updatedSubastas = subastas.filter(subasta => subasta.id !== id);
    setSubastas(updatedSubastas);
    localStorage.setItem('subastas', JSON.stringify(updatedSubastas)); 
  };

  const handleUpdateSubasta = (id) => {
    navigate(`/editar-subasta/${id}`);  
  };

  const handleClearSubastas = () => {
    setSubastas([]);
    localStorage.removeItem('subastas');
  };

  return (
    <div className={styles['mis-subastas']}>
      <h2>Mis Subastas</h2>

      <div className={styles['buttons-container']}>
        <button className={styles['btn-create']} onClick={handleCreateSubasta}>
          Crear Subasta
        </button>
        <button className={styles['btn-clear']} onClick={handleClearSubastas}>
          Limpiar Subastas
        </button>
      </div>

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
        <p className={styles['no-subastas']}>No tienes subastas creadas aún.</p>
      )}
    </div>
  );
}

export default MisSubastas;
