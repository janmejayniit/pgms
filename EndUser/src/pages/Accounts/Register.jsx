import {useState} from 'react';
import './Register.css';
import { toast } from "react-toastify";

const Register = () => {
    const API_URL = import.meta.env.VITE_API_URL;
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        contact_number: '',
        email: '',
        password: '',
        password2: '',
        is_owner: false,
        is_tenant: true,
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const payload = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            payload.append(key, value);
        });

        try {
            const response = await fetch(`${API_URL}/auth/register/`, {
                method: 'POST',
                body: payload,
            });
            const result = await response.json();
            if (response.status === 201) {
                toast.success("You have successfully registered!");
                setFormData({
                    first_name: '',
                    last_name: '',
                    contact_number: '',
                    email: '',
                    password: '',
                    password2: '',
                    is_owner: false,
                    is_tenant: false,
                });
            } if (response.status === 400) {
                toast.error("There is some error occurred");
            }
        } catch (err) {
            toast.error("There is some error occurred");
            console.error('Registration error:', err);
        }finally {
            setLoading(false)
        }
    };

    return (
        <div className="container mt-3">
            <div className="row justify-content-center my-5">
                <div className="col-md-6 col-lg-5">
                    <div className="card shadow-lg border-0 rounded-4">
                        <div className="card-header bg-primary text-white text-center py-3 rounded-top">
                            <h4 className="mb-0">
                                <i className="bi bi-person-plus-fill me-2"></i>
                                Create Account
                            </h4>
                        </div>
                        <div className="card-body p-4">
                            <form onSubmit={handleSubmit}>

                                {/* First Name + Last Name */}
                                <div className="row">
                                    <div className="col-md-6 col-sm-12 mb-3">
                                        <label className="form-label fw-semibold">First Name</label>
                                        <div className="input-group">
                <span className="input-group-text bg-light">
                  <i className="bi bi-person"></i>
                </span>
                                            <input
                                                name="first_name"
                                                type="text"
                                                className="form-control"
                                                placeholder="John"
                                                value={formData.first_name}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-6 col-sm-12 mb-3">
                                        <label className="form-label fw-semibold">Last Name</label>
                                        <div className="input-group">
                <span className="input-group-text bg-light">
                  <i className="bi bi-person"></i>
                </span>
                                            <input
                                                name="last_name"
                                                type="text"
                                                className="form-control"
                                                placeholder="Doe"
                                                value={formData.last_name}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Number */}
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Contact Number</label>
                                    <div className="input-group">
              <span className="input-group-text bg-light">
                <i className="bi bi-telephone"></i>
              </span>
                                        <input
                                            name="contact_number"
                                            type="text"
                                            className="form-control"
                                            placeholder="9876543210"
                                            value={formData.contact_number}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Email</label>
                                    <div className="input-group">
              <span className="input-group-text bg-light">
                <i className="bi bi-envelope"></i>
              </span>
                                        <input
                                            name="email"
                                            type="email"
                                            className="form-control"
                                            placeholder="you@example.com"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Password */}
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Password</label>
                                    <div className="input-group">
              <span className="input-group-text bg-light">
                <i className="bi bi-lock"></i>
              </span>
                                        <input
                                            name="password"
                                            type="password"
                                            className="form-control"
                                            placeholder=""
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Confirm Password */}
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Confirm Password</label>
                                    <div className="input-group">
              <span className="input-group-text bg-light">
                <i className="bi bi-shield-lock"></i>
              </span>
                                        <input
                                            name="password2"
                                            type="password"
                                            className="form-control"
                                            placeholder=""
                                            value={formData.password2}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* User Type */}
                                <div className="mb-3">
                                    <label className="form-check-label fw-semibold">
                                        <input
                                            type="checkbox"
                                            name="agree_terms"
                                            className="form-check-input me-2"
                                            checked={formData.agree_terms}
                                            onChange={handleChange}
                                            required
                                        />
                                        I agree to the{" "}
                                        <span
                                            className="text-primary"
                                            role="button"
                                            data-bs-toggle="modal"
                                            data-bs-target="#termsModal"
                                        >
                                          Terms & Conditions
                                        </span>
                                    </label>
                                </div>

                                {/* Submit Button */}
                                <div className="d-grid mt-4">
                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-lg"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2"></span>
                                                Please wait...
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-check-circle me-2"></i>
                                                Register
                                            </>
                                        )}
                                    </button>


                                </div>
                                <div className="text-center mt-2">
                                    <small>
                                        You have an account? <a href="/login" className="text-primary">Login</a>
                                    </small>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            </div>
            {/* Terms & Conditions Modal */}
            <div
                className="modal fade"
                id="termsModal"
                tabIndex="-1"
                aria-labelledby="termsModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="termsModalLabel">Terms & Conditions</h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>

                        <div className="modal-body">
                            <h6>1. User Responsibilities</h6>
                            <p>
                                By registering, you agree to provide accurate and truthful information.
                                Any misuse or false data may result in account suspension.
                            </p>

                            <h6>2. Privacy Policy</h6>
                            <p>
                                We respect your privacy. Your personal information will never be shared
                                with third parties without your consent.
                            </p>

                            <h6>3. Reviews & Ratings</h6>
                            <p>
                                Any review posted must be genuine, non-abusive, and must follow the
                                community guidelines.
                            </p>

                            <h6>4. Account Security</h6>
                            <p>
                                You are responsible for maintaining the confidentiality of your login
                                credentials and activities on your account.
                            </p>

                            <h6>5. Legal</h6>
                            <p>
                                By using this platform, you agree to comply with all applicable laws
                                and regulations.
                            </p>

                            <p className="mt-3">
                                For complete details, please contact support.
                            </p>
                        </div>

                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                data-bs-dismiss="modal"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;