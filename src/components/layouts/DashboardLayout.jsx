import "./DashboardLayout.css";
import DashboardNavbar from "./DashboardNavbar.jsx";
import Navbar from "../Navbar.jsx";

import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  const [navItems, setNavItems] = useState([]);

  useEffect(() => {
    // Fetch and decode the JWT to get the user role
    const token = localStorage.getItem("jwt");
    if (token) {
      const decoded = jwtDecode(token);
      const role = decoded.role;

      let items;
      // Define side items based on user role
      switch (role) {
        case "admin":
          items = [{ id: 1, name: "Classroom", path: "/classroom" }];
          break;

        case "user":
          items = [
            { id: 1, name: "Spelling", path: "/spelling" },
            { id: 2, name: "Maths", path: "/maths" },
          ];
          break;
        default:
          // Send a user with no role back home
          items = [{ id: 1, name: "Home", path: "/" }];
          break;
      }

      setNavItems(items);
    } else {
      console.error("No token found");
    }
  }, []);

  return (
    <div className="layout-container">
      <div>
        <Navbar navItems={navItems} />

        <div className="inner-layout">
          {/* Renders children */}
          <Outlet />
        </div>
      </div>
    </div>
  );
}
