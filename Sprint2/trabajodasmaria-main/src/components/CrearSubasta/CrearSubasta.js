import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CrearSubasta.module.css';

function CrearSubasta() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [endDate, setEndDate] = useState('');
  const [image, setImage] = useState('');
  const [startPrice, setStartPrice] = useState('');
  const [stock, setStock] = useState('');
  const [rating, setRating] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const accessToken = localStorage.getItem('accessToken');
    const user = JSON.parse(localStorage.getItem('user'));

    if (!accessToken) {
      alert('No estás autenticado. Inicia sesión primero.');
      navigate('/login');
      return;
    }

    if (!user || !user.user.id) {
      alert('El usuario no está correctamente autenticado.');
      navigate('/login');
      return;
    }

    const newSubasta = {
      title,
      description,
      closing_date: endDate,
      thumbnail: image,
      price: parseFloat(startPrice),
      stock: parseInt(stock),
      rating: parseFloat(rating),
      category: selectedCategory,
      brand,
      auctioneer: user.user.id,  
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/api/auctions/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,  
        },
        body: JSON.stringify(newSubasta),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error al crear la subasta:', errorData);
        alert(`Error: ${JSON.stringify(errorData)}`);
        return;
      }

      const result = await response.json();
      console.log('Subasta creada con éxito:', result);

      const existingSubastas = JSON.parse(localStorage.getItem('subastas')) || [];
      existingSubastas.push(result);
      localStorage.setItem('subastas', JSON.stringify(existingSubastas));

      navigate('/mis-subastas');
    } catch (error) {
      console.error('Error de red o del servidor:', error);
      alert('Error del servidor o de red. Intenta de nuevo.');
    }
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

            <label htmlFor="stock">Stock:</label>
            <input
              type="number"
              id="stock"
              value={stock}
              onChange={(e) => setStock(Math.max(0, e.target.value))} 
              min="0"
              inputMode="numeric"  
              required
            />

            <label htmlFor="rating">Rating:</label>
            <input
              type="number"
              id="rating"
              value={rating}
              onChange={(e) => setRating(Math.min(5, Math.max(0, e.target.value)))} 
              min="0"
              max="5"
              step="0.1"
              required
            />
            
            <label htmlFor="category">Categoría:</label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              required
            >
              <option value="">Selecciona una categoría</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
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
