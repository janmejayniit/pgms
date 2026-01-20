import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";

const VerifyOTP = () => {
    const API_URL = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();
    const location = useLocation();

    // Passed from ForgetPassword page
    const contactNumber = location.state?.contactNumber;

    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(60);

    // Redirect if no mobile number
    useEffect(() => {
        if (!contactNumber) {
            navigate("/forget-password");
        }
    }, [contactNumber, navigate]);

    // Countdown Timer
    useEffect(() => {
        if (timer === 0) return;

        const interval = setInterval(() => {
            setTimer(prev => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [timer]);

    // Verify OTP
    const handleVerify = async (e) => {
        e.preventDefault();

        if (!/^[0-9]{6}$/.test(otp)) {
            toast.error("Enter valid 6-digit OTP");
            return;
        }

        try {
            setLoading(true);

            await axios.post(`${API_URL}/auth/verify-otp/`, {
                contact_number: contactNumber,
                otp: otp
            });

            toast.success("OTP verified successfully");

            navigate("/reset-password", {
                state: { contactNumber }
            });

        } catch (error) {
            toast.error(error.response?.data?.message || "Invalid OTP");
        } finally {
            setLoading(false);
        }
    };

    // Resend OTP
    const handleResend = async () => {
        try {
            await axios.post(`${API_URL}/auth/send-otp/`, {
                contact_number: contactNumber
            });

            toast.success("OTP resent successfully");
            setTimer(60);
            setOtp("");
        } catch {
            toast.error("Failed to resend OTP");
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="card shadow-lg p-4 rounded-4" style={{ width: "380px" }}>

                <h4 className="text-center fw-bold text-primary mb-2">
                    Verify OTP
                </h4>
                <p className="text-center text-muted">
                    OTP sent to <strong>{contactNumber}</strong>
                </p>

                <form onSubmit={handleVerify} autoComplete="off">

                    <input
                        type="text"
                        className="form-control text-center fs-4 fw-bold mb-3"
                        placeholder="Enter OTP"
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    />

                    <button
                        type="submit"
                        className="btn btn-primary w-100 btn-lg"
                        disabled={loading}
                    >
                        {loading ? "Verifying..." : "Verify OTP"}
                    </button>
                </form>

                <div className="text-center mt-3">
                    {timer > 0 ? (
                        <span className="text-muted">
                            Resend OTP in <strong>{timer}s</strong>
                        </span>
                    ) : (
                        <button
                            className="btn btn-link p-0"
                            onClick={handleResend}
                        >
                            Resend OTP
                        </button>
                    )}
                </div>

            </div>
        </div>
    );
};

export default VerifyOTP;
