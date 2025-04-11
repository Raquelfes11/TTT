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

  const handleLogout = async () => {
    const accessToken = localStorage.getItem('accessToken');
    const user = JSON.parse(localStorage.getItem('user'));  // Convierte la cadena JSON a un objeto
    const refreshToken = user ? user.refresh : null;  // Accede al refreshToken de manera segura

  
    if (!refreshToken) {
      alert('No se encontró el refresh token. Por favor, inicie sesión nuevamente.');
      return;
    }
  
    try {
      const response = await fetch('http://127.0.0.1:8000/api/users/log-out/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Asegúrate de enviar el contenido en JSON
          'Authorization': `Bearer ${accessToken}`, // Esto sigue siendo útil para validar la sesión en el backend
        },
        body: JSON.stringify({ refresh: refreshToken })  // Enviar el refreshToken en el cuerpo de la solicitud
      });
  
      if (response.ok) {
        // Si la respuesta es exitosa, eliminar del localStorage
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('username');
        localStorage.removeItem('subastas');
        localStorage.removeItem('misPujas');
        setUser(null); // Limpiar el estado local del usuario
        navigate('/');
        window.location.reload(); // Recargar la página para limpiar cualquier estado adicional
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
        <li><a href="/MisPujas">Pujas</a></li>
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


