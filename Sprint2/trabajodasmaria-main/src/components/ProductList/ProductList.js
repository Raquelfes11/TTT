import React from 'react';
import { Link } from 'react-router-dom'; 
import styles from "./ProductList.module.css"

function ProductList({ filteredProducts }) {

  const addToCart = (product) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || []; 
    cart.push(product); 
    localStorage.setItem("cart", JSON.stringify(cart)); 
    alert("Producto añadido al carrito");
  };
  
  const addToWishlist = (product) => {
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || []; 
    wishlist.push(product); 
    localStorage.setItem("wishlist", JSON.stringify(wishlist)); 
    alert("Producto añadido a la wishlist");
  };

  return (
    <div className="product-list">
      <h2>Lista de Productos</h2>
      {filteredProducts.length > 0 ? (
        <div className="product-gallery">
          {filteredProducts.map((product) => (
            <div className="product-card" key={product.id}>
              <img src={product.thumbnail} alt={product.title} />
              <h3>{product.title}</h3>
              <p>Precio: ${product.price}</p>
              <Link to={`/products/${product.id}`}>
                <button className="btn-more">Ver más</button>
              </Link>
              <button className="btn-wishlist" onClick={() => addToWishlist(product)}>Añadir a wishlist</button>
              <button className="btn-wishlist" onClick={() => addToCart(product)}>Añadir al carrito</button>
            </div>
          ))}
        </div>
      ) : (
        <p>No se encontraron productos que coincidan con la búsqueda.</p>
      )}
    </div>
  );
}

export default ProductList;
