import { useNavigate, Link } from "react-router-dom";


function Navbar({ setIsLoggedIn }) {

    const navigate = useNavigate();

    function handleLogout() {
        localStorage.removeItem("user");
        setIsLoggedIn(false);
        navigate("/login", { replace: true });
    }

    return (
        <div className="bg-blue-800 text-white text-center p-4">
            <h1 className="text-3xl font-medium">BulkMail</h1>

            <div className="mt-2">
                <Link to="/" className="mr-5 mt-5 underline">Send Mail</Link>
                <Link to="/history" className="underline">History</Link>


            </div>
            <div className="flex justify-end">
                <button
                    onClick={handleLogout}
                    className="bg-blue-950 hover:bg-blue-900 px-3 py-1 rounded">
                    Logout
                </button>
            </div>

        </div>
    );
}

export default Navbar;
