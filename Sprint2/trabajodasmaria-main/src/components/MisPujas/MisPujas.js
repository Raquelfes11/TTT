import React, { useEffect, useState } from 'react';
import styles from './MisPujas.module.css'; 

function MisPujas({ user, setUser }) {
  const [pujasItems, setPujasItems] = useState([]);

  useEffect(() => {
    const fetchPujas = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        if (token) {
          const response = await fetch("http://127.0.0.1:8000/api/auctions/misPujas", {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          if (response.ok) {
            const data = await response.json();
            setPujasItems(data); // Establece las pujas que el usuario ha realizado
          } else {
            console.error("Error al obtener las pujas");
          }
        } else {
          alert("No estás autenticado");
        }
      } catch (error) {
        console.error("Error al hacer la solicitud de pujas:", error);
      }
    };

    fetchPujas();
  }, []); // El useEffect se ejecuta al cargar el componente

  const removeItemFromPujas = (index) => {
    const updatedPujas = [...pujasItems];
    updatedPujas.splice(index, 1);
    setPujasItems(updatedPujas); 
    localStorage.setItem("misPujas", JSON.stringify(updatedPujas)); 
  };

  return (
    <div className={styles.pujas}>
      <h2 className={styles['h2-pujas-page']}>Pujas Realizadas</h2>
      {pujasItems.length > 0 ? (
        <div className={styles['pujas-items']}>
          {pujasItems.map((item, index) => (
            <div className={styles['pujas-item']} key={index}>
              <img src={item.auction_thumbnail } alt={item.title} />
              <h3>{item.auction_title}</h3>
              <p>Cantidad Pujada: ${item.price}</p>
              <button 
                className={styles['btn-remove']} 
                onClick={() => removeItemFromPujas(index)}
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>No has realizado ninguna puja.</p>
      )}
    </div>
  );
}

export default MisPujas;


