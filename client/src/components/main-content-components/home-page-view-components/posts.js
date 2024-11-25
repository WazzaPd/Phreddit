import PostContainer from './post-components/post-container.js';

const Posts = (props) => {
    const { postData, communitiesData, commentsData, linkflairsData } = props;
    return (
        <div>
            {postData.map((post, index) => (
                <PostContainer 
                    key={index} 
                    post={post} 
                    communitiesData={communitiesData} 
                    linkflairsData={linkflairsData} 
                    setPost={props.setPost}
                    commentsData={commentsData}
                    onPageChange={props.onPageChange}
                />
            ))}
        </div>
    );
}

export default Posts;