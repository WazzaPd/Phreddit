import "../../stylesheets/welcomePage.css";
import { useAuth } from "../context/AuthProvider";

const LoginPage = (props) => {
    const { isLoggedIn, user, login, logout } = useAuth();
    return ( 
        <div className="login-page">
            <h1 className="login-header">Log in to Phreddit</h1>
            <div className="login-container">
                <input type="text" placeholder="Email Address" />
                <input type="password" placeholder="Password" />
                <button className="login-button">
                    Log in
                </button>
                <button className="login-back-button" onClick={ () => props.setShowLoginPage(false) }>
                    Back
                </button>
            </div>
        </div>
     );
}
 
export default LoginPage;