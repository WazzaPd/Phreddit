const RegisterPage = (props) => {
    return ( 
        <div className="register-page">
            <h1 className="register-header">Create a new account</h1>
            <div className="register-container">
                <input type="text" placeholder="Username" />
                <input type="password" placeholder="Password" />
                <button className="register-button">
                    Register
                </button>
            </div>
        </div>
     );
}
 
export default RegisterPage;