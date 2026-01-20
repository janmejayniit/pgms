import {useState} from 'react';
import './Login.css';
import { toast } from "react-toastify";

const Login = () => {
    const API_URL = import.meta.env.VITE_API_URL;
    const [loginData, setLoginData] = useState({
        contact_number: "",
        password: ""
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        if (!loginData.contact_number || !loginData.password) {
        // setError("Please fill in all fields");
        toast.error("Please fill in all fields");
        return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      });

      const data = await res.json();

      if (!res.ok) {
        // setError(data.detail || "Invalid credentials");
        toast.error(data.detail || "Invalid credentials");
          setLoginData(
              {
                  contact_number: "",
                  password: ""
              }
          )
        return;
      }
      localStorage.setItem("refresh", data.refresh);
      localStorage.setItem("token", data.access);
      localStorage.setItem("user_id", data.user.id);
      localStorage.setItem("first_name", data.user.first_name);
      localStorage.setItem("last_name", data.user.last_name);
      localStorage.setItem("contact_number", data.user.contact_number);
      localStorage.setItem("email", data.user.email);
      window.location.href = "/";

    } catch (err) {
      console.error(err);
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
          <div className="card shadow-lg p-4 rounded-4 login-card" style={{width: "380px"}}>

              <h3 className="text-center mb-4 fw-bold text-primary">
                  <i className="bi bi-box-arrow-in-right me-2"></i> Login
              </h3>

              {error && <div className="alert alert-danger text-center">{error}</div>}

              <form autoComplete="off" onSubmit={handleLogin}>

                  {/* Mobile Number */}
                  <div className="mb-3">
                      <label className="form-label fw-semibold">Mobile Number</label>
                      <div className="input-group">
          <span className="input-group-text bg-white">
            <i className="bi bi-phone"></i>
          </span>
                          <input
                              type="text"
                              className="form-control"
                              placeholder="Enter mobile number"
                              value={loginData.contact_number}
                              onChange={(e) =>
                                  setLoginData({...loginData, contact_number: e.target.value})
                              }
                              required
                          />
                      </div>
                  </div>

                  {/* Password */}
                  <div className="mb-3">
                      <label className="form-label fw-semibold">Password</label>
                      <div className="input-group">
          <span className="input-group-text bg-white">
            <i className="bi bi-lock"></i>
          </span>
                          <input
                              type={showPassword ? "text" : "password"}
                              className="form-control"
                              placeholder="Enter password"
                              value={loginData.password}
                              onChange={(e) =>
                                  setLoginData({...loginData, password: e.target.value})
                              }
                              required
                          />

                          {/* Show/Hide Button */}
                          <span
                              className="input-group-text bg-white"
                              role="button"
                              onClick={() => setShowPassword(!showPassword)}
                          >
            <i className={showPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
          </span>
                      </div>
                  </div>

                  {/* Login Button */}
                  <button
                      type="submit"
                      className="btn btn-primary w-100 btn-lg fw-semibold mt-2"
                      disabled={loading}
                  >
                      {loading ? (
                          <span><i className="spinner-border spinner-border-sm me-2"></i>Logging in...</span>
                      ) : (
                          "Login"
                      )}
                  </button>
              </form>

              {/* Extra Links */}
              <div className="text-center mt-3">
                  <a href="/forget/password" className="text-decoration-none">Forgot password?</a>
              </div>

              <div className="text-center mt-2">
                  <small>
                      Don’t have an account? <a href="/register" className="text-primary">Register</a>
                  </small>
              </div>
          </div>
      </div>

  );
};

export default Login;
