import React, { useEffect, useState } from 'react';
import styles from './MisPujas.module.css'; 

function MisPujas({ user, setUser }) {
  const [pujasItems, setPujasItems] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const fetchPujas = async () => {
      const token = localStorage.getItem("accessToken");

      if (token) {
        setIsAuthenticated(true); 
        try {
          const response = await fetch("http://127.0.0.1:8000/api/auctions/misPujas", {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          if (response.ok) {
            const data = await response.json();
            setPujasItems(data); 
          } else {
            console.error("Error al obtener las pujas");
          }
        } catch (error) {
          console.error("Error al hacer la solicitud de pujas:", error);
        }
      } else {
        setIsAuthenticated(false); 
      }
    };

    fetchPujas();
  }, []); 

  const removeItemFromPujas = async (index, auctionId, bidId) => {
    const token = localStorage.getItem("accessToken");
  
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/auctions/${auctionId}/bids/${bidId}/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        const updatedPujas = [...pujasItems];
        updatedPujas.splice(index, 1);
        setPujasItems(updatedPujas);
      } else {
        alert("Error al eliminar la puja");
      }
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };
  

  return (
    <div className={styles.pujas}>
      <h2 className={styles['h2-pujas-page']}>Pujas Realizadas</h2>
      {!isAuthenticated ? (
        <p>Te tienes que loguear para ver tus pujas.</p>
      ) : pujasItems.length > 0 ? (
        <div className={styles['pujas-items']}>
          {pujasItems.map((item, index) => (
            <div className={styles['pujas-item']} key={index}>
              <img src={item.auction_thumbnail} alt={item.auction_title} />
              <h3>{item.auction_title}</h3>
              <p>Cantidad Pujada: ${item.price}</p>
              <button 
                className={styles['btn-remove']} 
                onClick={() => removeItemFromPujas(index, item.auction_id, item.id)}
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
