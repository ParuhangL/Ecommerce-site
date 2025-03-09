import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/products/";

export const fetchProducts = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data; 
  } catch (error) {
    console.error("Error fetching products:", error);
    
    // Check if the error is due to a wrong URL or server issue
    if (error.response) {
      console.error("Server responded with:", error.response.status, error.response.data);
    } else if (error.request) {
      console.error("No response received from the server.");
    } else {
      console.error("Request setup error:", error.message);
    }

    return []; // Return an empty array to prevent React errors
  }
};

export const searchProducts = async(query) => {
  return axios.get(`${API_URL}/search/?q=${query}`);
};

export const getRecommendations = async (productId) => {
  return axios.get(`${API_URL}/${productId}/recommend/`);
};