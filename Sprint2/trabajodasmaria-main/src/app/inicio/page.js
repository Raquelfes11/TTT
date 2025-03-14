import React, { useEffect, useState } from "react";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("https://dummyjson.com/products")
      .then((response) => response.json())
      .then((data) => {
        console.log(data); 
        setProducts(data.products);
        setFilteredProducts(data.products); 
      })
      .catch((error) => {
        console.error("Error al cargar los productos:", error);
      });
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();
    const searchTermLowerCase = searchTerm.trim().toLowerCase();
    if (searchTermLowerCase === "") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter((product) =>
        product.title.toLowerCase().includes(searchTermLowerCase)
      );
      setFilteredProducts(filtered);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Buscar productos"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={handleSearch}>Buscar</button>

      <div className="product-list">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div className="product-card" key={product.id}>
              <img src={product.thumbnail} alt={product.title} />
              <h3>${product.title}</h3>
              <p>Precio:{product.price}</p>
              <button className="btn-more">Ver más</button>
              <button className="btn-wishlist">Añadir a favoritos</button>
            </div>
          ))
        ) : (
          <p>No se encontraron productos.</p>
        )}
      </div>
    </div>
  );
}

export default ProductList;
