import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const Cart = () => {
    const[cart, setCart] = useState([]);
    const[loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchCart = async () => {
        try{
            const response = await api.get("/cart/")
            setCart(response.data);
        } catch (error) {
            console.error("Error fetching Cart: ", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    },[cart]);

    useEffect(() => {
        const savedCart = localStorage.getItem("cart");
        if (savedCart){
            setCart(JSON.parse(savedCart));
            setLoading(false);
        } else {
            fetchCart();
        }
    },[]);

    const updateQuantity = async (productId, quantity) => {
        if (quantity < 1) return;
        try {
          await api.patch(`/cart/${productId}/`, { quantity });
          setCart(cart.map(item => 
            item.product.id === productId ? { ...item, quantity } : item
          ));
        } catch (error) {
          console.error("Error updating quantity:", error);
        }
      };
    
      // Remove item from cart
      const removeFromCart = async (productId) => {
        try {
          await api.delete(`/cart/${productId}/`);
          setCart(cart.filter(item => item.product.id !== productId));
        } catch (error) {
          console.error("Error removing item:", error);
        }
      };
    
      // Proceed to Checkout
      const handleCheckout = async () => {
        try {
          const response = await api.post("/checkout/", { cart_items: cart });
          setCart([]); // Clear cart after successful checkout
          localStorage.removeItem("cart"); // Remove saved cart
          navigate("/order-success", { state: response.data });
        } catch (error) {
          console.error("Checkout failed:", error);
        }
      };
    
      return (
        <div className="container mx-auto p-4">
          <h2 className="text-2xl font-bold mb-4">Shopping Cart</h2>
          {loading ? (
            <p>Loading cart...</p>
          ) : cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <div className="space-y-4">
              {cart.map(item => (
                <div key={item.product.id} className="flex items-center justify-between p-4 bg-white shadow rounded-lg">
                  <div>
                    <h3 className="text-lg font-semibold">{item.product.name}</h3>
                    <p className="text-gray-600">Price: ${item.product.price}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="px-2 py-1 bg-gray-300 rounded">-</button>
                    <span className="px-3">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="px-2 py-1 bg-gray-300 rounded">+</button>
                    <button onClick={() => removeFromCart(item.product.id)} className="px-3 py-1 bg-red-500 text-white rounded">Remove</button>
                  </div>
                </div>
              ))}
              <div className="text-right">
                <button onClick={handleCheckout} className="px-4 py-2 bg-blue-500 text-white rounded">Checkout</button>
              </div>
            </div>
          )}
        </div>
      );
    };
    
    export default Cart;
