import { useAuth } from "../../context/AuthProvider";
import { useState, useEffect } from "react";
import EditCommentPage from "./profile-page-components/editCommentPage";
import "../../stylesheets/profilePageView.css";
import axios from "axios";

const ProfilePageView = (props) => {
    const { user } = useAuth(); 
    const [activeTab, setActiveTab] = useState("posts"); 
    const [listings, setListings] = useState([]);
    const [postsToCommentIDs, setPostsToCommentIDs] = useState(new Map());
    const [userComments, setUserComments] = useState([]);
    const [reputation, setUserReputation] = useState([]);

    const { onPageChange, setCommunityID, setPostID, setCommentID } = props;

    useEffect(() => {
        async function fetchData() {
            try {
              const reputationRes = await axios.post('http://localhost:8000/usersData/getUserReputation');
                
              await setUserReputation(reputationRes.data);

            } catch (error) {
                console.error("Error fetching data:", error);
            } 
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (user && activeTab === "posts") {
            fetchPostListings();
        } else if (user && activeTab === "communities") {
            fetchCommunityListings();
        } else if (user && activeTab === "comments") {
            fetchCommentListings();
        } 
    }, [user, activeTab]);

    const fetchUserListings = async () => {
        try {
            const response = await axios.get("http://localhost:8000/usersData/getAllUsers");
            const userListing = response.data;

            setListings(userListing);
        } catch (error) {
            console.error("Failed to fetch user listings:", error.response?.data || error.message);
            setListings([]);
        }
    };

    const fetchPostListings = async () => {
        try {
            const response = await axios.get("http://localhost:8000/postsData");
            const posts = response.data;

            const postsListing = posts
                .filter((post) => post.postedBy === user.name)
                .map((post) => ({
                    _id: post._id,
                    title: post.title,
                    content: post.content
                }));

            setListings(postsListing);
        } catch (error) {
            console.error("Failed to fetch post listings:", error.response?.data || error.message);
            setListings([]);
        }
    };

    const fetchCommunityListings = async () => {
        try {
            const response = await axios.get("http://localhost:8000/communitiesData");
            const communities = response.data;

            const communityListing = communities
                .filter((community) => community.members.includes(user.name))
                .map((community) => ({
                    _id: community._id,
                    name: community.name
                    // description: community.description
                }));

            setListings(communityListing);
        } catch (error) {
            console.error("Failed to fetch community listings:", error.response?.data || error.message);
            setListings([]);
        }
    };

    const fetchCommentListings = async () => {
        try {
            const postsResponse = await axios.get("http://localhost:8000/postsData");
            const commentsResponse = await axios.get("http://localhost:8000/commentsData");

            const posts = postsResponse.data;
            const comments = commentsResponse.data;

            const newPostsToCommentIDs = new Map();
            const newUserComments = [];

            // Build postsToCommentIDs map
            const buildCommentMap = (commentIDs, postId) => {
                for (const commentID of commentIDs) {
                    const comment = comments.find((c) => c._id === commentID);
                    if (!comment) continue;

                    if (!newPostsToCommentIDs.has(postId)) {
                        newPostsToCommentIDs.set(postId, []);
                    }
                    newPostsToCommentIDs.get(postId).push(comment);

                    // Perform DFS for nested comments
                    if (comment.commentIDs.length > 0) {
                        buildCommentMap(comment.commentIDs, postId);
                    }
                }
            };

            // Populate postsToCommentIDs
            for (const post of posts) {
                buildCommentMap(post.commentIDs, post._id);
            }

            // Find comments created by the user
            for (const comment of comments) {
                if (comment.commentedBy === user.name) {
                    newUserComments.push(comment);
                }
            }

            // Prepare the final listing
            const commentsListing = [];
            for (const [postId, postComments] of newPostsToCommentIDs.entries()) {
                const post = posts.find(p => p._id === postId);
                for (const comment of newUserComments) {
                    if (postComments.some((c) => c._id === comment._id)) {
                        commentsListing.push({
                            postTitle: post.title,
                            commentContent: comment.content.slice(0, 20),
                            postId: postId,
                            commentId: comment._id
                        });
                    }
                }
            }

            // Update state
            setPostsToCommentIDs(newPostsToCommentIDs);
            setUserComments(newUserComments);
            setListings(commentsListing);
        } catch (error) {
            console.error("Failed to fetch comment listings:", error.response?.data || error.message);
            setListings([]);
        }
    };

    const handleLoginAsUser = async (userId) => {
        try {
            const response = await axios.post('http://localhost:8000/auth/admin/switch-user', { userId }, { withCredentials: true });

            if (response.status === 200) {
                window.location.reload(); // Refresh to apply the user session
            }
        } catch (error) {
            console.error('Error switching user:', error.response?.data || error.message);
            alert(error.response?.data?.message || 'Failed to switch user.');
        }
    };
    

    const handleTabClick = (type) => {
        setActiveTab(type);
        if (type === "posts") {
            fetchPostListings();
        } else if (type === "communities") {
            fetchCommunityListings();
        } else if (type === "comments") {
            fetchCommentListings();
        } else if (type === "users") {  
            fetchUserListings();
        }
    };

    const handleDeleteUser = async (userId, userName) => {
        try {
            const confirmDelete = window.confirm(
                `Are you sure you want to delete user "${userName}"? This will also delete all their communities, posts, and comments. This action cannot be undone.`
            );
                
            if (confirmDelete) {
                await axios.delete(`/usersData/delete/${userId}`, {
                    withCredentials: true
                });
                    
                alert("User and all associated content deleted successfully");
                handleTabClick("users"); // Refresh the users list
            }
        } catch (err) {
            console.error("Error deleting user:", err);
            alert(err.response?.data?.message || "Failed to delete user");
        }
    };

    const renderListings = () => {
        if (activeTab === "users") {
            return listings.map((user) => (
                user.hasOwnProperty("email") && (
                <div key={user._id} className="listing-item">
                    <a href={``}>
                        UserName: {user.name}
                        <br/>
                        Email: {user.email}
                        <br/> 
                        Reputation: {user.reputation}
                    </a>
                    <div style={{ marginTop: '10px' }}>
                        {(!user.email.includes('@admin.com')) && (
                            <button onClick={() => handleLoginAsUser(user._id)}>Login as User</button>
                        )}
                        <button 
                            onClick={() => handleDeleteUser(user._id, user.name)}
                            style={{ marginLeft: '10px', backgroundColor: '#ff4444' }}
                        >
                            Delete User
                        </button>
                    </div>
                    <br/>
                    <br/>
                </div>
            )));
        } else if (activeTab === "communities") {
            return listings.map((community) => (
                <div key={community._id} className="listing-item">
                    <a style={{ fontWeight: "bold", display: "inline" }}
                        onClick={() => {
                            setCommunityID(community._id);
                            onPageChange("edit-community-page");
                        }}
                        >{community.name}</a>
                    <br/>
                    <br/>
                    <br/>
                </div>
            ));
        } else if (activeTab === "posts") {
            return listings.map((post) => (
                <div key={post._id} className="listing-item">
                    <a style={{ fontWeight: "bold", display: "inline" }}
                        onClick={() => {
                            setPostID(post._id);
                            onPageChange("edit-post-page");
                        }}
                        >{post.title}</a>
                    <br/>
                    <br/>
                    <br/>
                </div>
            ));
        } else if (activeTab === "comments") {
            return listings.map((listing, index) => (
                <div key={index} className="listing-item">
                    <a onClick={() => {
                        setCommentID(listing.commentId);
                        onPageChange("edit-comment-page");
                    }}>
                        <p style={{ fontWeight: "bold", display: "inline", color: "rgb(255, 68, 51)" }}> Post: </p>
                        {listing.postTitle}, 
                        <p style={{ fontWeight: "bold", display: "inline", color: "rgb(255, 68, 51)" }}> Commented: </p>
                        {listing.commentContent}
                    </a>
                    <br/>
                    <br/>
                    <br/>
                </div>
            ));
        }
        return <p>Select a tab to view listings.</p>;
    };

    console.log(user.email);

    return (
        <div id="profile-page-view">
            <div className="profile-header">
                <h2>{user?.name}</h2>
                <p>Email: {user?.email}</p>
                <p>Member since: {new Date(user?.createdAt).toLocaleDateString()}</p>
                <p>Reputation: {reputation}</p>
            </div>

            <hr />

            <div className="profile-tabs">
                { user.email.includes('@admin.com') && (
                    <button
                        className={activeTab === "users" ? "active" : ""}
                        onClick={() => handleTabClick("users")}
                    >
                        Users
                    </button>
                )}
                <button
                    className={activeTab === "communities" ? "active" : ""}
                    onClick={() => handleTabClick("communities")}
                >
                    Communities
                </button>
                <button
                    className={activeTab === "posts" ? "active" : ""}
                    onClick={() => handleTabClick("posts")}
                >
                    Posts
                </button>
                <button
                    className={activeTab === "comments" ? "active" : ""}
                    onClick={() => handleTabClick("comments")}
                >
                    Comments
                </button>
            </div>
            <div className="profile-listings">{renderListings()}</div>
        </div>
    );
};

export default ProfilePageView;
