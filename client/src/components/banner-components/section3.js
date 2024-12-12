import cursorIcon from "../../imgs/cursor-icon.png";
import chatIcon from "../../imgs/chat-icon.png";
import plusSign from "../../imgs/plus-sign.svg";
import bellNotification from "../../imgs/bell-notifications.png";
import { useAuth } from "../../context/AuthProvider";

const Section3 = (props) => {
    const { onPageChange } = props;
    const { isLoggedIn, logout, user } = useAuth(); // Access authentication state and logout function

    const handleLogout = async () => {
        try {
            await logout(); // Call logout function from AuthProvider
            props.switchWelcomePageOption(); // Redirect to the welcome page
        } catch (error) {
            console.error("Logout failed:", error);
            alert("Logout failed. Please try again.");
        }
    };
    // console.log("isLoggedIn: " + isLoggedIn);
    return (
        <div id="h-section3">
            <img alt="img" src={cursorIcon} />
            <img alt="img" src={chatIcon} />
            
            {isLoggedIn ? (
                <button
                    id="create-post-button"
                    className={`${props.page === `create-post` ? "create-post-highlighted" : ""}`}
                    type="button"
                    onClick={() => onPageChange("create-post")}
                    >
                    <img alt="img" src={plusSign} style={{ maxWidth: "28px" }} />
                    <p>Create Post</p>
                </button>
            ) : (
                <button style = {{color: `grey`}} 
                onClick = {() => alert("User must loggin to create a Post")}>
                    <p>Create Post</p>
                </button>
            )}

            <img alt="img" src={bellNotification} />
            {isLoggedIn ? (
                <button onClick={() => onPageChange("profile")}>User: {user.name}</button>
            ) : (
                <button>User: Guest</button>
            ) }

            {/* Conditionally render the Logout button */}

            {isLoggedIn && (
                <button id="logout-button" type="button" onClick={handleLogout}>
                    Logout
                </button>
            )}
        </div>
    );
};

export default Section3;
