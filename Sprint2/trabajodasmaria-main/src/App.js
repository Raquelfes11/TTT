import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import HeroMessage from './components/HeroMessage/HeroMessage';
import Navigation from './components/Navigation/Navigation';
import Footer from './components/Footer/Footer';
import LoginForm from './app/login/page';
import RegisterForm from './app/register/page';
import ProductList from './components/ProductList'; // Importa el componente que muestra los productos
import ProductDetails from './components/ProductDetails/ProductDetails';
import ProductSearch from './components/ProductSearch'; // Importa el componente de búsqueda
import UserDetails from './components/UserDetails'; // Nueva página para mostrar el detalle del usuario
import Cart from './components/Cart/Cart'; // Importa la página del carrito
import Wishlist from './components/WishList/WishList'; // Importa la página de wishlist
import './styles.css';

function App() {
  const [products, setProducts] = useState([]); // Lista de productos
  const [filteredProducts, setFilteredProducts] = useState([]); // Productos filtrados
  const [user, setUser] = useState(null); // Estado para almacenar la información del usuario

  // Obtener los productos desde la API DummyJSON cuando el componente se monta
  useEffect(() => {
    fetch("https://dummyjson.com/products")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data.products);
        setFilteredProducts(data.products);
      })
      .catch((error) => {
        console.error("Error al cargar los productos:", error);
      });

    // Verificar si el usuario ya está autenticado (esto es donde el GET se produce)
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      // Si encontramos un usuario en el almacenamiento local, lo asignamos al estado
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <Router>
      <div id="home-page">
        <Header user={user} onLogout={handleLogout} /> {/* Pasamos el estado del usuario */}
        <Navigation
          products={products}
          setFilteredProducts={setFilteredProducts}
          user={user} // Pasamos el usuario a la navegación
          onLogout={handleLogout} // Pasamos la función de logout
        />
        <Routes>
          {/* Ruta de inicio */}
          <Route path="/" element={<HeroMessage />} />

          {/* Rutas de autenticación */}
          <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
          <Route path="/register" element={<RegisterForm onLogin={handleLogin} />} />

          {/* Ruta para la lista de productos filtrados */}
          <Route path="/product-list" element={<ProductList filteredProducts={filteredProducts} />} />

          {/* Ruta para los detalles de un producto específico */}
          <Route path="/products/:id" element={<ProductDetails />} />

          {/* Rutas para el carrito y wishlist */}
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />

          {/* Ruta de búsqueda de productos */}
          <Route path="/search" element={<ProductSearch products={products} setFilteredProducts={setFilteredProducts} />} />

          {/* Ruta para los detalles del usuario */}
          <Route path="/usuario" element={<UserDetails user={user} />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
