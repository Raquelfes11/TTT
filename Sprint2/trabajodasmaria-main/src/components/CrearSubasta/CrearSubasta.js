import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CrearSubasta.module.css';

function CrearSubasta({ user }) {  // <-- Recibir user como prop
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startDate, setStartDate] = useState('');
  const [image, setImage] = useState('');
  const [startPrice, setStartPrice] = useState('');
  const [stock, setStock] = useState('');
  const [rating, setRating] = useState('');
  const [categories, setCategories] = useState([]);
  const [brand, setBrand] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/auctions/categories/');
        if (response.ok) {
          const data = await response.json();
          setCategories(data.results);
        } else {
          console.error('No se pudieron cargar las categorías');
        }
      } catch (error) {
        console.error('Error al obtener las categorías:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newSubasta = {
      id: new Date().getTime(),
      title,
      description,
      endDate,
      startDate,
      image,
      startPrice: parseFloat(startPrice),
      stock: parseInt(stock),
      rating: parseFloat(rating),
      categories,
      brand,

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

            <label htmlFor="startDate">Fecha de Inicio:</label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
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

            <label htmlFor="stock">Stock:</label>
            <input
              type="number"
              id="stock"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              required
            />

            <label htmlFor="rating">Rating:</label>
            <input
              type="number"
              id="rating"
              step="0.1"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              required
            />

            <label htmlFor="category">Categoría:</label>
            <select
              id="category"
              value={categories}
              onChange={(e) => setCategories(e.target.value)}
              required
            >
              <option value="">Selecciona una categoría</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>

            <label htmlFor="brand">Marca:</label>
            <input
              type="text"
              id="brand"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              required
            />

            <label htmlFor="image">URL de Imagen:</label>
            <input
              type="url"
              id="image"
              value={image}
              onChange={(e) => setImage(e.target.value)}
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
