// app/components/Header.js
import Link from "next/link";
import SearchBar from "./SearchBar";

export default function Header({ handleSearch }) {
  return (
    <header>
      <section className="header-container">
        <section className="logo-container">
          <Link href="/">
            <img src="/imgs/logo.png" alt="Logo" />
          </Link>
        </section>
        <nav className="auth-links">
          <ul>
            <li><Link href="/log_in">Log In</Link></li>
            <li><Link href="/register">Sign up</Link></li>
          </ul>
        </nav>
      </section>
      <nav className="main-navigation">
        <ul>
          <li><Link href="/">Home</Link></li>
          <li><Link href="/my_account">My Account</Link></li>
          <li><Link href="/wishlist">Wishlist</Link></li>
          <li><Link href="/cart">Shopping Cart</Link></li>
        </ul>
        <SearchBar handleSearch={handleSearch} />
      </nav>
    </header>
  );
}
