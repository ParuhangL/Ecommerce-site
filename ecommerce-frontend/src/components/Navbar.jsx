import { logoutUser } from "../api/auth";
import { useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const handleLogout = () =>{
        logoutUser();
        navigate("/login/");
    };
    
    return(
        <nav  className="p-4 bg-gray-200">
            <button onClick={() => navigate("/cart")} className="px-4">Cart</button>
            {token?(
                <button onClick={handleLogout} className="px-4">Log Out</button>
            ) : (
                <>
                <button onClick={() => navigate("/login")} className="px-4"> Login </button>
                <button onClick={() => navigate("/register")} className="px-4"> Register </button>
                </>
            )}
        </nav>
    );
}

export default Navbar;