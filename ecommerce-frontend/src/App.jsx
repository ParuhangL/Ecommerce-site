import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PrivateRoute from "./components/PrivateRoute";
import AdminDashboard from "./pages/AdminDashBoard";
import Layout from "./components/Layout"; // Import Layout Component

function App() {
  return (
    <Routes>
      {/* Wrap all public routes with Layout */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="product/:id" element={<ProductDetail />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="admin/dashboard" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
      </Route>
    </Routes>
  );
}

export default App;
