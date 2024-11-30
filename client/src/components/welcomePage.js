import "../stylesheets/welcomePage.css";
import React, { useState } from "react"
import LoginPage from "./welcome-page-components/loginPage";
import RegisterPage from "./welcome-page-components/registerPage";

const WelcomePage = (props) => {
    const [showRegisterPage, setShowRegisterPage] = useState(false);
    const [showLoginPage, setShowLoginPage] = useState(false);

    if(showRegisterPage) {
        return (
            <RegisterPage setShowRegisterPage = {setShowRegisterPage}/>
        )
    }

    if(showLoginPage) {
        return (
            <LoginPage setShowLoginPage = {setShowLoginPage} />
        )
    }

    return (  
        <div className="welcome-page">
            <h1 className="options-container" >Welcome to Phreddit!</h1>
            <div className="options-container">
                <button className="log-in" onClick = {() => setShowLoginPage(true)}>
                    Log in
                </button>
                <button className="register" onClick = { () => setShowRegisterPage(true) }>
                    Register Account
                </button>
                <button className="continue-as-guest" onClick = { () => props.switchWelcomePageOption() }>
                    Continue as Guest
                </button>
            </div>
        </div>
        
    );
}
 
export default WelcomePage;