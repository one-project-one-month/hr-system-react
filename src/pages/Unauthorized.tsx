import { useNavigate } from "react-router-dom";

export default function Unauthorized() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-4xl font-bold mb-4">403 - Unauthorized</h1>
            <p className="mb-6">You do not have permission to access this page.</p>
            <button
                className="px-4 py-2 bg-primary-500 text-white rounded"
                onClick={() => navigate("/")}
            >
                Go Home
            </button>
        </div>
    );
}
