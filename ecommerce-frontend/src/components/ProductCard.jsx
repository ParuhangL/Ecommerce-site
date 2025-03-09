import React from 'react';

function ProductCard({ product, addToCart }) {
  return (
    <div className="border rounded-lg p-4 shadow-md hover:shadow-lg transition">
      <img
        src={product.image || '/placeholder.jpg'}
        alt={product.name}
        className="w-full h-40 object-cover rounded-md"
      />
      <h2 className="text-lg font-semibold mt-2">{product.name}</h2>
      <p className="text-gray-600">${product.price}</p>
      <button
        onClick={() => addToCart(product)}
        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Add to Cart
      </button>
    </div>
  );
}

export default ProductCard;
