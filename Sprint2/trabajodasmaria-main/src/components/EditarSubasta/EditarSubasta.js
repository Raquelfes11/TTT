import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './EditarSubasta.module.css'; 

function EditarSubasta({ user }) {
    const { id } = useParams(); 
    const [subasta, setSubasta] = useState(null);
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
              console.error('Error al obtener las categorías');
            }
          } catch (error) {
            console.error('Error de red al obtener las categorías:', error);
          }
        };
            
        const fetchSubasta = async () => {
          try {
            const response = await fetch(`http://127.0.0.1:8000/api/auctions/${id}/`);
            if (response.ok) {
              const data = await response.json();
              setSubasta(data);
              setTitle(data.title);
              setDescription(data.description);
              setStartPrice(data.price);  
              setStock(data.stock);
              setRating(data.rating);
              setBrand(data.brand);
              setSelectedCategory(data.category);  
              setImage(data.thumbnail);
              const formattedDate = new Date(data.closing_date).toISOString().split('T')[0]; 
              setEndDate(formattedDate); 
            } else {
              console.error('Error al obtener la subasta');
            }
          } catch (error) {
            console.error('Error de red al obtener la subasta:', error);
          }
        };
    
        fetchCategories();
        fetchSubasta();
      }, [id]);
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      const updatedSubasta = {
        title,
        description,
        closing_date: endDate,
        thumbnail: image,
        price: parseFloat(startPrice),
        stock: parseInt(stock),
        rating: parseFloat(rating),
        category: selectedCategory,
        brand,
      };

      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        alert('No se encuentra el token de acceso. Inicia sesión nuevamente.');
        return;
      }
  
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/auctions/${id}/`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify(updatedSubasta),
        });
  
        if (response.ok) {
          const result = await response.json();
          console.log('Subasta actualizada con éxito:', result);

          const existingSubastas = JSON.parse(localStorage.getItem('subastas')) || [];
          const updatedSubastas = existingSubastas.map(subasta =>
            subasta.id === result.id ? result : subasta
          );
          localStorage.setItem('subastas', JSON.stringify(updatedSubastas));
          navigate('/mis-subastas'); 
        } else {
          const errorData = await response.json();
          alert('Error al actualizar la subasta. Por favor, inténtalo de nuevo.');
        }
      } catch (error) {
        console.error('Error de red al actualizar la subasta:', error);
        alert('Error de servidor. Intenta de nuevo.');
      }
    };
  
    if (!subasta) {
      return <div>Cargando...</div>; 
    }
  
    return (
      <div className={styles['editar-subasta-page']}>
        <div className={styles['form-container']}>
          <div className={styles['form-box']}>
            <h2 className={styles['h2-subasta']}>Editar Subasta</h2>
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
  
              <button type="submit">Editar Subasta</button>
            </form>
          </div>
        </div>
      </div>
    );
  }
  
  export default EditarSubasta;