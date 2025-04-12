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
        setLoading(true); 
        const accessToken = localStorage.getItem('accessToken');  
        
        if (!accessToken) {
          setError('No estás autenticado. Por favor, inicia sesión.');
          setLoading(false);
          return;
        }

        const response = await fetch('http://localhost:8000/api/auctions/misSubastas', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`, 
          },
        });

        if (!response.ok) {
          throw new Error('No se pudieron obtener tus subastas');
        }

        const data = await response.json();
        setSubastas(data);  
      } catch (error) {
        setError(error.message);  
      } finally {
        setLoading(false);  
      }
    };

    fetchSubastas(); 
  }, []);

  const handleCreateSubasta = () => {
    navigate('/crear-subasta');
  };

  const handleDeleteSubasta = async (id) => {
    const confirmDelete = window.confirm("¿Estás seguro de que quieres eliminar esta subasta?");
    if (!confirmDelete) return;
  
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch(`http://localhost:8000/api/auctions/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
  
      if (response.status === 204) {
        const updatedSubastas = subastas.filter(subasta => subasta.id !== id);
        setSubastas(updatedSubastas);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al eliminar la subasta');
      }
    } catch (error) {
      alert(`Hubo un error al eliminar la subasta: ${error.message}`);
    }
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
              <img
                  src={subasta.thumbnail}
                  alt={`Imagen de ${subasta.title}`}
                  style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px', marginBottom: '15px' }}
                />
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
