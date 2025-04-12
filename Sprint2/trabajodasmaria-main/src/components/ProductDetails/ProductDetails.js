import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './ProductDetails.module.css'; 

function ProductDetail() {
  const { id } = useParams(); 
  const [product, setProduct] = useState(null);
  const [pujaAmount, setPujaAmount] = useState('');
  const [isPujaModalOpen, setIsPujaModalOpen] = useState(false);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        //const response = await fetch(`https://dummyjson.com/products/${id}`);
        const response = await fetch(`http://127.0.0.1:8000/api/auctions/${id}/`);
        if (response.ok) {
          const data = await response.json();
          setProduct(data); // Establecemos el producto en el estado
        } else {
          console.error("No se pudo obtener el producto");
        }
      } catch (error) {
        console.error("Error al obtener el producto:", error);
      }
    };

    fetchProductDetails();
  }, [id]); 

  // Maneja la apertura y cierre del modal
  const handlePujar = () => {
    if (product.stock > 0) {
      setIsPujaModalOpen(true); // Muestra el formulario para pujar
    } else {
      alert("Este producto está agotado");
    }
  };

  // Función que guarda la puja en el localStorage
  const handleConfirmPuja = () => {
    if (pujaAmount <= 0 || isNaN(pujaAmount)) {
      alert("Por favor, ingresa una cantidad válida para pujar.");
      return;
    }

    let pujas = JSON.parse(localStorage.getItem("misPujas")) || [];
    pujas.push({
      ...product,
      pujaAmount: parseFloat(pujaAmount), // Guarda la cantidad que se puja
    });
    localStorage.setItem("misPujas", JSON.stringify(pujas));
    setIsPujaModalOpen(false); // Cierra el modal
    alert("Has pujado por este producto");
  };

  const addToPujas = (product) => {
    if (product.stock > 0) {
      let pujas = JSON.parse(localStorage.getItem("misPujas")) || [];
      pujas.push(product);
      localStorage.setItem("misPujas", JSON.stringify(pujas));
      alert("Has pujado por este producto");
    } else {
      alert("Este producto está agotado");
    }
  };

  const addToWishlist = (product) => {
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    wishlist.push(product);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    alert("Producto añadido a la wishlist");
  };

  return (
    <div className={styles.productDetails}>
      {product ? (
        <div className={styles.productDetailContent}>
          <div className={styles.mainImage}>
            <img src={product.image || product.thumbnail} alt={product.title} />
          </div>
          
          <div className={styles.productInfo}>
            <div className={styles.productDescription}>
              <h2>{product.title}</h2>
              <h3>Descripción:</h3>
              <p>{product.description}</p>
              <ul>
                <li><strong>Precio inicial:</strong> ${product.price}</li>
                <li><strong>Stock:</strong> {product.stock}</li>
                <li><strong>Marca:</strong> {product.brand}</li>
                <li><strong>Categoría:</strong> {product.category?.name || product.category}</li>
                <li><strong>Rating:</strong> {product.rating}</li>
                <li><strong>Fecha de creación:</strong> {product.creation_date}</li>
                <li><strong>Fecha de cierre:</strong> {product.closing_date}</li>
              </ul>
            </div>
          </div>

          <div className={styles.actionButtons}>
            <button className={styles.btnWishlist} onClick={() => addToWishlist(product)}>
              Añadir a wishlist
            </button>
            {product.isOpen ? (
                <button 
                  className={styles.btnPujas} 
                  // onClick={() => addToPujas(product)}
                  onClick = {handlePujar}
                  disabled={product.stock <= 0}
                >
                  Pujar
                </button>
              ) : (
                <p className={styles.inactiveAuction}>Puja no disponible</p>
              )}
          </div>
          {/* Modal de Puja */}
          {isPujaModalOpen && (
            <div className={styles.pujaModal}>
              <div className={styles.modalContent}>
                <h3>Ingresa la cantidad por la que deseas pujar</h3>
                <input
                  type="number"
                  value={pujaAmount}
                  onChange={(e) => setPujaAmount(e.target.value)}
                  placeholder="Cantidad de puja"
                  min="1"
                  required
                />
                <button onClick={handleConfirmPuja}>Confirmar Pujas</button>
                <button onClick={() => setIsPujaModalOpen(false)}>Cancelar</button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <p>Cargando detalles del producto...</p>
      )}
    </div>
  );
}

export default ProductDetail;
