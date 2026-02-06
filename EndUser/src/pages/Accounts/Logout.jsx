import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // 🔐 Remove tokens
    localStorage.removeItem("token");
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("first_name");
    localStorage.removeItem("last_name");
    localStorage.removeItem("contact_number");
    localStorage.removeItem("email");

    // (optional) clear user info
    // localStorage.removeItem("user");

    // Redirect to login
    navigate("/login", { replace: true });
  }, [navigate]);

  return <p className="text-center mt-5">Logging out...</p>;
};

export default Logout;
