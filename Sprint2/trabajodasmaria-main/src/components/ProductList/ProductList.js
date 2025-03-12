import React from 'react';
import { Link } from 'react-router-dom';
import styles from './ProductList.module.css';

function ProductList({ filteredProducts }) {
  
  const addToWishlist = (product) => {
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    wishlist.push(product);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    alert("Producto añadido a la wishlist");
  };

  return (
    <div className={styles['product-list']}>
      <h2>Lista de Productos</h2>
      {filteredProducts.length > 0 ? (
        <div className={styles['product-gallery']}>
          {filteredProducts.map((product) => (
            <div className={styles['product-card']} key={product.id}>
              <img src={product.thumbnail} alt={product.title} />
              <h3>{product.title}</h3>
              <p>Precio: ${product.price}</p>
              <Link to={`/products/${product.id}`}>
                <button className={styles['btn-more']}>Ver más</button>
              </Link>
              <button className={styles['btn-wishlist']} onClick={() => addToWishlist(product)}>Añadir a wishlist</button>
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

