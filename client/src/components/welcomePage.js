import "../stylesheets/welcomePage.css";
import React, { useState } from "react"
import LoginPage from "./welcome-page-components/loginPage";
import RegisterPage from "./welcome-page-components/registerPage";

const WelcomePage = (props) => {


    return (  
        <div className="welcome-page">
            <h1 className="options-container" >Welcome to Phreddit!</h1>
            <div className="options-container">
                <button className="log-in">
                    Log in
                </button>
                <button className="register">
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