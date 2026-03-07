import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, MessageSquare, Settings, User, Home } from "lucide-react";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();

  return (
    <header className="fixed top-0 w-full z-50 bg-base-100/80 backdrop-blur border-b border-base-300">
      <div className="max-w-7xl mx-auto px-4">

        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <MessageSquare className="size-5 text-primary" />
            </div>
            <span className="font-bold text-lg">TomoChat</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-2">

            <Link to="/" className="btn btn-sm gap-2">
              <Home size={16} />
              Home
            </Link>

            <Link to="/settings" className="btn btn-sm gap-2">
              <Settings size={16} />
              Settings
            </Link>

            {authUser && (
              <>
                <Link to="/profile" className="btn btn-sm gap-2">
                  <User size={16} />
                  Profile
                </Link>

                <button onClick={logout} className="btn btn-sm gap-2">
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            )}

          </div>

          {/* Mobile Icons */}
          <div className="flex md:hidden items-center gap-2">

            <Link to="/" className="btn btn-ghost btn-circle">
              <Home size={22} />
            </Link>

            <Link to="/settings" className="btn btn-ghost btn-circle">
              <Settings size={22} />
            </Link>

            {authUser && (
              <>
                <Link to="/profile" className="btn btn-ghost btn-circle">
                  <User size={22} />
                </Link>

                <button onClick={logout} className="btn btn-ghost btn-circle">
                  <LogOut size={22} />
                </button>
              </>
            )}

          </div>

        </div>

      </div>
    </header>
  );
};

export default Navbar;