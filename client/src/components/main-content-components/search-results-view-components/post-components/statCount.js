import { useAuth } from "../../../../context/AuthProvider";
import { useState, useEffect } from "react";
import axios from "axios";

const StatCounts = (props) => {
    const { divClass, post, commentsData } = props;
    const { user, isLoggedIn } = useAuth();

    const [voteCount, setVoteCount] = useState(post.votes);
    const [upVoteUsers, setUpVoteUsers] = useState([...post.upVoteUsers]);
    const [downVoteUsers, setDownVoteUsers] = useState([...post.downVoteUsers]);
    const [hasUpvoted, setHasUpvoted] = useState(false);
    const [hasDownvoted, setHasDownvoted] = useState(false);

    useEffect(() => {
        if (isLoggedIn && user?.name) {
            setHasUpvoted(upVoteUsers.includes(user.name));
            setHasDownvoted(downVoteUsers.includes(user.name));
        } else {
            setHasUpvoted(false);
            setHasDownvoted(false);
        }
    }, [upVoteUsers, downVoteUsers, user, isLoggedIn]);


    
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

    const toggleVote = async (voteType) => {
        if (!isLoggedIn) {
            alert("You must log in to vote.");
            return;
        }

        try {
            const response = await axios.post("http://localhost:8000/postsData/toggle-vote", {
                postId: post._id,
                voteType,
            });

            setVoteCount(response.data.votes);
            setUpVoteUsers(response.data.upVoteUsers);
            setDownVoteUsers(response.data.downVoteUsers);
        } catch (error) {
            console.error("Error toggling vote:", error.response?.data || error.message);
            alert("Failed to update vote. Please try again.");
        }
    };

    const commentCount = countComments(post);

    // console.log("hasUpvoted: " + hasUpvoted);
    return (
        <div className={divClass}>
            <div>
                {post.views} views | {commentCount} comments |
                <button
                    className="upvote-button"
                    onClick={() => toggleVote("upvote")}
                    style={hasUpvoted ? { backgroundColor: "rgb(255, 68, 51)" } : {}}
                >
                    Upvote ↑
                </button>
                <p style = {{display: "inline", fontWeight: "bold", fontSize: "20px", marginLeft: "10px", marginRight: "5px"}}>{voteCount}</p>
                <button
                    className="downvote-button"
                    onClick={() => toggleVote("downvote")}
                    style={hasDownvoted ? { backgroundColor: "rgb(255, 68, 51)" } : {}}
                >
                    Downvote ↓
                </button>
            </div>
        </div>
    );
};

export default StatCounts;
