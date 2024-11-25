import PostContainer from './community-post-components/postContainer.js';

const CommunityPosts = (props) => {
  const {community, posts, comments, linkflairs, setPost, onPageChange, communityPosts} = props;

  return (
    <div>
      {communityPosts.map((post, index) => (
        <PostContainer 
          key={index} 
          post={post} 
          setPost={setPost}
          onPageChange={onPageChange} 
          linkFlairs={linkflairs}
          //data = {data}
          community={community}
          posts={posts}
          comments={comments}
          linkflairs={linkflairs}
        />
      ))}
    </div>
  );
};

export default CommunityPosts;
