const StatCounts = (props) => {
    const { divClass, post, commentsData } = props;

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

    return ( 
        <div className={divClass}>
            <p>{post.views} views | {commentCount} comments</p>
        </div>
    );
}
 
export default StatCounts;
