import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

export default function Navbar({ navItems = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const { logout, user } = useUser();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  return (
    <nav className="navbar">
      <ul className={`nav-links ${isOpen ? "active" : ""}`}>
        <div className="nav-all">
          <div className="nav-left">
            <li>
              <NavLink to="/" onClick={() => setIsOpen(false)}>
                Home
              </NavLink>
            </li>
          </div>

          <div className="nav-centre">
            {navItems.map((item) => (
              <li key={item.id}>
                <NavLink to={item.path} onClick={() => setIsOpen(false)}>
                  {item.name}
                </NavLink>
              </li>
            ))}
          </div>
        </div>
      </ul>

      <div className="hamburger" onClick={toggleMenu}>
        <span className={`bar ${isOpen ? "open" : ""}`}></span>
        <span className={`bar ${isOpen ? "open" : ""}`}></span>
        <span className={`bar ${isOpen ? "open" : ""}`}></span>
      </div>

      <div className="nav-right">
        <ul className="profile-link">
          <li>
            <NavLink to="/auth" onClick={() => handleLogout()}>
              Logout
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}
