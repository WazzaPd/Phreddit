import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import CommunityPageHeader from './community-page-view-components/communityPageHeader';
import CommunityPosts from './community-page-view-components/communityPosts';

const CommunityPageView = (props) => {
  const { selectedCommunityId, setPost, onPageChange } = props;

  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [linkflairs, setLinkflairs] = useState([]);
  const [postCount, setPostCount] = useState(0);
  const [sort, setSort] = useState('newest');
  const [postData, setPostData] = useState([]);
  const [loading, setLoading] = useState(true);

  const getFreshestComment = useCallback(async (commentID) => {
    const currentComment = comments.find(comment => comment._id === commentID);
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
  }, [comments]);

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

  // Fetch all required data when the component mounts
  useEffect(() => {
    const fetchCommunityData = async () => {
      setLoading(true);
      try {
        const [communityRes, postsRes, commentsRes, linkflairsRes] = await Promise.all([
          axios.get(`http://localhost:8000/communitiesData/${selectedCommunityId}`),
          axios.get('http://localhost:8000/postsData'),
          axios.get('http://localhost:8000/commentsData'),
          axios.get('http://localhost:8000/linkflairsData')
        ]);

        setCommunity(communityRes.data);
        setPosts(postsRes.data);
        setComments(commentsRes.data);
        setLinkflairs(linkflairsRes.data);

        // Filter posts specific to the community and set post count
        const communityPosts = postsRes.data.filter(post => communityRes.data.postIDs.includes(post._id));
        setPostCount(communityPosts.length);

        // Sort posts initially based on 'sort' state
        const sortedData = await sortPostData(sort, communityPosts);
        setPostData(sortedData);
      } catch (error) {
        console.error("Error fetching community data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCommunityData();
  }, [selectedCommunityId, sort]); // Re-run if selectedCommunityId or sort changes



  if (!community) {
    return <div id="community-loading">Loading...</div>;
  } else if (loading) {
    return <div id="community-loading">Loading...</div>;
  }

  return (
    <div id="community-page-view">
      {/* Community Page Header */}
      <CommunityPageHeader
        communityName={community.name}
        numPosts={postCount}
        numMembers={community.members.length}
        setLoading={setLoading}
        onSortChange={handleSortChange}
        community={community}
      />

      {/* Community Posts */}
      <CommunityPosts
        communityPosts={postData}
        community={community}
        posts={posts}
        comments={comments}
        linkflairs={linkflairs}
        setPost={setPost}
        onPageChange={onPageChange}
      />
    </div>
  );

  function handleSortChange(newSort) {
    if (newSort !== sort) {
      setSort(newSort);
    }
  }
};

export default CommunityPageView;
