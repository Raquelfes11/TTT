import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';  // Importa correctamente 'Navigate'
import { Route, Routes } from 'react-router-dom';  // No es necesario BrowserRouter aquí
import Header from './components/Header/Header';
import HeroMessage from './components/HeroMessage/HeroMessage';
import Navigation from './components/Navigation/Navigation';
import Footer from './components/Footer/Footer';
import LoginForm from './app/login/page';
import RegisterForm from './app/register/page';
import ProductList from './components/ProductList/ProductList';
import ProductDetails from './components/ProductDetails/ProductDetails';
import ProductSearch from './components/ProductSearch/ProductSearch'; 
import UserDetails from './components/UserDetails/UserDetails';
import Cart from './components/Cart/Cart'; 
import Wishlist from './components/WishList/WishList'; 
import MisSubastas from './components/MisSubastas/MisSubastas';
import CrearSubasta from './components/CrearSubasta/CrearSubasta';
import EditarSubasta from './components/EditarSubasta/EditarSubasta'; 
import './styles.css';

function App() {
  const [products, setProducts] = useState([]); 
  const [filteredProducts, setFilteredProducts] = useState([]); 
  const [user, setUser] = useState(null); 

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

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const navigate = useNavigate();  // Aquí ya es válido

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('username');
    navigate('/');
    window.location.reload();
  };

  return (
    <div id="home-page">
      <Header user={user} onLogout={handleLogout} /> 
      <Navigation
        products={products}
        setFilteredProducts={setFilteredProducts}
        user={user} 
        onLogout={handleLogout} 
      />
      <Routes>
        <Route path="/" element={<HeroMessage />} />
        <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
        <Route path="/register" element={<RegisterForm onLogin={handleLogin} />} />
        <Route path="/product-list" element={<ProductList filteredProducts={filteredProducts} />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/search" element={<ProductSearch products={products} setFilteredProducts={setFilteredProducts} />} />
        <Route path="/usuario" element={user ? <UserDetails user={user} /> : <Navigate to="/login" />} />
        <Route path="/crear-subasta" element={<CrearSubasta />} user={user} />
        <Route path="/mis-subastas" element={<MisSubastas user={user} />} />
        <Route path="/editar-subasta/:id" element={<EditarSubasta user={user} />} /> 
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
