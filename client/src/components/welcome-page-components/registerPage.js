import "../../stylesheets/welcomePage.css";
import { useState } from "react";
import axios from "axios";

const RegisterPage = (props) => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        displayName: "",
        password: "",
        confirmPassword: ""
    });

    const [errors, setErrors] = useState([]);
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password, firstName, lastName, displayName, email) => {
        const forbiddenWords = [
            firstName?.toLowerCase() || "",
            lastName?.toLowerCase() || "",
            displayName?.toLowerCase() || "",
            email?.toLowerCase() || ""
        ];
        return !forbiddenWords.some(word => password.toLowerCase().includes(word));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { firstName, lastName, email, displayName, password, confirmPassword } = formData;

        let validationErrors = [];

        // Frontend validation
        const missingFields = [];
        if (!firstName) missingFields.push("First name");
        if (!lastName) missingFields.push("Last name");
        if (!email) missingFields.push("Email");
        if (!displayName) missingFields.push("Display name");
        if (!password) missingFields.push("Password");
        if (!confirmPassword) missingFields.push("Confirm password");
        if (missingFields.length > 0) validationErrors.push("All fields are required");

        if (email && !validateEmail(email)) validationErrors.push("Invalid email format");

        if (password !== confirmPassword) validationErrors.push("Passwords do not match");

        // Only validate password restrictions if all required fields are filled
        if (firstName && lastName && displayName && email && password && confirmPassword) {
            if (!validatePassword(password, firstName, lastName, displayName, email)) {
                validationErrors.push("Password cannot contain your first name, last name, display name, or email");
            }
        }

        if (validationErrors.length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const response = await axios.post("http://localhost:8000/auth/register", {
                firstName,
                lastName,
                displayName,
                email,
                password
            });
            setSuccess(response.data.message); // Show success message
            setErrors([]); // Clear errors
            props.setShowRegisterPage(false); // Redirect to welcome page
        } catch (err) {
            const serverErrors = [];
            if (err.response && err.response.data && err.response.data.message) {
                serverErrors.push(err.response.data.message); // Add specific backend error
            } else {
                serverErrors.push("Registration failed. Please try again.");
            }
            setErrors(serverErrors);
        }
    };

    return (
        <div className="register-page">
            <h1 className="register-header">Create a new account</h1>
            <div className="register-container">
                {errors.length > 0 && (
                    <div className="error-messages">
                        {errors.map((error, index) => (
                            <p key={index} className="error-message">{error}</p>
                        ))}
                    </div>
                )}
                {success && <p className="success-message">{success}</p>}
                <input
                    type="text"
                    name="firstName"
                    placeholder="First Name *"
                    value={formData.firstName}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name *"
                    value={formData.lastName}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="email"
                    placeholder="Email Address *"
                    value={formData.email}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="displayName"
                    placeholder="Display Name *"
                    value={formData.displayName}
                    onChange={handleChange}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password *"
                    value={formData.password}
                    onChange={handleChange}
                />
                <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password *"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                />
                <button className="register-button" onClick={handleSubmit}>
                    Sign Up
                </button>
                <button className="register-back-button" onClick={() => props.setShowRegisterPage(false)}>
                    Back
                </button>
            </div>
        </div>
    );
};

export default RegisterPage;
