const PostHeader = (props) => {
  const {post} = props;

  const timeAgo = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day(s) ago`;
    if (hours > 0) return `${hours} hour(s) ago`;
    if (minutes > 0) return `${minutes} minute(s) ago`;
    return `${seconds} second(s) ago`;
  };

  return (
    <div className="post-header">
      <p>{post.postedBy} | {timeAgo(post.postedDate)}</p> {/* Show only username and timestamp */}
    </div>
  );
};

export default PostHeader;
