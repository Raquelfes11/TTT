import React from 'react';
import { Link } from 'react-router-dom';
import logoImg from "../../assets/imgs/logo.png";
import styles from "./Header.module.css"

function Header({ user, onLogout }) {
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
                <button onClick={onLogout}>Logout</button>
              </li>
              <li>
                <Link to="/usuario">Hola, {user.username}</Link>
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




