import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Login({ setIsLoggedIn }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [msg, setMsg] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (evt) => {
        evt.preventDefault();

        if (!email || !password) {
            setMsg("Please fill all fields");
            return;
        }

        try {
            const res = await axios.post("http://localhost:5000/login", {
                email,
                password,
            });
            console.log(res.data);

            if (res.data.success) {
                localStorage.setItem("user", JSON.stringify(res.data.user));
                setIsLoggedIn(true);
                navigate("/dashboard");
            } else {
                setMsg(res.data.message);
            }

        } catch (err) {
            setMsg("Login failed");
        }
    };

    return (
        <div className="h-screen bg-blue-950 flex items-center justify-center">
            <div className="bg-blue-900 bg-opacity-90 p-10 rounded-xl w-96 shadow-2xl">

                <h1 className="text-white text-3xl font-bold mb-6 text-center">
                    BulkMail Login
                </h1>

                {msg && (
                    <p className="text-red-400 mb-3 text-center">
                        {msg}
                    </p>
                )}

                <form onSubmit={handleLogin} className="flex flex-col gap-4">

                    <input
                        type="email"
                        placeholder="Email"
                        className="p-3 rounded bg-blue-800 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        className="p-3 rounded bg-blue-800 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button className="bg-blue-600 hover:bg-blue-700 transition p-3 rounded text-white font-semibold">
                        Login
                    </button>

                </form>

                <p className="text-gray-300 mt-4 text-sm text-center">
                    Don’t have an account?{" "}
                    <Link to="/signup" className="underline text-white">
                        Sign up
                    </Link>
                </p>

            </div>
        </div>
    );
}

export default Login;
