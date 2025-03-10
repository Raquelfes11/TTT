import React, { useEffect, useState } from 'react';
import styles from './Cart.module.css'; 

function Cart() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || []; 
    setCartItems(storedCart); 
  }, []);

  const removeItemFromCart = (index) => {
    const updatedCart = [...cartItems];
    updatedCart.splice(index, 1);
    setCartItems(updatedCart); 
    localStorage.setItem("cart", JSON.stringify(updatedCart)); 
  };

  return (
    <div className={styles.cart}>
      <h2 className={styles['h2-cart-page']}>Pujas Realizadas</h2>
      {cartItems.length > 0 ? (
        <div className={styles['cart-items']}>
          {cartItems.map((item, index) => (
            <div className={styles['cart-item']} key={index}>
              <img src={item.thumbnail} alt={item.title} />
              <h3>{item.title}</h3>
              <p>Precio: ${item.price}</p>
              <button 
                className={styles['btn-remove']} 
                onClick={() => removeItemFromCart(index)}
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>No hay productos en el carrito.</p>
      )}
    </div>
  );
}

export default Cart;


