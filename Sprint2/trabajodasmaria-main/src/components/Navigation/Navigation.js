import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Navigation.module.css';

function Navigation({ products, setFilteredProducts }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null); 
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser)); 
    }

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
      filtered = filtered.filter(product => product.category === parseInt(categoryFilter)); 
    }
    
    setFilteredProducts(filtered);
    navigate('/product-list');
  };

  const handleLogout = async () => {
    const accessToken = localStorage.getItem('accessToken');
    const user = JSON.parse(localStorage.getItem('user'));  
    const refreshToken = user ? user.refresh : null; 

  
    if (!refreshToken) {
      alert('No se encontró el refresh token. Por favor, inicie sesión nuevamente.');
      return;
    }
  
    try {
      const response = await fetch('http://127.0.0.1:8000/api/users/log-out/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${accessToken}`, 
        },
        body: JSON.stringify({ refresh: refreshToken })  
      });
  
      if (response.ok) {

        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('username');
        localStorage.removeItem('subastas');
        localStorage.removeItem('misPujas');
        setUser(null); 
        navigate('/');
        window.location.reload(); 
      } else {
        const errorData = await response.json();
        alert('Error al cerrar sesión. Intenta de nuevo.');
      }
    } catch (error) {
      alert('Hubo un problema con la conexión al servidor. Intenta de nuevo.');
    }
  };

  return (
    <nav className={styles['main-navigation']}>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/misPujas">Mis Pujas</a></li>

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
          {categories.map(category => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
        <button type="submit">Buscar</button>
      </form>
    </nav>
  );
}

export default Navigation;