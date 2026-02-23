import { useNavigate, Link } from "react-router-dom";

function Navbar({ setIsAdminLoggedIn }) {

    const navigate = useNavigate();

    function handleLogout() {
        localStorage.removeItem("admin");
        setIsAdminLoggedIn(false);
        navigate("/admin/login", { replace: true });
    }

    return (
        <div className="bg-blue-800 text-white text-center p-4">

            <h1 className="text-3xl font-medium">BulkMail Admin</h1>

            <div className="mt-3 space-x-6">
                <Link to="/dashboard" className="underline">
                    Send Mail
                </Link>

                <Link to="/history" className="underline">
                    History
                </Link>
            </div>

            <div className="flex justify-end mt-3">
                <button
                    onClick={handleLogout}
                    className="bg-blue-950 hover:bg-blue-900 px-4 py-1 rounded-md"
                >
                    Logout
                </button>
            </div>

        </div>
    );
}

export default Navbar;