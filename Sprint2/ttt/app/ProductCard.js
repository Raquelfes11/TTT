// app/components/ProductCard.js
import styles from "../page.module.css";

export default function ProductCard({ product }) {
  return (
    <section className={styles.productCard}>
      <img src={product.thumbnail} alt={product.title} />
      <h3>{product.title}</h3>
      <p>Precio: ${product.price}</p>
      <button className={styles.btnMore}>Saber más</button>
      <button className={styles.btnWishlist}>Añadir a Wishlist</button>
    </section>
  );
}
