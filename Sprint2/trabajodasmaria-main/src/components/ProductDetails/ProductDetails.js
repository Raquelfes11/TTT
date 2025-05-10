import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './ProductDetails.module.css';

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [pujaAmount, setPujaAmount] = useState('');
  const [isPujaModalOpen, setIsPujaModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isPujaInProgress, setIsPujaInProgress] = useState(false); 
  const [userRating, setUserRating] = useState(0);
  const [ratingId, setRatingId] = useState(null); 
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

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
          const sortedBids = data.bids.sort((a, b) => b.price - a.price);
          setProduct({...data, bids: sortedBids});

          // Si hay una puja almacenada en localStorage, agregarla
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
      setIsPujaInProgress(true); 
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

      if (response.ok) {
        alert("Has pujado por este producto");
        setIsPujaInProgress(false); 
        setIsPujaModalOpen(false); 
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
    setIsPujaInProgress(false); 
    setIsPujaModalOpen(false); 
  };

  const fetchUserRating = async () => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) return;

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/auctions/${id}/ratings/my/`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const rating = await response.json();
        setUserRating(rating.rating);
        setRatingId(rating.id);

        // Guardar la valoración y su ID en localStorage
        localStorage.setItem('userRating', JSON.stringify({ rating: rating.rating, id: rating.id }));
      } else {
        setUserRating(0);
        setRatingId(null);
      }
    } catch (error) {
      console.error("Error al obtener tu rating:", error);
    }
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/auctions/${id}/comments/`);
        if (response.ok) {
          const data = await response.json();
          console.log("Comentarios cargados:", data);
          setComments(data);
        } else {
          console.error("Error al obtener comentarios");
        }
      } catch (error) {
        console.error("Error de red al obtener comentarios:", error);
      }
    };
  
    fetchComments();
  }, [id]);

  // Enviar un nuevo comentario
  const handleSubmitComment = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      alert("Por favor, inicia sesión para poder comentar.");
      return;
    }

    const user = JSON.parse(localStorage.getItem('user')); 

    if (!newComment.trim()) {
      alert("Por favor, escribe un comentario.");
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/auctions/${id}/comments/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          title: "Comentario",
          text: newComment,
        }),
      });

      if (response.ok) {
        const newCommentData = await response.json();
        console.log("Nuevo comentario recibido:", newCommentData);
        setComments(prev => Array.isArray(prev) ? [...prev, newCommentData] : [newCommentData]);
        setNewComment(''); // limpia el input
        alert("Comentario enviado!");
      } else {
        const errorData = await response.json();
        console.error("Error al agregar comentario:", errorData);
        // alert("Hubo un error al enviar tu comentario");
        alert(errorData.detail || JSON.stringify(errorData) || "Hubo un error al enviar tu comentario");
      }
    } catch (error) {
      console.error("Error al enviar el comentario:", error);
    }
  };
  

  const StarRating = ({ rating, onChange }) => {
    const stars = [1, 2, 3, 4, 5];

    return (
      <div className={styles.starRating}>
        {stars.map((star) => (
          <span
            key={star}
            onClick={() => onChange(star)}
            style={{ color: star <= rating ? '#ffd700' : '#ccc' }}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  useEffect(() => {
    // Revisar el localStorage para persistir la valoración cuando la página se recarga
    const storedRating = JSON.parse(localStorage.getItem('userRating'));
    if (storedRating) {
      setUserRating(storedRating.rating);
      setRatingId(storedRating.id);
    }

    fetchUserRating();
  }, [id]);  

  const handleRatingChange = async (newRating) => {
    const accessToken = localStorage.getItem('accessToken');
    const user = JSON.parse(localStorage.getItem('user'));

    const method = ratingId ? 'PUT' : 'POST';
    const endpoint = ratingId
      ? `http://127.0.0.1:8000/api/auctions/${id}/ratings/${ratingId}/`
      : `http://127.0.0.1:8000/api/auctions/${id}/ratings/`;

    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          rating: newRating,
          user: user.user.id,
          auction: parseInt(id),
        }),
      });

      if (response.ok) {
        alert("Valoración registrada");
        setUserRating(newRating);
        if (!ratingId) {
          const newData = await response.json();
          setRatingId(newData.id);
          localStorage.setItem('userRating', JSON.stringify({ rating: newRating, id: newData.id }));
        }
      } else {
        const data = await response.json();
        console.error("Error al valorar:", data);
        alert("Ya valoraste o hubo un error");
      }
    } catch (error) {
      console.error("Error al enviar la valoración:", error);
    }
  };

  const handleDeleteRating = async () => {
    const accessToken = localStorage.getItem("accessToken");

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/auctions/${id}/ratings/${ratingId}/`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        alert("Valoración eliminada");
        setUserRating(0);
        setRatingId(null);
        localStorage.removeItem('userRating'); // Eliminar la valoración del localStorage
      } else {
        alert("Error al eliminar la valoración");
      }
    } catch (error) {
      console.error("Error al eliminar la valoración:", error);
    }
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
                <li><strong>Rating:</strong> {product.average_rating }</li>
                <li><strong>Fecha de creación:</strong> {product.creation_date}</li>
                <li><strong>Fecha de cierre:</strong> {product.closing_date}</li>
              </ul>
              <div className={styles.auctioneerInfo}>
                <h4>Subastador:</h4>
                <p>{product.auctioneer}</p>
              </div>
              <div className={styles.ratingSection}>
                <StarRating rating={userRating} onChange={handleRatingChange} />
                {ratingId && (
                  <button className={styles.deleteRating} onClick={handleDeleteRating}>
                    Eliminar valoración
                  </button>
                )}
              </div>
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

            {/* Sección de comentarios */}
            <div className={styles.commentsSection}>
              <h3>Comentarios</h3>

              {/* Formulario de comentario si el usuario está autenticado */}
              {isAuthenticated && (
                <form onSubmit={handleSubmitComment} className={styles.commentForm}>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Escribe tu comentario"
                    rows="3"
                    className={styles.commentInput}
                  />
                  <button type="submit" className={styles.commentButton}>Enviar Comentario</button>
                </form>
              )}

              {/* Mostrar los comentarios */}
              {comments.length > 0 ? (
                <ul className={styles.commentList}>
                  {comments.map((comment) => (
                    <li key={comment.id} className={styles.commentItem}>
                      <strong>{comment.user}</strong>: {comment.text}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={styles.noComments}>No hay comentarios aún.</p>
              )}
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
