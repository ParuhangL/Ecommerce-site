import { useState, useEffect } from "react";
import { getAdminDashboard } from "../api/admin";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip} from "recharts";

function AdminDashboard(){
    const[dashboard, setDashboard] = useState(null);
    const navigate = useNavigate()

    useEffect(() =>{
        const token = localStorage.getItem("token");
        if(!token){
            navigate("/login");
            return;
        }
        getAdminDashboard(token).then((response) =>{
            setDashboard(response.data)
        });
    },[navigate]);

    if (!dashboard) return <p>Loading...</p>;

    const orderData = dashboard.orders.map((order) =>({
        id: order.id,
        total: order.total_price,
    }));

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2x1 font-bold"> Admin Dashboard </h1>
            <p>Total Products: {dashboard.total_products}</p>
            <p>Total Orders: {dashboard.total_orders}</p>

            <h2 className="text-lg font-bold mt-4"> Sale Analytics</h2>
            <BarChart width={600} height={300} data={orderData}>
                <XAxis dataKey="id" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#82ca9d" />
            </BarChart>
        </div>
    );
}

export default AdminDashboard;