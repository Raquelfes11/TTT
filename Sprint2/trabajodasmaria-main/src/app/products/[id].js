// pages/products/[id].js
import { useRouter } from 'next/router'; // Para acceder al id de la URL
import { useEffect, useState } from 'react';

const ProductDetails = () => {
  const router = useRouter();
  const { id } = router.query; // Obtener el id del producto de la URL
  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (id) {
      // Hacer la solicitud a la API para obtener el producto por ID
      fetch(`https://dummyjson.com/products/${id}`)
        .then((response) => response.json())
        .then((data) => {
          setProduct(data); // Almacenar los detalles del producto
        })
        .catch((error) => {
          console.error('Error al cargar los detalles del producto:', error);
        });
    }
  }, [id]); // Solo se ejecuta si cambia el id

  if (!product) {
    return <p>Cargando detalles...</p>; // Mientras carga el producto
  }

  return (
    <div className="product-details">
      <h1>{product.title}</h1>
      <img src={product.images[0]} alt={product.title} />
      <p>{product.description}</p>
      <p>Precio: ${product.price}</p>
      <p>Categoría: {product.category}</p>
      <p>Valoración: {product.rating}</p>
      <p>Disponibilidad: {product.availabilityStatus}</p>
      <button>Añadir a carrito</button>
    </div>
  );
};

export default ProductDetails;
