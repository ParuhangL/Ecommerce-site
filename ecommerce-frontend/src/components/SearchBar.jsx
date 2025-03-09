import { useState } from "react";
import { searchProducts } from "../api/products";

function SearchBar({ setResults }) {
    const[query, setQuery] = useState("");

    const handleSearch = async(e) =>{
        e.preventDefault();
        const response = await searchProducts(query)
        setResults(response.data);
    };

    return(
        <div className="p-4">
            <form onSubmit={handleSearch}>
                <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search Products..." className="border p-2" />
                <button type="submit" className="bg-blue-500 text-white p-2 ml-2">Search</button>
            </form>
        </div>
    );
}

export default SearchBar