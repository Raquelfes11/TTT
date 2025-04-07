import { useState, useEffect } from "react";

export default function AuctionSearch({ setFilteredAuctions }) {
  const [searchTerm, setSearchTerm] = useState(""); 
  const [selectedCategory, setSelectedCategory] = useState(""); 
  const [minPrice, setMinPrice] = useState(""); 
  const [maxPrice, setMaxPrice] = useState(""); 
  const [categories, setCategories] = useState([]); 
  const [auctions, setAuctions] = useState([]); 
  const [filtered, setFiltered] = useState([]); 
  const [noResults, setNoResults] = useState(false); 

  useEffect(() => {
    // Obtener las categorías
    fetch("http://localhost:8000/api/auctions/categories")
      .then((response) => response.json())
      .then((categoriesData) => {
        if (Array.isArray(categoriesData)) {
          setCategories(categoriesData);
        }
      })
      .catch((error) => {
        console.error("Error al cargar las categorías:", error);
      });
    
    // Llamada inicial para obtener todas las subastas
    fetchAuctions();
  }, []);

  const fetchAuctions = () => {
    let url = "http://localhost:8000/api/auctions?";
    
    // Añadir parámetros de filtrado a la URL
    if (searchTerm) {
      url += `texto=${searchTerm}&`;
    }
    if (selectedCategory) {
      url += `categoría=${selectedCategory}&`;
    }
    if (minPrice) {
      url += `precioMin=${minPrice}&`;
    }
    if (maxPrice) {
      url += `precioMax=${maxPrice}&`;
    }

    // Eliminar el último '&' si está presente
    url = url.endsWith('&') ? url.slice(0, -1) : url;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          console.log("Subastas obtenidas:", data);
          setAuctions(data);
          setFiltered(data);
          setNoResults(data.length === 0);
        }
      })
      .catch((error) => {
        console.error("Error al cargar las subastas:", error);
        setNoResults(true);
      });
  };

  const handleSearchChange = (e) => {
    const term = e.target.value.trim().toLowerCase(); 
    setSearchTerm(term);
    fetchAuctions();
  };

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    fetchAuctions();
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    if (name === "minPrice") setMinPrice(value);
    if (name === "maxPrice") setMaxPrice(value);
    fetchAuctions();
  };

  useEffect(() => {
    setFilteredAuctions(filtered);
  }, [filtered, setFilteredAuctions]);

  return (
    <div>
      <h1>Buscar Subastas</h1>
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Buscar por título o descripción..."
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
            <option key={category.id} value={category.name}>
              {category.name}
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
      {noResults && <p>No hay subastas que coincidan con la búsqueda.</p>}
    </div>
  );
}
