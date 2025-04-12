import React, { useEffect, useState } from 'react';
import styles from './MisPujas.module.css'; 

function MisPujas() {
  const [pujasItems, setPujasItems] = useState([]);

  useEffect(() => {
    const storedPujas = JSON.parse(localStorage.getItem("misPujas")) || []; 
    setPujasItems(storedPujas); 
  }, []);

  const removeItemFromPujas = (index) => {
    const updatedPujas = [...pujasItems];
    updatedPujas.splice(index, 1);
    setPujasItems(updatedPujas); 
    localStorage.setItem("misPujas", JSON.stringify(updatedPujas)); 
  };

  return (
    <div className={styles.pujas}>
      <h2 className={styles['h2-pujas-page']}>Pujas Realizadas</h2>
      {pujasItems.length > 0 ? (
        <div className={styles['pujas-items']}>
          {pujasItems.map((item, index) => (
            <div className={styles['pujas-item']} key={index}>
              <img src={item.thumbnail} alt={item.title} />
              <h3>{item.title}</h3>
              <p>Precio: ${item.price}</p>
              <p>Cantidad Puja: ${item.pujaAmount}</p> 
              <button 
                className={styles['btn-remove']} 
                onClick={() => removeItemFromPujas(index)}
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>No has realizado ninguna puja.</p>
      )}
    </div>
  );
}

export default MisPujas;


