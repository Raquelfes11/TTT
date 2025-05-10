import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './MisComentarios.module.css';

function MisComentarios() {
  const [comentarios, setComentarios] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const fetchComentarios = async () => {
      const token = localStorage.getItem("accessToken");

      if (token) {
        setIsAuthenticated(true);
        try {
          const response = await fetch("http://127.0.0.1:8000/api/auctions/misComentarios/", {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          if (response.ok) {
            const data = await response.json();
            setComentarios(data);
          } else {
            console.error("Error al obtener comentarios");
          }
        } catch (error) {
          console.error("Error en la solicitud de comentarios:", error);
        }
      }
    };

    fetchComentarios();
  }, []);

  return (
    <div className={styles.comentarios}>
      <h2 className={styles['h2-comentarios-page']}>Mis Comentarios</h2>
      {!isAuthenticated ? (
        <p>Debes iniciar sesión para ver tus comentarios.</p>
      ) : comentarios.length > 0 ? (
        <div className={styles['comentarios-items']}>
          {comentarios.map((item) => {
            console.log(item); // Verifica que item tenga auction_id
            return (
              <div className={styles['comentario-item']} key={item.id}>
                <img src={item.auction_thumbnail} alt={item.auction_title} />
                <h3>{item.auction_title}</h3>
                <p>Precio: {item.auction_price} €</p>
                <p>Categoría: {item.auction_category}</p>
                <p>Estado: {item.auction_is_open ? "Abierta" : "Cerrada"}</p>
                <p><strong>Comentario:</strong> {item.text}</p>
                <Link to={`/products/${item.auction_id}`} className={styles['btn-ver-detalles']}>
                  Ver detalles
                </Link>
              </div>
            );
          })}
        </div>
      ) : (
        <p className={styles['no-comentarios']}>No has escrito ningún comentario aún.</p>
      )}
    </div>
  );
}

export default MisComentarios;
