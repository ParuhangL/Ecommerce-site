import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/esewa/";

export const payWithEsewa = async (orderId, amount) => {
  const response = await axios.post(`${API_URL}payment/`, { order_id: orderId, amount });
  return response.data.esewa_url;
};
