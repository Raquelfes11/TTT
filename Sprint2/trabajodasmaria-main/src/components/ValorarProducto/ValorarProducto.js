import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styles from "./ValorarProducto.module.css";

function ValorarProducto() {
  const { id } = useParams(); // ID de la subasta
  const [rating, setRating] = useState(0);
  const [ratingId, setRatingId] = useState(null); // ID del rating si existe
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    if (!token) return;

    // Buscar si ya hay una valoración del usuario
    fetch(`http://127.0.0.1:8000/api/auctions/${id}/ratings/my/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(res => {
        if (res.status === 404) return null; // No hay valoración
        return res.json();
      })
      .then(data => {
        if (data) {
          setRating(data.rating);
          setRatingId(data.id);
        }
      })
      .catch(err => console.error("Error cargando valoración:", err))
      .finally(() => setLoading(false));
  }, [id, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      alert("Debes iniciar sesión para valorar.");
      return;
    }
  
    const isEditing = ratingId !== null;
    const url = isEditing
      ? `http://127.0.0.1:8000/api/auctions/${id}/ratings/my/`
      : `http://127.0.0.1:8000/api/auctions/${id}/ratings/`;
  
    const method = isEditing ? 'PUT' : 'POST';
  
    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ rating }),
      });
  
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Error al enviar valoración.");
      }
  
      const data = await res.json();
      setRatingId(data.id);
      alert("Valoración guardada correctamente.");
    } catch (error) {
      console.error("Error al valorar:", error.message);
      alert("Hubo un error al valorar.");
    }
  };  

  const handleDelete = async () => {
    if (!ratingId) return;
  
    const confirmed = window.confirm("¿Estás seguro de que deseas eliminar tu valoración?");
    if (!confirmed) return;
  
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/auctions/${id}/ratings/my/`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (response.status === 204) {
        alert("Valoración eliminada.");
        setRating(1); // Reseteamos la valoración a 0
        setRatingId(null); // Eliminamos el ID de la valoración
      } else {
        alert("Error al eliminar valoración.");
      }
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };
  

  if (!token) return <p>Debes <Link to="/login">iniciar sesión</Link> para valorar.</p>;
  if (loading) return <p>Cargando valoración...</p>;

  return (
    <div className={styles.container}>
      <h2>Valorar producto</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Puntuación:
          <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
            <option value={0} disabled>Selecciona una puntuación</option>
            {[1, 2, 3, 4, 5].map(num => (
                <option key={num} value={num}>{num} estrella{num > 1 ? 's' : ''}</option>
            ))}
            </select>
        </label>
        <br />
        <button type="submit">
          {ratingId ? "Actualizar valoración" : "Enviar valoración"}
        </button>
        {ratingId && (
          <button type="button" className={styles.deleteButton} onClick={handleDelete} style={{ marginLeft: "1rem", backgroundColor: "red", color: "white" }}>
            Eliminar valoración
          </button>
        )}
        <Link to={`/products/${id}`} className={styles.linkButton} ><button>Volver</button></Link>
      </form>
    </div>
  );
}

export default ValorarProducto;
