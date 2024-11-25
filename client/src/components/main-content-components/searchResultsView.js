import React, { useEffect, useState, useCallback } from 'react';
import SearchResultsHeader from './search-results-view-components/searchResultsHeader';
import SearchResultsPosts from './search-results-view-components/searchResultsPosts';
import axios from 'axios';

const SearchResultsView = (props) => {
  const { searchTerms, exactSearchTerms, setPost, onPageChange } = props;
  const [communitiesData, setCommunitiesData] = useState([]);
  const [postsData, setPostsData] = useState([]);
  const [commentsData, setCommentsData] = useState([]);
  const [linkflairsData, setLinkflairsData] = useState([]);

  const [postData, setPostData] = useState([]);
  const [sort, setSort] = useState('newest');
  const [loading, setLoading] = useState(true);

  // Fetch all necessary data with axios
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [communitiesRes, postsRes, commentsRes, linkflairsRes] = await Promise.all([
          axios.get('http://localhost:8000/communitiesData'),
          axios.get('http://localhost:8000/postsData'),
          axios.get('http://localhost:8000/commentsData'),
          axios.get('http://localhost:8000/linkflairsData'),
        ]);

        setCommunitiesData(communitiesRes.data);
        setPostsData(postsRes.data);
        setCommentsData(commentsRes.data);
        setLinkflairsData(linkflairsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const searchPostsAndComments = useCallback((terms) => {
    let postsIDToComments = {};

    function mapPostsToAllComments() {
      for (let post of postsData) {
        postsIDToComments[post._id] = [];
        for (let commentID of post.commentIDs) {
          DFS(post._id, commentID);
        }
      }
    }

    function DFS(postID, commentID) {
      if (!commentID) return;

      let comment = commentsData.find(c => c._id === commentID);
      if (comment) {
        postsIDToComments[postID].push(comment);
        for (let subCommentID of comment.commentIDs) {
          DFS(postID, subCommentID);
        }
      }
    }

    function fetchPostData(postIDs) {
      let postData = []; // Array of post objects
      for (let postID of postIDs) {
        let post = postsData.find(post => post._id === postID);
        if (post) {
          postData.push(post);
        }
      }
      return postData;
    }

    let postsIDsBySearchTerm = [];
    mapPostsToAllComments();

    for (let term of terms) {
      term = term.toLowerCase();

      for (let post of postsData) {
        const postTitleLower = post.title.toLowerCase();
        const postContentLower = post.content.toLowerCase();
        if (postTitleLower.includes(term) || postContentLower.includes(term)) {
          if (!postsIDsBySearchTerm.includes(post._id)) {
            postsIDsBySearchTerm.push(post._id);
          }
        }
      }

      let commentsThatHaveTerm = commentsData.filter(comment =>
        comment.content.toLowerCase().includes(term)
      ).map(comment => comment._id);

      for (let commentID of commentsThatHaveTerm) {
        for (let postID in postsIDToComments) {
          if (postsIDToComments[postID].some(comment => comment._id === commentID)) {
            if (!postsIDsBySearchTerm.includes(postID)) {
              postsIDsBySearchTerm.push(postID);
            }
          }
        }
      }
    }

    return fetchPostData(postsIDsBySearchTerm);
  }, [postsData, commentsData]);

  useEffect(() => {
    if (searchTerms.length > 0) {
      const result = searchPostsAndComments(searchTerms);
      setPostData(result); // Update state with the found post IDs
    }
  }, [searchTerms, loading, searchPostsAndComments]);

  console.log("Did it reach the return statement in search results view?");
  return (
    <div id="search-results-view">
      <SearchResultsHeader
        postData={postData}
        onSortChange={setSort}
        setLoading={setLoading}
        exactSearchTerms={exactSearchTerms}
        //data={data}
        communitiesData={communitiesData}
        linkFlairsData={linkflairsData}
        commentsData={commentsData}
        postsData={postsData}
      />

      {/* Pass the found postIDs to the SearchResultsPosts component */}
      <SearchResultsPosts
        postData={postData}
        sort={sort}
        loading={loading}
        setSort={setSort}
        setLoading={setLoading}
        setPost={setPost}
        onPageChange={onPageChange}
        //data={data}
        communitiesData={communitiesData}
        linkFlairsData={linkflairsData}
        commentsData={commentsData}
        postsData={postsData}
      />
    </div>
  );
};

export default SearchResultsView;
