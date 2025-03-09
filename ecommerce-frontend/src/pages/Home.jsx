import { useState, useEffect } from "react";
import { fetchProducts } from "../api/products";
import { Link } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import ProductList from "../components/ProductList";

function Home() {
  const [products, setProducts] = useState([]); // Stores all products
  const [searchResults, setSearchResults] = useState([]); // Stores filtered results

  useEffect(() => {
    fetchProducts()
      .then((data) => {
        console.log("Fetched Products:", data); // Debugging
        const productArray = Array.isArray(data) ? data : [];
        setProducts(productArray);
        setSearchResults(productArray); // Default search results to all products
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Products</h1>

      {/* Search Bar */}
      <SearchBar setResults={setSearchResults} />

      {/* Product List */}
      <ProductList products={searchResults} />
    </div>
  );
}

export default Home;
