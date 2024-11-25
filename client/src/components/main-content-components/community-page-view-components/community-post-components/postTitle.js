const PostTitle = (props) => {
  const {post, setPost, onPageChange, linkFlairs} = props;

  // Helper function to find the flair by ID
  const findLinkFlair = (linkFlairID) => {
    return linkFlairs.find(flair => flair._id === linkFlairID);
  };

  const linkFlair = findLinkFlair(post.linkFlairID);

  return (
    <div className="post-title">
      <a
        onClick={() => {
          setPost(post); // Set the current post
          onPageChange('post-page'); // Navigate to the post page
        }}
        href={post.link || "#"}
      >
        <h1>{post.title}</h1>
      </a>
      {linkFlair ? 
        <div className="link-flair">
          <p>
            {linkFlair.content}
          </p>
        </div>
      : ''}
    </div>
  );
};

export default PostTitle;
