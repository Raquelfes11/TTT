import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Navigation.module.css';  // Importar las clases CSS

function Navigation({ products, setFilteredProducts, user }) {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product =>
        product.title && product.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
    navigate('/product-list');
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <nav className={styles['main-navigation']}>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/cart">Pujas</a></li>
        <li><a href="/wishlist"> WishList</a></li>
      </ul>
      <form onSubmit={handleSearchSubmit} className={styles['search-form']}>
        <input
          type="text"
          placeholder="Buscar productos..."
          name="search"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <button type="submit">Buscar</button>
      </form>
    </nav>
  );
}

export default Navigation;

