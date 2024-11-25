const CharCount = (props) => {
    const { divClass, post } = props;
    
    //80 characters
    const truncatedContent = post.content.length > 80 ? post.content.substring(0, 80) + "..." : post.content;

    return (  
        <div className={divClass}>
            <p>{truncatedContent}</p>
        </div>
    );
}
 
export default CharCount;
