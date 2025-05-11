import React, { useState } from "react";
import { NavLink } from "react-router-dom";

export default function Navbar({ navItems = [] }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
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
            <NavLink to="/profile" onClick={() => setIsOpen(false)}>
              Profile
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}
