import CharCount from "./charCount";
import PostTitle from "./postTitle";
import PostHeader from "./postHeader";
import StatCounts from "./statCount";

const PostContainer = (props) => {
    const { post, communities, linkFlairs, postsData, commentsData } = props;

    return ( 
        <div className="post-container">
            <PostHeader divClass="post-header" post={post} communities={communities} />
            <PostTitle divClass="post-title" onPageChange={props.onPageChange} setPost={props.setPost} post={post} linkFlairs={linkFlairs} />
            <CharCount divClass="char-count" post={post} />
            <StatCounts divClass="stat-counts" 
                post={post} 
                //data={data}
                communitiesData={communities}
                linkFlairsData={linkFlairs}
                commentsData={commentsData}
                postsData={postsData}
            />
            <div className="dotted-line">
                <p></p>
            </div>
        </div>
    );
}

export default PostContainer;
