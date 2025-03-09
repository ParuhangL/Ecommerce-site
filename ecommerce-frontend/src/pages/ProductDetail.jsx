import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { addToCart } from "../api/cart";
import { getRecommendations } from "../api/products";

const API_URL = "http://127.0.0.1:8000/api/";

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}products/${id}/`).then((response) => {
      setProduct(response.data);
    });

    getRecommendations(id).then((res) =>{
      setRecommendations(res.data);
    });
  }, [id]);

  if (!product) return <p>Loading...</p>;

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in first!");
      return;
    }
    await addToCart(product.id, 1, token);
    alert("Added to the cart!");
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2x1 font-bold">{product.name}</h1>
      <img
        src={product.image}
        alt={product.name}
        className="w-96 h-96 object-cover"
      />
      <p>{product.description}</p>
      <p className="text-lg font-semibold">${product.price}</p>
      <button
        onClick={handleAddToCart}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Add to Cart
      </button>

      {/* Recommendation Section*/}
      <div className="mt-6">
        <h2 className="text-xl font-semibold">Recommended Products:</h2>
        {recommendations.length > 0 ?(
          <ul className="mt-2">
            {recommendations.map((rec) =>(
              <li key ={rec.id} className="border p-2 rounded shadow-sm">
                {rec.name} - ${rec.price}
              </li>
            ))}
          </ul>
        ):(
          <p className="text-gray-500"> No recommendations available. </p>
        )}
      </div>
    </div>
  );
}

export default ProductDetail;
