import React, { useEffect, useState } from 'react';
import PostPageHeader from "./post-page-view-components/postPageHeader";
import Comments from "./post-page-view-components/comments";
import axios from "axios";

export default function PostPageView(props){

    const [postData, setPostData] = useState([]);
    const [communitiesData, setCommunitiesData] = useState([]);
    const [linkflairsData, setLinkflairsData] = useState([]);
    const [commentsData, setCommentsData] = useState([]);
    const [isPostRequestDone, setIsPostRequestDone] = useState(false);
    const [post, setPost] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(()=> {
        async function incrementView() {
            try {
                const incrementedPostRes = await axios.post('http://localhost:8000/postsData/increment-view', {
                    _id: props.post._id
                });
                setPost(incrementedPostRes.data.postData);
                setIsPostRequestDone(true);
            } catch (error) {
                if (error.response) {
                // The request was made and the server responded with a status code
                console.error('Response error:', error.response.status);
                console.error('Response data:', error.response.data);
                } else if (error.request) {
                // The request was made but no response was received
                console.error('No response received:', error.request);
                } else {
                // Something else caused the error
                console.error('Error setting up request:', error.message);
                }
            }
        }

        incrementView();
    }, [props.post]);

    useEffect(() => {
        if(isPostRequestDone){
            async function fetchData() {
                try {
                    const postRes = await axios.get('http://localhost:8000/postsData');
                    // console.log('postview-page recieved post data');
                    // console.log(postRes.data);
                    const communityRes = await axios.get('http://localhost:8000/communitiesData');
                    // console.log('postview-page recived community data');
                    // console.log(communityRes.data);
                    const linkflairRes = await axios.get('http://localhost:8000/linkflairsData');
                    // console.log('postview-page recieved linkfliar data');
                    // console.log(linkflairRes.data);
                    const commentRes = await axios.get('http://localhost:8000/commentsData');
                    // console.log('postview-page recieved comments data');
                    // console.log(commentRes.data);
                    
                    setPostData(postRes.data);
                    setCommunitiesData(communityRes.data);
                    setLinkflairsData(linkflairRes.data);
                    setCommentsData(commentRes.data);
                } catch (error) {
                    if (error.response) {
                    // The request was made and the server responded with a status code
                    console.error('Response error:', error.response.status);
                    console.error('Response data:', error.response.data);
                    } else if (error.request) {
                    // The request was made but no response was received
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
        }
    }, [isPostRequestDone, loading]);

    if (loading) {
        return (
          <section id="home-page-view" className='home-page-view'>
            <p>Loading...</p>
          </section>
        );
    }

    return (
        <div id="post-page-view">
        <PostPageHeader communitiesData={communitiesData} linkflairsData={linkflairsData} commentsData={commentsData} post={post} onPageChange={props.onPageChange} setParentCommentID={props.setParentCommentID}/>
        <div id="comments-container">
            <Comments postData={postData} commentsData={commentsData} postID={post._id} onPageChange={props.onPageChange} setParentCommentID={props.setParentCommentID}/>
        </div>
        </div>
    );
}