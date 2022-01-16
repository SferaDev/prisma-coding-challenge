import { Link } from "remix";
import { User } from "~/models/User";

export const Header: React.FC<HeaderProps> = ({ user }) => {
    return (
        <>
            <div className="flex flex-col justify-center px-8">
                <nav className="flex items-center justify-between w-full relative max-w-6xl border-gray-200 mx-auto pt-8 pb-4 text-gray-900 bg-gray-50 bg-opacity-60">
                    <div className="ml-[-0.60rem]">
                        <Link
                            className="font-bold text-gray-600 hidden md:inline-block p-1 sm:px-3 sm:py-2 rounded-lg hover:bg-gray-200 transition-all"
                            to="/"
                        >
                            <span className="capsize">Home</span>
                        </Link>
                        <Link
                            className="font-normal text-gray-600 hidden md:inline-block p-1 sm:px-3 sm:py-2 rounded-lg hover:bg-gray-200 transition-all"
                            to="/api"
                        >
                            <span className="capsize">API Docs</span>
                        </Link>
                    </div>
                    <Link to={user ? "/" : "/auth/login"}>
                        <button
                            type="button"
                            className="bg-gray-200 p-2 px-4 rounded-lg flex items-center justify-center hover:ring-2 ring-gray-300 transition-all"
                        >
                            <p className="text-sm">{user?.name ?? "Login"}</p>
                        </button>
                    </Link>
                </nav>
            </div>
        </>
    );
};

export interface HeaderProps {
    user?: User;
}
