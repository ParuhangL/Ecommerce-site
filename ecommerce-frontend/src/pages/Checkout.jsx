import { useState } from "react";
import { createOrder } from "../api/order";
import axios from "axios";

function Checkout({ cart = [], user }) {
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("kathmandu");
  const [loading, setLoading] = useState(false);

  // Ensure cart is an array before using reduce (if it's undefined or null)
  const totalAmount = (Array.isArray(cart) ? cart : []).reduce((sum, item) => sum + item.price, 0);
  const shippingCharge = totalAmount >= 5000 ? 0 : 70;
  const finalTotal = totalAmount + shippingCharge;

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      // Step 1: Create Order using your order.js API
      const orderResponse = await createOrder({
        user: user.id,
        total_price: finalTotal,
        shipping_address: address,
        city,
      });

      const { id: order_id } = orderResponse.data;

      // Step 2: Request eSewa Payment URL
      const esewaResponse = await axios.post(
        "http://127.0.0.1:8000/api/esewa/pay/",
        { amount: finalTotal, order_id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { esewa_url, payload } = esewaResponse.data;

      if (esewa_url && payload) {
        // Step 3: Redirect User to eSewa
        const form = document.createElement("form");
        form.method = "POST";
        form.action = esewa_url;

        Object.entries(payload).forEach(([key, value]) => {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = value;
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
      } else {
        alert("Failed to get eSewa URL. Please try again.");
      }
    } catch (error) {
      console.error("Checkout Error:", error);
      alert(error.response?.data?.error || "Order or payment failed!");
    }
    setLoading(false);
  };

  return (
    <div>
      <h2>Checkout</h2>
      <input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Shipping Address"
        className="border p-2"
      />
      <select value={city} onChange={(e) => setCity(e.target.value)}>
        <option value="kathmandu">Kathmandu</option>
        <option value="bhaktapur">Bhaktapur</option>
        <option value="lalitpur">Lalitpur</option>
      </select>
      <p>Subtotal: Rs. {totalAmount}</p>
      <p>Delivery Charge: Rs. {shippingCharge}</p>
      <h3>Total Amount: Rs. {finalTotal}</h3>
      <button
        onClick={handleCheckout}
        disabled={loading}
        className="bg-blue-500 text-white p-2"
      >
        {loading ? "Processing..." : "Proceed to Pay with eSewa"}
      </button>
    </div>
  );
}

export default Checkout;
