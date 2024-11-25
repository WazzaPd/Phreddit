import viewImg from '../../../imgs/views.png';
import commentImg from "../../../imgs/comments.png";

export default function PostPageHeader(props){
    
    const {communitiesData, linkflairsData, commentsData, post} = props;

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
                <p><img alt="views" className="view-img" src={viewImg}></img> {post.views} | <img alt="comment" className="comment-img" src={commentImg}></img> {commentCount}</p>
            </div>
            <button id="add-comment-button" onClick={()=>{
                props.onPageChange('create-comment');
                props.setParentCommentID(undefined);
            }}>Add comment</button>
        </div>
    );
}