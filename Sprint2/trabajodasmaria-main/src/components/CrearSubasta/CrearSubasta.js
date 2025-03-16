import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CrearSubasta.module.css';

function CrearSubasta({ user }) {  // <-- Recibir user como prop
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startPrice, setStartPrice] = useState('');
  const [endDate, setEndDate] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const newSubasta = {
      id: new Date().getTime(),
      title,
      description,
      startPrice: parseFloat(startPrice),
      endDate,
      creatorId: user?.id || 1,  // <-- Asegurar que se guarda con el ID correcto
    };

    // Guardar en localStorage
    const existingSubastas = JSON.parse(localStorage.getItem('subastas')) || [];
    existingSubastas.push(newSubasta);
    localStorage.setItem('subastas', JSON.stringify(existingSubastas));

    // Redirigir a Mis Subastas
    navigate('/mis-subastas');
  };

  return (
    <div className={styles['crear-subasta-page']}>
      <div className={styles['form-container']}>
        <div className={styles['form-box']}>
          <h2 className={styles['h2-subasta']}>Crear Nueva Subasta</h2>
          <form onSubmit={handleSubmit} className={styles['form-subasta']}>
            <label htmlFor="title">Título:</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <label htmlFor="description">Descripción:</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />

            <label htmlFor="startPrice">Precio de Inicio:</label>
            <input
              type="number"
              id="startPrice"
              value={startPrice}
              onChange={(e) => setStartPrice(e.target.value)}
              required
            />

            <label htmlFor="endDate">Fecha de Finalización:</label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />

            <button type="submit">Crear Subasta</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CrearSubasta;
