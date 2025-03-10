import { useRouter } from 'next/router'; 
import { useEffect, useState } from 'react';

const ProductDetails = () => {
  const router = useRouter();
  const { id } = router.query; 
  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (id) {
      fetch(`https://dummyjson.com/products/${id}`)
        .then((response) => response.json())
        .then((data) => {
          setProduct(data); 
        })
        .catch((error) => {
          console.error('Error al cargar los detalles del producto:', error);
        });
    }
  }, [id]); 

  if (!product) {
    return <p>Cargando detalles...</p>;
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
