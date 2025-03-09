import { useState } from "react";
import { loginUser } from "../api/auth";
import { useNavigate } from "react-router-dom";

function Login(){
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try{
            await loginUser(username, password);
            alert("Login successfull");
            navigate("/");
        }catch(error){
            alert("Invalid credentials");
        }
    };

    return(
        <div className="container mx-auto p-4">
            <h1 className="text-2x1 font-bold"> Login </h1>
            <form onSubmit={handleLogin}>
                <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className="border p-2 w-full my-2" />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="border p-2 w-full my-2" />
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Login</button>
            </form>
        </div>
    );
}

export default Login;