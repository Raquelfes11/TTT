import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './MisSubastas.module.css';

function MisSubastas() {
  const [subastas, setSubastas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubastas = async () => {
      try {
        setLoading(true);  // Empezamos a cargar
        const accessToken = localStorage.getItem('accessToken');  // Obtener el token desde el localStorage
        
        if (!accessToken) {
          setError('No estás autenticado. Por favor, inicia sesión.');
          setLoading(false);
          return;
        }

        const response = await fetch('http://localhost:8000/api/auctions/misSubastas', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,  // Autenticación con el token
          },
        });

        if (!response.ok) {
          throw new Error('No se pudieron obtener tus subastas');
        }

        const data = await response.json();
        setSubastas(data);  // Establecer las subastas obtenidas
      } catch (error) {
        setError(error.message);  // Mostrar el error si ocurre
      } finally {
        setLoading(false);  // Finalizar la carga
      }
    };

    fetchSubastas();  // Llamar a la función para obtener las subastas
  }, []);

  const handleCreateSubasta = () => {
    navigate('/crear-subasta');
  };

  const handleDeleteSubasta = (id) => {
    const updatedSubastas = subastas.filter(subasta => subasta.id !== id);
    setSubastas(updatedSubastas);
  };

  const handleUpdateSubasta = (id) => {
    navigate(`/editar-subasta/${id}`);
  };

  const handleClearSubastas = () => {
    setSubastas([]);
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

      {loading ? (
        <p>Cargando tus subastas...</p>
      ) : error ? (
        <p className={styles['error']}>{error}</p>
      ) : subastas.length > 0 ? (
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
