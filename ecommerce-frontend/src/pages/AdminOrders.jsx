import { useState } from "react";
import { trackOrder } from "../api/orders";

function TrackOrder() {
  const [trackingCode, setTrackingCode] = useState("");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  const handleTrackOrder = async () => {
    try {
      const response = await trackOrder(trackingCode);
      setOrder(response.data);
      setError("");
    } catch (err) {
      setOrder(null);
      setError("Order not found");
    }
  };

  return (
    <div>
      <h2>Track Your Order</h2>
      <input
        type="text"
        value={trackingCode}
        onChange={(e) => setTrackingCode(e.target.value)}
        placeholder="Enter Tracking Code"
        className="border p-2"
      />
      <button onClick={handleTrackOrder} className="bg-blue-500 text-white p-2">
        Track Order
      </button>

      {error && <p className="text-red-500">{error}</p>}

      {order && (
        <div className="border p-4 mt-4">
          <p>Tracking Code: {order.tracking_code}</p>
          <p>Status: {order.status}</p>
          <p>Shipping Address: {order.shipping_address}</p>
        </div>
      )}
    </div>
  );
}

export default TrackOrder;
