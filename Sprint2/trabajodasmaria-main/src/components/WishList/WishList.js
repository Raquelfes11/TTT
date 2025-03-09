import React, { useEffect, useState } from 'react';
import styles from "./WishList.module.css"; // Asegúrate de que la importación sea correcta

function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    const storedWishlist = JSON.parse(localStorage.getItem("wishlist")) || []; // Obtener wishlist desde localStorage
    setWishlistItems(storedWishlist); // Establecer los productos en el estado
  }, []);

  return (
    <div className={styles.wishlist}> {/* Usar styles.wishlist */}
      <h2 className={styles.h2WishlistPage}>Lista de Deseos</h2> {/* Usar styles.h2WishlistPage */}
      {wishlistItems.length > 0 ? (
        <div className={styles.wishlistItems}> {/* Usar styles.wishlistItems */}
          {wishlistItems.map((item, index) => (
            <div className={styles.wishlistItem} key={index}> {/* Usar styles.wishlistItem */}
              <img src={item.thumbnail} alt={item.title} />
              <h3>{item.title}</h3>
              <p>Precio: ${item.price}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No hay productos en la lista de deseos.</p>
      )}
    </div>
  );
}

export default Wishlist;

