import NavItem from "./navItem";
import NavItemHeader from "./navItemHeader";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthProvider";

const Communities = (props) => {
    const { page, selectedCommunity } = props;
    const [toggle, setToggle] = useState(false);
    const [communitiesData, setCommunitiesData] = useState([]);

    const { isLoggedIn, user } = useAuth();

    const toggleContent = () => {
        setToggle(!toggle);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get("http://localhost:8000/communitiesData");
                setCommunitiesData(res.data);
            } catch (error) {
                if (error.response) {
                    console.error("Response error:", error.response.status);
                    console.error("Response data:", error.response.data);
                } else if (error.request) {
                    console.error("No response received:", error.request);
                } else {
                    console.error("Error setting up request:", error.message);
                }
            }
        };
        fetchData();
    }, [props.refreshTrigger]);

    // Sort communitiesData to place joined communities at the top
    const sortedCommunities = [...communitiesData].sort((a, b) => {
        const isUserInA = a.members.includes(user?.name);
        const isUserInB = b.members.includes(user?.name);
        return isUserInB - isUserInA; // Sort true (1) before false (0)
    });

    return (
        <div id="COMMUNITIES">
            <NavItemHeader
                divClass="has-carret"
                imgClass="carret-img"
                imgAlt="carret Img"
                text="COMMUNITIES"
                onClick={toggleContent}
            />
            {isLoggedIn ? (
                <NavItem
                    divId={
                        page === "create-community"
                            ? "create-community-button-highlighted"
                            : "create-community-button"
                    }
                    divClass={`can-toggle ${toggle ? "show" : ""}`}
                    imgClass="plus-sign-img"
                    imgSrc="plus-sign.svg"
                    imgAlt="plus-sign"
                    text="Create a Community"
                    onClick={() => props.onPageChange("create-community")}
                    style={page === "create-community" ? undefined : { color: "grey" }}
                />
            ) : (
                <NavItem
                    divId="create-community-button-logged-out"
                    divClass={`can-toggle ${toggle ? "show" : ""}`}
                    imgClass="plus-sign-img"
                    imgSrc="plus-sign.svg"
                    imgAlt="plus-sign"
                    text="Create a Community"
                    onClick={() => alert("User must login to create a Community")}
                />
            )}

            {page === "community-page" ? (
                <div id="community-list" className={`can-toggle ${toggle ? "show" : ""}`}>
                    {sortedCommunities.map((community, index) => (
                        <div
                            id={community.name}
                            className={`community-content ${
                                community._id === selectedCommunity
                                    ? "community-page-highlighted"
                                    : ""
                            }`}
                            key={index}
                            onClick={() => props.onPageChange("community-page", community._id)}
                        >
                            <p style={{ textDecoration: "underline" }}>{community.name}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <div id="community-list" className={`can-toggle ${toggle ? "show" : ""}`}>
                    {sortedCommunities.map((community, index) => (
                        <div
                            id={community.name}
                            className="community-content"
                            key={index}
                            onClick={() => props.onPageChange("community-page", community._id)}
                        >
                            <p style={{ textDecoration: "underline" }}>{community.name}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Communities;
