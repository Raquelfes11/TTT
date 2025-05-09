import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Importa Link para la navegación
import styles from './MisRatings.module.css';

function MisRatings() {
  const [valoraciones, setValoraciones] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const fetchValoraciones = async () => {
      const token = localStorage.getItem("accessToken");

      if (token) {
        setIsAuthenticated(true);
        try {
          const response = await fetch("http://127.0.0.1:8000/api/auctions/misValoraciones/", {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          if (response.ok) {
            const data = await response.json();
            setValoraciones(data);
          } else {
            console.error("Error al obtener valoraciones");
          }
        } catch (error) {
          console.error("Error en la solicitud de valoraciones:", error);
        }
      }
    };

    fetchValoraciones();
  }, []);

  return (
    <div className={styles.valoraciones}>
      <h2 className={styles['h2-valoraciones-page']}>Mis Valoraciones</h2>
      {!isAuthenticated ? (
        <p>Debes iniciar sesión para ver tus valoraciones.</p>
      ) : valoraciones.length > 0 ? (
        <div className={styles['valoraciones-items']}>
          {valoraciones.map((item) => (
            <div className={styles['valoracion-item']} key={item.id}>
              <img src={item.auction_thumbnail} alt={item.auction_title} />
              <h3>{item.auction_title}</h3>
              <p>Precio: {item.auction_price} €</p>
              <p>Categoría: {item.auction_category}</p>
              <p>Estado: {item.auction_is_open ? "Abierta" : "Cerrada"}</p>
              <p>Valoración: {item.rating}</p>
              <Link to={`/products/${item.id}`} className={styles['btn-ver-detalles']}>
                Ver detalles
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p className={styles['no-valoraciones']}>No has realizado ninguna valoración aún.</p>
      )}
    </div>
  );
}

export default MisRatings;


