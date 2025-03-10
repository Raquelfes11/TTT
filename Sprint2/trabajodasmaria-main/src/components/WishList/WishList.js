import React, { useEffect, useState } from 'react';
import styles from "./WishList.module.css"; 

function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    const storedWishlist = JSON.parse(localStorage.getItem("wishlist")) || []; 
    setWishlistItems(storedWishlist); 
  }, []);

  return (
    <div className={styles.wishlist}>
      <h2 className={styles.h2WishlistPage}>Lista de Deseos</h2> 
      {wishlistItems.length > 0 ? (
        <div className={styles.wishlistItems}> 
          {wishlistItems.map((item, index) => (
            <div className={styles.wishlistItem} key={index}> 
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

