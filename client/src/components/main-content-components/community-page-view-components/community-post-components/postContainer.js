import PostHeader from './postHeader.js';
import PostTitle from './postTitle.js';
import CharCount from './charCount.js';
import StatCounts from './statCount.js';

const PostContainer = (props) => {
  const {post, setPost, onPageChange, linkFlairs, comments } = props;

  return (
    <div className="post-container">
      <PostHeader post={post} /> {/* No need to display the community name */}
      <PostTitle post={post} setPost={setPost} onPageChange={onPageChange} linkFlairs={linkFlairs} />
      <CharCount post={post} />
      <StatCounts divClass="stat-counts" post={post} commentsData={comments}/>
      <div className="dotted-line">
        <p></p>
      </div>
    </div>
  );
};

export default PostContainer;
