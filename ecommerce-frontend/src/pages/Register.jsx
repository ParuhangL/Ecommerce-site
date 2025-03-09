import { useState } from "react";
import { registerUser } from "../api/auth";
import { useNavigate } from "react-router-dom";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null); // State to handle errors
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault(); 
    setError(null); // Reset error state before attempting registration
    try {
      await registerUser(username, email, password); // Ensure email is passed
      alert("Registration successful!");
      navigate("/login");
    } catch (error) {
      // Check if the error response exists and has data
      if (error.response && error.response.data) {
        setError(error.response.data.error || "Registration failed");
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Register</h1>
      {error && <p className="text-red-500">{error}</p>} {/* Display error */}
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border p-2 w-full my-2"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 w-full my-2"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 w-full my-2"
          required
        />
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;
