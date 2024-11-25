import React, { useEffect, useState, useCallback } from 'react';
import HomePageHeader from "./home-page-view-components/homePageHeader.js";
import Posts from "./home-page-view-components/posts.js";
import axios from 'axios';

export default function HomePageView(props) {
  const [sort, setSort] = useState('newest');
  const [postData, setPostData] = useState([]);
  const [communitiesData, setCommunitiesData] = useState([]);
  const [linkflairsData, setLinkflairsData] = useState([]);
  const [commentsData, setCommentsData] = useState([]);
  const [loading, setLoading] = useState(true);

  const getFreshestComment = useCallback(async (commentID) => {
    const currentComment = commentsData.find(comment => comment._id === commentID);
    if (!currentComment) return [null, null];

    let freshestId = currentComment.commentID;
    let freshestDate = new Date(currentComment.commentedDate);

    if (currentComment.commentIDs.length === 0) return [freshestId, freshestDate];

    for (const id of currentComment.commentIDs) {
      const [checkId, checkDate] = await getFreshestComment(id);
      if (freshestDate < checkDate) {
        freshestDate = checkDate;
        freshestId = checkId;
      }
    }
    return [freshestId, freshestDate];
  }, [commentsData]);

  const sortPostData = useCallback(async (sort, postData) => {
    if (sort === "newest") {
      postData.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));
    } else if (sort === "oldest") {
      postData.sort((a, b) => new Date(a.postedDate) - new Date(b.postedDate));
    } else {
      for (const post of postData) {
        post.freshest_date = new Date('2024-01-01');
        for (const id of post.commentIDs) {
          const [, checkDate] = await getFreshestComment(id);
          if (post.freshest_date < checkDate) {
            post.freshest_date = checkDate;
          }
        }
      }
      postData.sort((a, b) => new Date(b.freshest_date) - new Date(a.freshest_date));
    }
    return postData;
  }, [getFreshestComment]);

  useEffect(() => {
    async function fetchData() {
      try {
        const postRes = await axios.get('http://localhost:8000/postsData');
        // console.log('homeview-page recieved post data');
        // console.log(postRes.data);
        const communityRes = await axios.get('http://localhost:8000/communitiesData');
        // console.log('homeview-page recived community data');
        // console.log(communityRes.data);
        const linkflairRes = await axios.get('http://localhost:8000/linkflairsData');
        // console.log('homeview-page recieved linkfliar data');
        // console.log(linkflairRes.data);
        const commentRes = await axios.get('http://localhost:8000/commentsData');
        // console.log('homeview-page recieved comments data');
        // console.log(commentRes.data);
        
        const sortedData = await sortPostData(sort, postRes.data);

        setPostData(sortedData);
        setCommunitiesData(communityRes.data);
        setLinkflairsData(linkflairRes.data);
        setCommentsData(commentRes.data);
      } catch (error) {
        if (error.response) {
          console.error('Response error:', error.response.status);
          console.error('Response data:', error.response.data);
        } else if (error.request) {
          console.error('No response received:', error.request);
        } else {
          // Something else caused the error
          console.error('Error setting up request:', error.message);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [loading, sort]);

  if (loading) {
    return (
      <section id="home-page-view" className='home-page-view'>
        <p>Loading...</p>
      </section>
    );
  }

  return (
    <section id="home-page-view" className='home-page-view'>
      <HomePageHeader setLoading={setLoading} numPosts={postData.length} onSortChange={handleSortChange} />
      <Posts
        onPageChange={props.onPageChange}
        postData={postData}
        communitiesData={communitiesData}
        linkflairsData={linkflairsData}
        commentsData={commentsData} 
        setPost={props.setPost}
      />
    </section>
  );

  function handleSortChange(newSort) {
    if (newSort !== sort) {
      setSort(newSort);
    }
  }

}
