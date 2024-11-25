import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CreatePostForm from "./create-post-view-components/createPostForm";

export default function CreatePostView(props) {
  
    const [communitiesData, setCommunitiesData] = useState([]);
    const [linkflairsData, setLinkflairsData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
          try {
            const communityRes = await axios.get('http://localhost:8000/communitiesData');
            // console.log('homeview-page recived community data');
            // console.log(communityRes.data);
            const linkflairRes = await axios.get('http://localhost:8000/linkflairsData');
            // console.log('homeview-page recieved linkfliar data');
            // console.log(linkflairRes.data);

            setCommunitiesData(communityRes.data);
            setLinkflairsData(linkflairRes.data);
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
    }, [loading]);

    if (loading) {
        return (
          <section id="home-page-view" className='home-page-view'>
            <p>Loading...</p>
          </section>
        );
      }

    return (
        <div id="create-post-container">
            <div>
                <h1>Create Post</h1>
            </div>
            <CreatePostForm communitiesData={communitiesData} linkflairsData={linkflairsData} onPageChange={props.onPageChange}/>
        </div> 
    );
}