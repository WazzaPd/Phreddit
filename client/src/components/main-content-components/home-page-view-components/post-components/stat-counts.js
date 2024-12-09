import { useAuth } from "../../../../context/AuthProvider";
import { useState, useEffect } from "react";
import axios from "axios";

const StatCounts = (props) => {
    const { divClass, post, commentsData } = props;
    const { user, isLoggedIn } = useAuth();

    const [upvoteCount, setUpvoteCount] = useState(post.upvote);
    const [upvoteUsers, setUpvoteUsers] = useState([...post.upvoteUsers]);
    const [hasUpvoted, setHasUpvoted] = useState(upvoteUsers.includes(user?.name));

    useEffect(() => {
        if(isLoggedIn){
            setHasUpvoted(upvoteUsers.includes(user.name));
        }
    }, [upvoteUsers, user]);
    
    const countComments = (post) => {
        let count = 0;
        for (let commentID of post.commentIDs) {
            count += 1 + DFS(commentID);
        }
        return count;
    };

    const DFS = (commentID) => {
        if (!commentID) {
            return 0;
        }
        let comment = commentsData.find((c) => c._id === commentID);
        if (!comment) {
            return 0;
        }
        let count = 0;
        for (let c of comment.commentIDs) {
            count += 1 + DFS(c);
        }
        return count;
    };

    const toggleUpvote = async () => {
        try {
            if(!isLoggedIn){
                alert("Must loggin to upvote");
                return;
            }
            const response = await axios.post("http://localhost:8000/postsData/toggle-upvote", {
                postId: post._id,
            });

            const newUpvoteUsers = response.data.upvoteUsers;
            setUpvoteCount(response.data.upvote);
            setUpvoteUsers(newUpvoteUsers);

        } catch (error) {
            console.error("Error toggling upvote:", error.response?.data || error.message);
            alert("Failed to update upvote. Please try again.");
        }
    };

    const commentCount = countComments(post);
    return (
        <div className={divClass}>
            <div>
                {post.views} views |
                {commentCount} comments |
                <button className="upvote-button" onClick={toggleUpvote}>
                    {hasUpvoted ? "Remove Upvote ↓" : "Upvote ↑"}
                </button>
                : {upvoteCount}
            </div>
        </div>
    );
};

export default StatCounts;
