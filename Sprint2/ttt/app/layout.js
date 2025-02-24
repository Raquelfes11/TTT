import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <title>Motos</title>
        <link rel="icon" type="image/x-icon" href="/favicon.webp" />
      </head>
      <body>
        <header className="header">
          <section className="header-container">
            <section className="logo-container">
              <a href="/">
                <img src="/imgs/logo.png" alt="Logo" />
              </a>
            </section>
            <nav className="auth-links">
              <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/my_account">My Account</a></li>
                <li><a href="/">Wishlist</a></li>
                <li><a href="/cart">Shopping Cart</a></li>
              </ul>
            </nav>
          </section>
          <nav className="main-motos">
            <input type="text" placeholder="Buscar productos..." id="search-input" />
            <button>Buscar</button>
          </nav>
        </header>

        <main>{children}</main>

        <footer>
          <p>Creado por <strong>Raquel</strong> y <strong>María</strong> - <em>2025</em></p>
        </footer>
      </body>
    </html>
  );
}
