import logo from "../assets/img/websitelogo-4086x1736.png";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <div className="logo-container">
      <div className="app-logo">
        <Link to="/">
          <img src={logo} alt="How2Learn Logo" />
        </Link>
      </div>
    </div>
  );
}
