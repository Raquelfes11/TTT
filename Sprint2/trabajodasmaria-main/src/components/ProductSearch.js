import { useState, useEffect } from "react";

export default function ProductSearch({ setFilteredProducts }) {
  const [searchTerm, setSearchTerm] = useState(""); // Término de búsqueda por nombre
  const [selectedCategory, setSelectedCategory] = useState(""); // Filtro de categoría
  const [minPrice, setMinPrice] = useState(""); // Filtro de precio mínimo
  const [maxPrice, setMaxPrice] = useState(""); // Filtro de precio máximo
  const [categories, setCategories] = useState([]); // Categorías disponibles
  const [products, setProducts] = useState([]); // Lista de productos
  const [filtered, setFiltered] = useState([]); // Productos filtrados
  const [noResults, setNoResults] = useState(false); // Indica si no hay resultados

  // Obtener productos y categorías desde la API de DummyJSON
  useEffect(() => {
    fetch("https://dummyjson.com/products") // Endpoint para obtener todos los productos
      .then((response) => response.json())
      .then((data) => {
        if (data.products && Array.isArray(data.products)) {
          console.log("Productos obtenidos:", data.products); // Debug: Ver qué productos se reciben
          setProducts(data.products);
          setFiltered(data.products); // Inicialmente mostrar todos los productos

          // Obtener categorías únicas de los productos
          const uniqueCategories = [
            ...new Set(data.products.map((product) => product.category)),
          ];
          setCategories(uniqueCategories);
        }
      })
      .catch((error) => {
        console.error("Error al cargar los productos:", error);
      });
  }, []);

  // Función que se ejecuta al escribir en el input de búsqueda
  const handleSearchChange = (e) => {
    const term = e.target.value.trim().toLowerCase(); // Eliminar espacios extra
    setSearchTerm(term);
    filterProducts(term, selectedCategory, minPrice, maxPrice);
  };

  // Filtrar productos según los filtros seleccionados
  const filterProducts = (term, category, min, max) => {
    const filteredProducts = products.filter((product) => {
      const matchesCategory = category ? product.category === category : true;
      const matchesPrice =
        (min === "" || product.price >= parseFloat(min)) &&
        (max === "" || product.price <= parseFloat(max));
      const matchesTitle = product.title
        ? product.title.toLowerCase().includes(term)
        : false;

      return matchesCategory && matchesPrice && matchesTitle;
    });

    setFiltered(filteredProducts);
    setNoResults(filteredProducts.length === 0);
  };

  // Función para manejar los cambios en los filtros de categoría y precio
  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    filterProducts(searchTerm, category, minPrice, maxPrice);
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    if (name === "minPrice") setMinPrice(value);
    if (name === "maxPrice") setMaxPrice(value);
    filterProducts(searchTerm, selectedCategory, minPrice, maxPrice);
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
        placeholder="Buscar por nombre..."
      />
      <div>
        <label htmlFor="category">Categoría:</label>
        <select
          id="category"
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
          <option value="">Todas las categorías</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="minPrice">Precio Mínimo:</label>
        <input
          type="number"
          id="minPrice"
          name="minPrice"
          value={minPrice}
          onChange={handlePriceChange}
          placeholder="Min"
        />
      </div>
      <div>
        <label htmlFor="maxPrice">Precio Máximo:</label>
        <input
          type="number"
          id="maxPrice"
          name="maxPrice"
          value={maxPrice}
          onChange={handlePriceChange}
          placeholder="Max"
        />
      </div>
      {noResults && <p>No hay productos que coincidan con la búsqueda.</p>}
    </div>
  );
}
