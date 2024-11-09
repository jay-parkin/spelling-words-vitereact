import Navbar from "./Navbar";
import Header from "./Header";
import { Outlet } from "react-router-dom";

export default function ProtectedLayout() {
  return (
    <>
      <Navbar />
      <Outlet /> {/* Render the current route's component */}
    </>
  );
}
