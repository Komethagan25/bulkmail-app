import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminLogin({ setIsAdminLoggedIn }) {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [msg, setMsg] = useState("");

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        // Frontend validation
        if (!username || !password) {
            setMsg("Please fill all fields");
            return;
        }

        try {

            const res = await axios.post("https://bulkmail-app-dw3a.onrender.com/admin/login", {
                username,
                password
            });

            if (res.data.success) {

                localStorage.setItem("admin", "true");
                setIsAdminLoggedIn(true);
                navigate("/dashboard");

            } else {
                setMsg(res.data.message || "Invalid credentials");
            }

        } catch (error) {
            setMsg("Invalid Admin Credentials");
        }
    };

    return (
        <div className="h-screen bg-blue-950 flex items-center justify-center">

            <div className="bg-blue-900 bg-opacity-90 p-10 rounded-xl w-96 shadow-2xl">

                <h1 className="text-white text-3xl font-bold mb-6 text-center">
                    BulkMail Admin
                </h1>

                {msg && (
                    <p className="text-red-400 mb-3 text-center">
                        {msg}
                    </p>
                )}

                <form onSubmit={handleLogin} className="flex flex-col gap-4">

                    <input
                        type="text"
                        placeholder="Username"
                        className="p-3 rounded bg-blue-800 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={username}
                        onChange={(e) => {
                            setUsername(e.target.value);
                            setMsg("");
                        }}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        className="p-3 rounded bg-blue-800 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setMsg("");
                        }}
                    />

                    <button className="bg-blue-600 hover:bg-blue-700 transition p-3 rounded text-white font-semibold">
                        Login
                    </button>

                </form>

            </div>
        </div>
    );
}

export default AdminLogin;