import React, { useState } from "react";
import { NavLink } from "react-router-dom";


const Navbar = () => {
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
              <NavLink
                to="/"
                onClick={() => setIsOpen(false)} // Close the menu when a link is clicked
              >
                Home
              </NavLink>
            </li>
          </div>

          <div className="nav-centre">
            <li>
              <NavLink to="/spelling" onClick={() => setIsOpen(false)}>
                Spelling
              </NavLink>
            </li>
            <li>
              <NavLink to="/maths" onClick={() => setIsOpen(false)}>
                Maths
              </NavLink>
            </li>
            <li>
              <NavLink to="/sentences" onClick={() => setIsOpen(false)}>
                Sentences
              </NavLink>
            </li>
            <li>
              <NavLink to="/word-search" onClick={() => setIsOpen(false)}>
                Word Search
              </NavLink>
            </li>
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
};

export default Navbar;
