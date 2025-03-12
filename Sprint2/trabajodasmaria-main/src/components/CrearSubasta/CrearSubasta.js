import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CrearSubasta.module.css';

function CrearSubasta() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startPrice, setStartPrice] = useState('');
  const [endDate, setEndDate] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const newSubasta = {
      id: new Date().getTime(),  // Usamos el timestamp como un ID único
      title,
      description,
      startPrice: parseFloat(startPrice),
      endDate,
      creatorId: 1, // Suponemos que el ID del usuario es 1, lo que deberías cambiar dependiendo de tu lógica
    };

    // Guardar la subasta en localStorage
    const existingSubastas = JSON.parse(localStorage.getItem('subastas')) || [];
    existingSubastas.push(newSubasta);
    localStorage.setItem('subastas', JSON.stringify(existingSubastas));

    // Redirigir a "Mis Subastas"
    navigate('/mis-subastas');
  };

  return (
    <div className={styles['crear-subasta']}>
      <h2>Crear Nueva Subasta</h2>
      <form onSubmit={handleSubmit} className={styles['subasta-form']}>
        <div>
          <label htmlFor="title">Título:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="description">Descripción:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="startPrice">Precio de Inicio:</label>
          <input
            type="number"
            id="startPrice"
            value={startPrice}
            onChange={(e) => setStartPrice(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="endDate">Fecha de Finalización:</label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>
        <button type="submit">Crear Subasta</button>
      </form>
    </div>
  );
}

export default CrearSubasta;
