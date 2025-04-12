import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logoImg from "../../assets/imgs/logo.png";

function Header() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser)); 
    }
  }, []);

  return (
    <header>
      <section className="header-container">
        <section className="logo-container">
          <Link to="/"><img src={logoImg} alt="Logo" /></Link>
        </section>
        <nav className="auth-links">
          {user ? (
            <ul>
              <li>
                <Link to="/usuario">Hola, {user.user.username}</Link>
              </li>
            </ul>
          ) : (
            <ul>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
            </ul>
          )}
        </nav>
      </section>
    </header>
  );
}

export default Header;






