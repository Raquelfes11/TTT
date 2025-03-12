import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Navigation.module.css';  

function Navigation({ products, setFilteredProducts, user, setUser }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate(); // ✅ useNavigate() dentro de Navigation

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (priceFilter) {
      filtered = filtered.filter(product => product.price <= parseFloat(priceFilter));
    }

    if (categoryFilter) {
      filtered = filtered.filter(product => product.category === categoryFilter);
    }
    
    setFilteredProducts(filtered);
    navigate('/product-list');
  };

  const handleLogout = () => {
    navigate('/'); // ✅ Primero redirigir a Home
    setTimeout(() => {
      if (setUser) { 
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
      } else {
        console.error("Error: setUser no está definido");
      }
    }, 5);
  };

  return (
    <nav className={styles['main-navigation']}>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/cart">Pujas</a></li>
        <li><a href="/wishlist">WishList</a></li>

        {user && (
          <li className={styles.userMenu}>
            <button onClick={() => setMenuOpen(!menuOpen)}>
              Usuario ▼
            </button>
            {menuOpen && (
              <div className={styles.dropdownMenu}>
                <button onClick={() => navigate('/usuario')}>Perfil</button> {/* ✅ Redirige a perfil */}
                <button onClick={handleLogout}>Cerrar sesión</button>
                <button onClick={() => navigate('/crear-subasta')}>Crear subasta</button>
              </div>
            )}
          </li>
        )}
      </ul>

      <form onSubmit={handleSearchSubmit} className={styles['search-form']}>
        <input
          type="text"
          placeholder="Buscar productos..."
          name="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <input
          type="number"
          placeholder="Precio máximo"
          value={priceFilter}
          onChange={(e) => setPriceFilter(e.target.value)}
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">Todas las categorías</option>
          {Array.from(new Set(products.map(p => p.category))).map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        <button type="submit">Buscar</button>
      </form>
    </nav>
  );
}

export default Navigation;

