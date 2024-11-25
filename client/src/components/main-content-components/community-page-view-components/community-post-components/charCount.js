const CharCount = (props) => {
  const {post} = props;

  // Limit content to 80 characters
  const truncatedContent = post.content.length > 80 ? post.content.substring(0, 80) + "..." : post.content;

  return (
    <div className="char-count">
      <p>{truncatedContent}</p>
    </div>
  );
};

export default CharCount;
