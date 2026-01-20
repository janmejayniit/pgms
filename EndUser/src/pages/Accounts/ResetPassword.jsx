import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";

const ResetPassword = () => {
    const API_URL = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();
    const location = useLocation();

    const contactNumber = location.state?.contactNumber;

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Prevent direct access
    useEffect(() => {
        if (!contactNumber) {
            navigate("/forget-password");
        }
    }, [contactNumber, navigate]);

    const validatePassword = () => {
        if (password.length < 8) {
            toast.error("Password must be at least 8 characters");
            return false;
        }
        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validatePassword()) return;

        try {
            setLoading(true);

            await axios.post(`${API_URL}/auth/reset-password/`, {
                contact_number: contactNumber,
                password: password
            });

            toast.success("Password reset successfully");

            navigate("/login");

        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to reset password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="card shadow-lg p-4 rounded-4" style={{ width: "380px" }}>

                <h4 className="text-center fw-bold text-primary mb-3">
                    Reset Password
                </h4>

                <form onSubmit={handleSubmit} autoComplete="off">

                    {/* Password */}
                    <div className="mb-3">
                        <label className="form-label fw-semibold">New Password</label>
                        <div className="input-group">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="form-control"
                                placeholder="Enter new password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <span
                                className="input-group-text"
                                style={{ cursor: "pointer" }}
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                            </span>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="mb-3">
                        <label className="form-label fw-semibold">Confirm Password</label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Confirm password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-100 btn-lg"
                        disabled={loading}
                    >
                        {loading ? "Resetting..." : "Reset Password"}
                    </button>
                </form>

                <div className="text-center mt-3">
                    <a href="/login" className="text-decoration-none">
                        Back to Login
                    </a>
                </div>

            </div>
        </div>
    );
};

export default ResetPassword;
