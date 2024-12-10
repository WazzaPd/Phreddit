import cursorIcon from "../../imgs/cursor-icon.png";
import chatIcon from "../../imgs/chat-icon.png";
import plusSign from "../../imgs/plus-sign.svg";
import bellNotification from "../../imgs/bell-notifications.png";
import pfpPhoto from "../../imgs/pfp-photo.png";
import { useEffect, useState } from 'react';
import { useAuth } from "../../context/AuthProvider";
import axios from 'axios';

const Section3 = (props) => {
    const { onPageChange } = props;
    const { isLoggedIn, logout } = useAuth(); // Access authentication state and logout function

    const [username, setUsername] = useState("Guest");

    useEffect(() => {
        const fetchData = async() => {
            try{
                const res = await axios.get('http://localhost:8000/usersData/getUsername', {
                    withCredentials: true, // Ensure cookies are included
                  });
                setUsername(res.data.displayName);
            } catch (error) {
                if (error.response) {
                    // The request was made and the server responded with a status code
                    console.error('Response error:', error.response.status);
                    console.error('Response data:', error.response.data);
                  } else if (error.request) {
                    // The request was made but no response was received
                    console.error('No response received:', error.request);
                  } else {
                    // Something else caused the error
                    console.error('Error setting up request:', error.message);
                  }
            }
        }
        fetchData();
    });

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
                // ! TO DO: this button should redirect to user profile (user profile button)
                // should display the username
                <button onClick={() => onPageChange("profile")}>User: {username}</button>
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
