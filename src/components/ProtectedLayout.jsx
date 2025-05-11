
import { Outlet } from "react-router-dom";

export default function ProtectedLayout() {
  return (
    <>
      <Outlet /> {/* Render the current route's component */}
    </>
  );
}
