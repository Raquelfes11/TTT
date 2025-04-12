import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './ProductDetails.module.css';

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [pujaAmount, setPujaAmount] = useState('');
  const [isPujaModalOpen, setIsPujaModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isPujaInProgress, setIsPujaInProgress] = useState(false); // Nuevo estado

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (token) {
          setIsAuthenticated(true);
        }
  
        const response = await fetch(`http://127.0.0.1:8000/api/auctions/${id}/`);
        if (response.ok) {
          const data = await response.json();
          // Aseguramos que las pujas estén ordenadas de mayor a menor
          const sortedBids = data.bids.sort((a, b) => b.price - a.price);
          setProduct({...data, bids: sortedBids});
  
          const storedPujas = JSON.parse(localStorage.getItem("misPujas")) || [];
          const productPujas = storedPujas.filter(puja => puja.id === data.id);
          if (productPujas.length > 0) {
            data.bids = [...data.bids, ...productPujas];
          }
          setProduct(data);
        } else {
          console.error("No se pudo obtener el producto");
        }
      } catch (error) {
        console.error("Error al obtener el producto:", error);
      }
    };
  
    fetchProductDetails();
  }, [id]);

  const handlePujar = () => {
    if (product.stock > 0 && isAuthenticated) {
      setIsPujaInProgress(true); // Activa el estado de puja
      setIsPujaModalOpen(true);
    } else if (!isAuthenticated) {
      alert("Por favor, inicia sesión para poder pujar.");
    } else {
      alert("Este producto está agotado");
    }
  };

  const handleConfirmPuja = async (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem('user')); 

    if (pujaAmount <= 0 || isNaN(pujaAmount)) {
      alert("Por favor, ingresa una cantidad válida para pujar.");
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/auctions/${id}/bids/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          price: parseInt(pujaAmount, 10),
          auction_id: parseInt(id, 10),
          bidder: user.user.id,
        }),
      });

      console.log(parseInt(pujaAmount, 10), parseInt(id, 10), user.user.id)

      if (response.ok) {
        alert("Has pujado por este producto");
        setIsPujaInProgress(false); // Desactiva el estado de puja
        setIsPujaModalOpen(false); // Cierra el modal
      } else {
        const errorData = await response.json();
        console.error("Error en la puja:", errorData);
        alert(errorData.detail || "Hubo un error al registrar tu puja");
      }
    } catch (error) {
      console.error("Error al registrar la puja:", error);
    }
    window.location.reload();
  };

  const handleCancelPuja = () => {
    setIsPujaInProgress(false); // Desactiva el estado de puja
    setIsPujaModalOpen(false); // Cierra el modal
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

            <div className={styles.bidsSection}>
              <h3 className={styles.bidsTitle}>Historial de Pujas</h3>
              {product.bids && product.bids.length > 0 ? (
                <ul className={styles.bidList}>
                  {product.bids.map((bid) => (
                    <li key={bid.id} className={styles.bidItem}>
                      💰 <strong>{bid.price}€</strong> — 👤 {bid.bidder_username} — 🕒{" "}
                      {new Date(bid.creation_date).toLocaleString()}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={styles.noBids}>No hay pujas aún para este producto.</p>
              )}
            </div>
          </div>

          <div className={styles.actionButtons}>
            {!isPujaInProgress && (
              <>
                {product.isOpen ? (
                  <button 
                    className={styles.btnPujas} 
                    onClick={handlePujar}
                    disabled={product.stock <= 0 || !isAuthenticated}
                  >
                    Pujar
                  </button>
                ) : (
                  <p className={styles.inactiveAuction}>Puja no disponible</p>
                )}
              </>
            )}
          </div>

          {isPujaModalOpen && (
            <div className={styles.pujaModal}>
              <div className={styles.modalContent}>
                <form onSubmit={handleConfirmPuja} className={styles.pujaForm}>
                <h3>Ingresa la cantidad por la que deseas pujar</h3>
                  <input
                    type="number"
                    value={pujaAmount}
                    onChange={(e) => setPujaAmount(e.target.value)}
                    placeholder="Cantidad de puja"
                    min="1"
                    required
                  />
                  <div className={styles.formButtons}>
                    <button type="submit">Confirmar Pujas</button>
                    <button type="button" onClick={handleCancelPuja}>Cancelar</button>
                  </div>
                </form>
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
