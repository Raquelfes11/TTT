import React, { useState, useEffect } from "react";
import ProductList from './ProductList';

export default function ProductSearch() {
  const [searchTerm, setSearchTerm] = useState(""); // Término de búsqueda
  const [minPrice, setMinPrice] = useState(""); // Precio mínimo
  const [maxPrice, setMaxPrice] = useState(""); // Precio máximo
  const [products, setProducts] = useState([]); // Lista de productos
  const [filteredProducts, setFilteredProducts] = useState([]); // Productos filtrados
  const [noResults, setNoResults] = useState(false); // Indica si no hay resultados

  // Obtener productos desde la API de DummyJSON
  useEffect(() => {
    fetch("https://dummyjson.com/products") // Endpoint para obtener todos los productos
      .then((response) => response.json())
      .then((data) => {
        if (data.products && Array.isArray(data.products)) {
          setProducts(data.products);
          setFilteredProducts(data.products); // Inicialmente mostrar todos los productos
        }
      })
      .catch((error) => {
        console.error("Error al cargar los productos:", error);
      });
  }, []);

  // Función para filtrar productos por nombre y precio
  const filterProducts = () => {
    const filtered = products.filter((product) => {
      const matchesSearchTerm =
        product.title.toLowerCase().startsWith(searchTerm.toLowerCase());

      const matchesMinPrice = minPrice ? product.price >= minPrice : true;
      const matchesMaxPrice = maxPrice ? product.price <= maxPrice : true;

      return matchesSearchTerm && matchesMinPrice && matchesMaxPrice;
    });

    setFilteredProducts(filtered);
    setNoResults(filtered.length === 0); // Si no hay productos, mostramos mensaje
  };

  // Detectar cambio en el término de búsqueda
  const handleSearchChange = (e) => {
    const term = e.target.value.trim().toLowerCase();
    setSearchTerm(term);
    filterProducts(); // Filtramos cada vez que cambia el término de búsqueda
  };

  // Detectar cambio en el precio mínimo
  const handleMinPriceChange = (e) => {
    const value = e.target.value;
    setMinPrice(value);
    filterProducts(); // Filtramos cada vez que cambia el precio mínimo
  };

  // Detectar cambio en el precio máximo
  const handleMaxPriceChange = (e) => {
    const value = e.target.value;
    setMaxPrice(value);
    filterProducts(); // Filtramos cada vez que cambia el precio máximo
  };

  return (
    <div>
      <h1>Buscar Productos</h1>
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Buscar por nombre..."
      />
      <br />
      <input
        type="number"
        value={minPrice}
        onChange={handleMinPriceChange}
        placeholder="Precio mínimo"
      />
      <input
        type="number"
        value={maxPrice}
        onChange={handleMaxPriceChange}
        placeholder="Precio máximo"
      />
      <br />
      <button onClick={filterProducts}>Aplicar Filtros</button>

      {noResults && <p>No hay productos que coincidan con la búsqueda.</p>}

      {/* Pasamos los productos filtrados a ProductList */}
      <ProductList filteredProducts={filteredProducts} />
    </div>
  );
}
