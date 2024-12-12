import { useEffect, useState, useCallback } from 'react';
import PostContainer from './post-components/postContainer.js';
import { useAuth } from "../../../context/AuthProvider";
import axios from "axios";

const SearchResultsPosts = (props) => {
  const { isLoggedIn, user } = useAuth();
  const { postData , setPost, onPageChange, sort, setLoading, loading, communitiesData, linkFlairsData, commentsData, postsData } = props;

  const [sortedPostData, setSortedPostData] = useState([]);
  const [prioritizedPostsData, setPrioritizedPostsData] = useState([]);

  const [count, setCount] = useState(0);

  const forceRerender = () => {
      setCount(prevCount => prevCount + 1); // Changing state triggers rerender
  };

  const getFreshestComment = useCallback(async (commentID) => {
    let current_comment = commentsData.find(comment => comment._id === commentID);

    let freshest_id = current_comment.commentID;
    let freshest_date = new Date(current_comment.commentedDate);

    let commentIDs = current_comment.commentIDs;

    if (commentIDs.length === 0) return [freshest_id, freshest_date];

    for (const id in commentIDs) {
      let get_relative_fresh = await getFreshestComment(commentIDs[id]);

      let check_id = get_relative_fresh[0];
      let check_date = get_relative_fresh[1];

      if (freshest_date < check_date) {
        freshest_date = check_date;
        freshest_id = check_id;
      }
    }
    return [freshest_id, freshest_date];
  }, [commentsData]);

  const sortPostData = useCallback(async (sort, post_data) => {
    if (sort === "newest") {
      post_data.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));
    } else if (sort === "oldest") {
      post_data.sort((a, b) => new Date(a.postedDate) - new Date(b.postedDate));
    } else {
      for (const obj of post_data) {
        obj["freshest_date"] = new Date('2024-01-01');

        for (const id of obj.commentIDs) {
          let get_relative_fresh = await getFreshestComment(id);

          let check_date = get_relative_fresh[1];

          if (obj["freshest_date"] < check_date) {
            obj["freshest_date"] = check_date;
          }
        }
      }
      post_data.sort((a, b) => new Date(b.freshest_date) - new Date(a.freshest_date));
    }
    return post_data;
  }, [getFreshestComment]);

  useEffect(() => {
    async function fetchData() {
      try {
        if( isLoggedIn ){

          // console.log("This is search page");
          // gets an array of community IDs
          const userCommunitiesRes = await axios.get('http://localhost:8000/usersData/getUserCommunities');
          // console.log('homepageview recieved user communities');
          // .log(userCommunitiesRes.data);

          //iteragte through array and create a mega array of communitie's post if they are in the array else create other mega array
          //use sort posts on post, show the communitie's post first
          const userCommunitiesIDs = userCommunitiesRes.data;

          const searchPrioritizedPostsIDs = [];

          // gets an of post ids that the user prioritizes
          userCommunitiesIDs.forEach(id => {
            const matchingCommunity = communitiesData.find(community => community._id === id);
            if (matchingCommunity){
              searchPrioritizedPostsIDs.push(...matchingCommunity.postIDs);
            }
          })

          // console.log("This is prioritized posts ids");
          // console.log(searchPrioritizedPostsIDs);

          // Match post IDs to actual posts
          const topPosts = [];
          postData.forEach(post => {
            const matchingPost = searchPrioritizedPostsIDs.find(id => post._id === id);
            if (matchingPost){
              topPosts.push(post);
            }
          })

          // console.log("This is prioritized posts");
          // console.log(topPosts);

          
          // Match post IDs to actual posts
          const searchUnprioritizedPosts = [];
          postData.forEach(post => {
            if (!searchPrioritizedPostsIDs.includes(post._id)){
              searchUnprioritizedPosts.push(post);
            }
          })

          // console.log("This is unprioritized posts");
          // console.log(searchUnprioritizedPosts);

          const sortedSearchPrioritizedPosts = await sortPostData(sort, topPosts);
          const sortedSearchUnprioritizedPosts = await sortPostData(sort, searchUnprioritizedPosts);

          await setPrioritizedPostsData(sortedSearchPrioritizedPosts);
          await setSortedPostData(sortedSearchUnprioritizedPosts);
        } else {
        
          const sortedData = await sortPostData(sort, postData);
          await setSortedPostData(sortedData);
        }
      } catch (error) {
        console.error("Error fetching sorted data:", error);
      } finally {
        setLoading(false);
        forceRerender();
      }
    }

    fetchData();
  }, [postData, loading, sort, sortPostData]);

  if (postData.length === 0) {
    return (
      <div id="search-results-posts">
        <img
          src={require("../../../imgs/technical-difficulties.jpg")}
          alt="technical difficulties"
          id="technical-difficulties-image"
        />
      </div>
    );
  } else if (loading === true) {
    return <div></div>;
  }
  console.log(prioritizedPostsData);
  console.log(sortedPostData);
  return (
    <div id="search-results-posts">
      { prioritizedPostsData.map((post, index) => (
          <PostContainer
            key={index}
            post={post}
            communities={communitiesData}
            linkFlairs={linkFlairsData}
            setPost={setPost}
            onPageChange={onPageChange}
            //data={data}
            // communitiesData={communitiesData}
            // linkFlairsData={linkFlairsData}
            commentsData={commentsData}
            postsData={postsData}
          />
        ))
      }
      <div>
        <div className='exploreMoreSeperator'> ___________________ Explore Different Communities' Posts Below ___________________</div>
          <div className="dotted-line">
            <p></p>
          </div>
        </div>
      {sortedPostData.map((post, index) => (
        <PostContainer
          key={index}
          post={post}
          communities={communitiesData}
          linkFlairs={linkFlairsData}
          setPost={setPost}
          onPageChange={onPageChange}
          //data={data}
          // communitiesData={communitiesData}
          // linkFlairsData={linkFlairsData}
          commentsData={commentsData}
          postsData={postsData}
        />
      ))}
    </div>
  );
};

export default SearchResultsPosts;
