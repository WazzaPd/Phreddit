import { useAuth } from "../../../../context/AuthProvider";
import { useState, useEffect } from "react";
import axios from "axios";

const StatCounts = (props) => {
    const { divClass, post, commentsData } = props;
    const { isLoggedIn } = useAuth();

    const [voteCount, setVoteCount] = useState(post.votes);
    
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

    const handleVote = async (voteType) => {
        if (!isLoggedIn) {
            alert("You must log in to vote.");
            return;
        }

        try {
            const response = await axios.post("http://localhost:8000/postsData/toggle-vote", {
                postId: post._id,
                voteType,
                postedBy: post.postedBy
            });

            setVoteCount(response.data.votes);
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
                    onClick={() => handleVote("upvote")}
                >
                    Upvote ↑
                </button>
                <p
                    style={{
                        display: "inline",
                        fontWeight: "bold",
                        fontSize: "20px",
                        marginLeft: "10px",
                        marginRight: "5px",
                    }}
                >
                    {voteCount}
                </p>
                <button
                    className="downvote-button"
                    onClick={() => handleVote("downvote")}
                >
                    Downvote ↓
                </button>
            </div>
        </div>
    );
};

export default StatCounts;
