import { jwtDecode } from "jwt-decode";

export default function isTokenExpired(token) {
  if (!token) return true;

  try {
    const { exp } = jwtDecode(token);
    if (!exp) return true;

    return exp * 1000 < Date.now(); // exp is in seconds, Date.now() in ms
  } catch (err) {
    console.error("Invalid token format:", err);
    return true; // If token can't be decoded, treat as expired
  }
}
