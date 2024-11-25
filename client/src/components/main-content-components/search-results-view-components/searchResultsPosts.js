import { useEffect, useState, useCallback } from 'react';
import PostContainer from './post-components/postContainer.js';

const SearchResultsPosts = (props) => {
  const { postData , setPost, onPageChange, sort, setLoading, loading, communitiesData, linkFlairsData, commentsData, postsData } = props;

  const [sortedPostData, setSortedPostData] = useState([]);

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
        const sortedData = await sortPostData(sort, postData);
        setSortedPostData(sortedData);
      } catch (error) {
        console.error("Error fetching sorted data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [postData, setLoading, sort, sortPostData]);

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
  return (
    <div id="search-results-posts">
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
