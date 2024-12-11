import viewImg from '../../../imgs/views.png';
import commentImg from "../../../imgs/comments.png";
import { useAuth } from "../../../context/AuthProvider";
import axios from 'axios';
import { react, useState } from 'react';

export default function PostPageHeader(props){
    
    const {communitiesData, linkflairsData, commentsData, post} = props;
    const [voteCount, setVoteCount] = useState(post.votes);
    const { isLoggedIn } = useAuth();

    const community = communitiesData.find(community => community.postIDs.includes(post._id));
    let linkFlair = linkflairsData.find(flair => flair._id === post.linkFlairID);

    function countComments(post){
        let count = 0;
        for(let commentID of post.commentIDs){
            count += 1 + DFS(commentID);
        }
        return count;
    }

    function DFS(commentID){
        if(!commentID){
            return 0;
        }
        let comment = commentsData.find(c => c._id === commentID);
        if(!comment){
            return 0;
        }
        let count = 0;
        for(let c of comment.commentIDs){
            count += 1 + DFS(c);
        }
        return count;
    }

    const commentCount = countComments(post);

    const handleVote = async (voteType) => {
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
        } catch (error) {
            console.error("Error toggling vote:", error.response?.data || error.message);
            alert("Failed to update vote. Please try again.");
        }
    };
    
    return(
        <div id="post-page-header-container">
            <div id="community-time-container">
                <p>r/{community.name} | 1 month ago</p>
            </div>
            <div id="username-container">
                <p>{post.postedBy}</p>
            </div>
            <div id="post-title-container">
                <h1>{post.title}</h1>
            </div>
            {linkFlair === undefined || linkFlair.content === 'default' ? '' : (
                <div id="link_flair_container">{linkFlair.content}</div>
            )}
            <div id="post-content-container">
                <p>{post.content}</p>
            </div>
            <div id="view-comment-container">
                <p>
                    <img alt="views" className="view-img" src={viewImg}></img> {post.views} |
                    <img alt="comment" className="comment-img" src={commentImg}></img> {commentCount} |
                    {isLoggedIn && <button className="upvote-button" onClick={() => handleVote("upvote")}>Upvote ↑</button>}
                    <p style = {{display: "inline", fontWeight: "bold"}}> votes: {voteCount}</p>
                    {isLoggedIn && <button className="downvote-button" onClick={() => handleVote("downvote")}>Downvote ↓</button>}
                    
                </p>
            </div>
            {isLoggedIn && <button id="add-comment-button" onClick={()=>{
                props.onPageChange('create-comment');
                props.setParentCommentID(undefined);
            }}>Add comment</button>     /*Displaying only if logged in*/
            } 
        </div>
    );
}