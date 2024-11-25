const PostTitle = (props) => {
    const { divClass, post, linkFlairs } = props;
    
    const linkFlair = linkFlairs.find(flair => flair._id === post.linkFlairID);
  
    console.log("from post Title this is linkFlair : ", linkFlair);
    console.log("from post Title this is post : ", post);
    console.log("from post Title this is post title : ", post.title);
    console.log("--------------------------------------------------------------------------------");
  
    return (  
        <div className={divClass}>
            <a onClick={() => {
                props.setPost(post);
                props.onPageChange('post-page');
              }} href={post.link || "#"}>
                {console.log("inside div post type: ", post)}
                {console.log("inside div post type: ", post.title)}
                <h1>{post.title}</h1>
            </a>
  
            {/* Conditionally render the link flair if it exists and is not 'default' */}
            {linkFlair && linkFlair.content !== 'default' && (
                <div className="link-flair">
                    <p>{linkFlair.content}</p>
                </div>
            )}
        </div>
    );
  }
  
  export default PostTitle;
  