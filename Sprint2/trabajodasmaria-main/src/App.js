import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';  
import { Route, Routes } from 'react-router-dom';  
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
import MisPujas from './components/MisPujas/MisPujas'; 
import MisSubastas from './components/MisSubastas/MisSubastas';
import CrearSubasta from './components/CrearSubasta/CrearSubasta';
import EditarSubasta from './components/EditarSubasta/EditarSubasta'; 
import ChangePassword from './components/ChangePassword/ChangePassword';
import EditarDetallesUsuario from './components/EditarUserDetails/EditarUserDetails';
import './styles.css';

function App() {
  const [products, setProducts] = useState([]); 
  const [filteredProducts, setFilteredProducts] = useState([]); 
  const [user, setUser] = useState(null); 

  useEffect(() => {
    const fetchAllProducts = async () => {
      let allProducts = [];
      let url = 'http://127.0.0.1:8000/api/auctions/';
  
      try {
        while (url) {
          const response = await fetch(url);
          const data = await response.json();
          allProducts = [...allProducts, ...data.results];
          url = data.next; 
        }
        setProducts(allProducts);
        setFilteredProducts(allProducts);
      } catch (error) {
        console.error("Error al cargar los productos desde el backend:", error);
      }
    };
  
    fetchAllProducts();

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const navigate = useNavigate();  

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
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
        <Route path="/MisPujas" element={<MisPujas />} user={user} />
        <Route path="/search" element={<ProductSearch products={products} setFilteredProducts={setFilteredProducts} />} />
        <Route path="/usuario" element={user ? <UserDetails user={user} /> : <Navigate to="/login" />} />
        <Route path="/crear-subasta" element={<CrearSubasta />} user={user} />
        <Route path="/mis-subastas" element={<MisSubastas user={user} />} />
        <Route path="/editar-subasta/:id" element={<EditarSubasta user={user} />} /> 
        <Route path="/ChangePassword" element={<ChangePassword user={user} />} />
        <Route path="/change-users-details" element={<EditarDetallesUsuario user={user} />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
