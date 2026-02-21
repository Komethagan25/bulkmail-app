import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  function handleUInput(evt) {
    setEmail(evt.target.value);
  }

  function handlePInput(evt) {
    setPassword(evt.target.value);
  }

  const handleSignup = async (evt) => {
    evt.preventDefault();

    if (!email || !password) {
      setMsg("Please fill all fields");
      return;
    }

    try {
      const res = await axios.post("https://bulkmail-app-dw3a.onrender.com/signup", {
        email,
        password,
      });

      setMsg(res.data.message);

      if (res.data.success) {
        setTimeout(() => navigate("/login"), 1500);
      }

    } catch (err) {
      setMsg(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="h-screen bg-blue-900 flex items-center justify-center">
      <div className="bg-blue-800 bg-opacity-90 p-10 rounded-xl w-96 shadow-2xl">
        
        <h1 className="text-white text-3xl font-bold mb-6 text-center">
          BulkMail Signup
        </h1>

        {msg && (
          <p className="text-green-400 mb-3 text-center">
            {msg}
          </p>
        )}

        <form onSubmit={handleSignup} className="flex flex-col gap-4">

          <input
            type="email"
            placeholder="Email"
            className="p-3 rounded bg-blue-700 text-white placeholder-gray-300 focus:outline-none hover:bg-blue-600"
            value={email}
            onChange={handleUInput}
          />

          <input
            type="password"
            placeholder="Password"
            className="p-3 rounded bg-blue-700 text-white placeholder-gray-300 focus:outline-none"
            value={password}
            onChange={handlePInput}
          />

          <button className="bg-blue-600 hover:bg-blue-700 transition p-3 rounded text-white font-semibold">
            Sign Up
          </button>

        </form>

        <p className="text-gray-300 mt-4 text-sm text-center">
          Already have an account?{" "}
          <Link to="/login" className="underline text-white">
            Sign in
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Signup;
