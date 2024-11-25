const PostTitle = (props) => {
    const { divClass, post, linkflairsData, onPageChange, setPost } = props;
    
    const linkFlair = linkflairsData.find(flair => flair._id === post.linkFlairID);

    return (  
        <div className={divClass}>
            <a onClick={() => {
                setPost(post);
                onPageChange('post-page');
                }} href={post.link || "#"}>
                    <h1>{post.title}</h1>
                </a>
            {linkFlair === undefined || linkFlair.content === 'default' ? '' : (
                <div className="link-flair">
                    <p>
                        {linkFlair.content}
                    </p>
                </div>
            )}
        </div>
    );
}

export default PostTitle;
