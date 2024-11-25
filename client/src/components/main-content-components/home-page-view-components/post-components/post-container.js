import CharCount from "./char-count";
import PostTitle from "./post-title";
import PostHeader from "./post-header";
import StatCounts from "./stat-counts";

const PostContainer = (props) => {
    const { post, communitiesData, commentsData, linkflairsData } = props;

    return ( 
        <div className="post-container">
            <PostHeader divClass="post-header" post={post} communitiesData={communitiesData} />
            <PostTitle divClass="post-title" onPageChange={props.onPageChange} setPost={props.setPost} post={post} linkflairsData={linkflairsData} />
            <CharCount divClass="char-count" post={post} />
            <StatCounts divClass="stat-counts" post={post} commentsData={commentsData}/>
            <div className="dotted-line">
                <p></p>
            </div>
        </div>
    );
}

export default PostContainer;
