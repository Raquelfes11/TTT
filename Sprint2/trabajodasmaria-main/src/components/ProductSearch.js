import { useState, useEffect } from "react";

export default function ProductSearch({ setFilteredProducts }) {
  const [searchTerm, setSearchTerm] = useState(""); // Término de búsqueda
  const [products, setProducts] = useState([]); // Almacena los productos obtenidos de la API

  // Obtener productos desde la API de DummyJSON
  useEffect(() => {
    fetch("https://dummyjson.com/products") // Endpoint para obtener todos los productos
      .then((response) => response.json())
      .then((data) => {
        setProducts(data.products); // Almacenar los productos en el estado
      })
      .catch((error) => {
        console.error('Error al cargar los productos:', error);
      });
  }, []);

  // Función que se ejecuta al escribir en el input
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Función que se ejecuta al hacer clic en el botón de búsqueda
  const handleSearchSubmit = (e) => {
    e.preventDefault();

    if (searchTerm === "") {
      // Si no se ha introducido nada, mostrar todos los productos
      setFilteredProducts(products);
    } else {
      // Filtrar los productos que coincidan con el término de búsqueda
      const filtered = products.filter((product) =>
        product.title && product.title.toLowerCase().includes(searchTerm.toLowerCase()) // Asegúrate de que 'title' existe
      );
      setFilteredProducts(filtered);
    }
  };

  return (
    <div>
      <h1>Buscar Productos</h1>
      <form onSubmit={handleSearchSubmit}>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Buscar producto..."
        />
        <button type="submit">Buscar</button>
      </form>
    </div>
  );
}



