import "../../stylesheets/welcomePage.css";
import { useState } from "react";
import { useAuth } from "../../context/AuthProvider";
import axios from "axios";

const LoginPage = (props) => {
    const { login, setIsloggedIn } = useAuth(); // AuthProvider function to handle login
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        props.handlePageChange("home");
        e.preventDefault();
        if (!email || !password) {
            setError("Email and password are required.");
            return;
        }

        try {
            //const response = await axios.post("auth/login", { email, password });
            await login(email, password); // Update the auth context with the logged-in user
            setError(""); // Clear any previous errors
            props.switchWelcomePageOption(); // Redirect to Phreddit
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message); // Display specific backend error
            } else {
                console.log(err);
                console.log(err.response);
                setError("Login failed. Please try again.");
            }
        }
    };

    return (
        <div className="login-page">
            <h1 className="login-header">Log in to Phreddit</h1>
            <div className="login-container">
                {error && <p className="error-message">{error}</p>}
                <input
                    type="text"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button className="login-button" onClick={handleSubmit}>
                    Log in
                </button>
                <button className="login-back-button" onClick={() => props.setShowLoginPage(false)}>
                    Back
                </button>
            </div>
        </div>
    );
};

export default LoginPage;
