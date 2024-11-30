import "../../stylesheets/welcomePage.css";

const RegisterPage = (props) => {
    return ( 
        <div className="register-page">
            <h1 className="register-header">Create a new account</h1>
            <div className="register-container">
                <input type="text" placeholder="Username" />
                <input type="text" placeholder="Email Address" />
                <input type="password" placeholder="Password" />
                <input type = "password" placeholder="Confirm Password" />
                <button className="register-button">
                    Register
                </button>
                <button className="register-back-button" onClick={ () => props.setShowRegisterPage(false) }>
                    Back
                </button>
            </div>
        </div>
     );
}
 
export default RegisterPage;