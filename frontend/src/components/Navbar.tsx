import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home as HomeIcon, BarChart, Menu, X, HelpCircle } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { Button } from "./ui/button";
import { useState } from "react";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { token, logout } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  const handleLogin = () => {
    navigate("/auth");
    setIsMenuOpen(false);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const navLinks = [
    { path: "/", icon: <HomeIcon className="h-5 w-5 mr-2" />, text: "Home" },
    {
      path: "/summary",
      icon: <BarChart className="h-5 w-5 mr-2" />,
      text: "Weather Summary",
    },
    {
      path: "/help",
      icon: <HelpCircle className="h-5 w-5 mr-2" />,
      text: "Help",
    },
  ];

  return (
    <nav className="bg-white shadow-lg mb-3">
      <div className="container mx-auto px-2 md:px-4">
        <div className="flex justify-between items-center h-16">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-gray-600" />
            ) : (
              <Menu className="h-6 w-6 text-gray-600" />
            )}
          </button>
          <div className=" md:hidden ">
            {token ? (
              <Button onClick={handleLogout} className="w-full justify-center">
                Logout
              </Button>
            ) : (
              <Button onClick={handleLogin} className="w-full justify-center">
                Login
              </Button>
            )}
          </div>

          <div className="hidden md:flex space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center px-2 py-2 rounded-md text-sm font-medium
                    ${
                      location.pathname === link.path
                        ? "text-blue-600 bg-blue-50"
                        : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                    }`}
              >
                {link.icon}
                {link.text}
              </Link>
            ))}
          </div>

          <div className="hidden md:block">
            {token ? (
              <Button onClick={handleLogout}>Logout</Button>
            ) : (
              <Button onClick={handleLogin}>Login</Button>
            )}
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={closeMenu}
                  className={`flex items-center px-2 py-2 rounded-md text-sm font-medium
                      ${
                        location.pathname === link.path
                          ? "text-blue-600 bg-blue-50"
                          : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                      }`}
                >
                  {link.icon}
                  {link.text}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
