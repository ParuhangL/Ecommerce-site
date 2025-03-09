import React, { useState } from "react";
import ProductCard from "./ProductCard";

function ProductList({ products }) {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const itemExists = prevItems.find((item) => item.id === product.id);
      if (itemExists) {
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  return (
    <div>
      {/* Product List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product.id} product={product} addToCart={addToCart} />
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500">No products found.</p>
        )}
      </div>

      {/* Shopping Cart Section */}
      <div className="mt-6 p-4 border rounded-lg bg-gray-100">
        <h2 className="text-xl font-semibold mb-2">Shopping Cart</h2>
        {cartItems.length === 0 ? (
          <p className="text-gray-500">Your cart is empty.</p>
        ) : (
          <ul className="list-disc pl-5">
            {cartItems.map((item) => (
              <li key={item.id} className="mb-1">
                {item.name} - Quantity: {item.quantity}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default ProductList;
