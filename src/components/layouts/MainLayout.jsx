import React from "react";
import Navbar from "../Navbar";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="main-layout">
      <Navbar />
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
}
