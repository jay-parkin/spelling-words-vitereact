import { NavLink } from "react-router-dom";
import { useState } from "react";
import "../styles/NavigationBar.css";

const NavigationBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <div className="hamburger" onClick={toggleMenu}>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <ul className={`navbar-links ${isOpen ? "show" : ""}`}>
        <li>
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? "active" : "inactive")}
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/spelling"
            className={({ isActive }) => (isActive ? "active" : "inactive")}
          >
            Spelling
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/maths"
            className={({ isActive }) => (isActive ? "active" : "inactive")}
          >
            Maths
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/sentences"
            className={({ isActive }) => (isActive ? "active" : "inactive")}
          >
            Sentences
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/word-search"
            className={({ isActive }) => (isActive ? "active" : "inactive")}
          >
            Word Search
          </NavLink>
        </li>
      </ul>
      <ul className={`navbar-links ${isOpen ? "show" : ""}`}>
        <li>
          <NavLink
            to="/profile"
            className={({ isActive }) => (isActive ? "active" : "inactive")}
          >
            Profile
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default NavigationBar;
