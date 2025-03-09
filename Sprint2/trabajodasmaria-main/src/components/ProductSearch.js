import { useState, useEffect } from "react";

export default function ProductSearch({ setFilteredProducts }) {
  const [searchTerm, setSearchTerm] = useState(""); // Término de búsqueda
  const [products, setProducts] = useState([]); // Lista de productos
  const [filtered, setFiltered] = useState([]); // Productos filtrados
  const [noResults, setNoResults] = useState(false); // Indica si no hay resultados

  // Obtener productos desde la API de DummyJSON
  useEffect(() => {
    fetch("https://dummyjson.com/products") // Endpoint para obtener todos los productos
      .then((response) => response.json())
      .then((data) => {
        if (data.products && Array.isArray(data.products)) {
          console.log("Productos obtenidos:", data.products); // Debug: Ver qué productos se reciben
          setProducts(data.products);
          setFiltered(data.products); // Inicialmente mostrar todos los productos
        }
      })
      .catch((error) => {
        console.error("Error al cargar los productos:", error);
      });
  }, []);

  // Función que se ejecuta al escribir en el input
  const handleSearchChange = (e) => {
    const term = e.target.value.trim().toLowerCase(); // Eliminar espacios extra
    setSearchTerm(term);

    if (term === "") {
      setFiltered(products);
      setNoResults(false);
    } else {
      const filteredProducts = products.filter((product) =>
        product.title && typeof product.title === "string"
          ? product.title.trim().toLowerCase().includes(term)
          : false
      );

      console.log("Productos filtrados:", filteredProducts); // Debug: Ver los productos que pasan el filtro

      setFiltered(filteredProducts);
      setNoResults(filteredProducts.length === 0);
    }
  };

  // Actualizar los productos filtrados en el estado principal
  useEffect(() => {
    setFilteredProducts(filtered);
  }, [filtered, setFilteredProducts]);

  return (
    <div>
      <h1>Buscar Productos</h1>
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Buscar producto..."
      />
      {noResults && <p>No hay productos que coincidan con la búsqueda.</p>}
    </div>
  );
}