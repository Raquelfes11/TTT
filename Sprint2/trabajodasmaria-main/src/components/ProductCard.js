// components/ProductCard.jsx
import React from 'react';
import { Link } from 'react-router-dom'; 

function ProductCard({ product }) {
  return (
    <div className="product-card">
      <img src={product.thumbnail} alt={product.title} />
      <h3>{product.name}</h3>
      <p>Precio: ${product.price}</p>
      <Link href={`/products/${product.id}`}>
      <button className="btn-more">Ver más</button>
      </Link>
      <button className="btn-wishlist">Añadir a favoritos</button>
    </div>
  );
}

export default ProductCard;
