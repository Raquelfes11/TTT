import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Navigation.module.css';

function Navigation({ products, setFilteredProducts }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null); // Estado local para el usuario
  const navigate = useNavigate();

  // Verificar si hay un usuario en el localStorage cuando el componente se monta
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Establece el usuario desde el localStorage
    }
  }, []);

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
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('username');
    setUser(null); // Limpiar el estado local del usuario
    navigate('/');
    window.location.reload();
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
                <button onClick={() => navigate('/usuario')}>Perfil</button>
                <button onClick={handleLogout}>Cerrar sesión</button>
                <button onClick={() => navigate('/mis-subastas')}>Mis Subastas</button> 
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


