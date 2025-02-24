"use client"; // Para que Next.js trate esto como un componente interactivo
import { useEffect, useState } from "react";
import Link from "next/link";
import Hero from "./components/Slogan/page";
import ProductCard from "./components/ProductCard";
import styles from "./styles/page.module.css";

export default function Page() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("https://dummyjson.com/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products);
        setFilteredProducts(data.products); // Mostrar todos al inicio
      });
  }, []);

  const handleSearch = (event, query) => {
    event.preventDefault();
    const searchTerm = query.trim().toLowerCase();
    if (searchTerm === "") {
      setFilteredProducts(products); // Mostrar todo si el input está vacío
    } else {
      const filtered = products.filter((product) =>
        product.title.toLowerCase().includes(searchTerm)
      );
      setFilteredProducts(filtered);
    }
  };

  return (
    <main id="main-home-page">
      <Hero />
      <section className={styles.productGallery}>
        <h1>Resultados de la búsqueda</h1>
        <div className={styles.grid}>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <p>No se encontraron productos</p>
          )}
        </div>
      </section>
    </main>
  );
}
