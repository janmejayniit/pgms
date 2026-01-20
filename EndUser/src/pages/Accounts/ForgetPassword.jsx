import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const ForgetPassword = () => {
    const [loading, setLoading] = useState(false);
    const [contactNumber, setContactNumber] = useState("");
    const [otp, setOtp] = useState("");

    const navigate = useNavigate();
    const location = useLocation();

    const API_URL = import.meta.env.VITE_API_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!contactNumber) {
            toast.error("Please fill your contact number");
            return;
        }

        if (!/^[0-9]{10}$/.test(contactNumber)) {
            toast.error("Contact number should have exactly 10 digits");
            return;
        }

        try {
            setLoading(true);

            const response = await axios.post(`${API_URL}/auth/send-otp/`, {
                contact_number: contactNumber
            });

            // Success message from backend (if any)
            toast.success(response.data?.message || "OTP sent successfully");

            navigate("/verify-otp", {
                state: { contactNumber }
            });

        } catch (error) {
            // Handle backend errors properly
            if (error.response) {
                // Server responded with error
                toast.error(error.response.data?.message || "Failed to send OTP");
            } else if (error.request) {
                // No response from server
                toast.error("Server not reachable. Try again later.");
            } else {
                // Something else went wrong
                toast.error("Unexpected error occurred");
            }

            console.error("Send OTP error:", error);

        } finally {
            setLoading(false);
        }



    };
    // const verifyOTP = async () => {
    //
    //     await axios.post(`${API_URL}/verify-otp/`, {
    //         contactNumber,
    //         otp
    //     });
    //
    // }

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="card shadow-lg p-4 rounded-4" style={{ width: "380px" }}>

                <h3 className="text-center mb-4 fw-bold text-primary">
                    <i className="bi bi-shield-lock me-2"></i> Forget Password
                </h3>

                <form autoComplete="off" onSubmit={handleSubmit}>

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
                                value={contactNumber}
                                onChange={(e) => setContactNumber(e.target.value)}
                                maxLength={10}
                            />
                        </div>
                    </div>

                    {/* Button */}
                    <button
                        type="submit"
                        className="btn btn-primary w-100 btn-lg fw-semibold"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2"></span>
                                Sending OTP...
                            </>
                        ) : (
                            "Send OTP"
                        )}
                    </button>
                </form>

                {/* Extra Links */}
                <div className="text-center mt-3">
                    <a href="/login" className="text-decoration-none">
                        Back to Login
                    </a>
                </div>

            </div>
        </div>
    );
};

export default ForgetPassword;
