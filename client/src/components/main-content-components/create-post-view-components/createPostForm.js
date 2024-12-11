import {useState, useRef} from 'react';
import axios from 'axios';
import SelectCommunity from './selectCommunity';
import SelectLinkFliar from './selectLinkFlair';
import { useAuth } from "../../../context/AuthProvider";

// To Implement: Adding Post after clicking submit button. Use useRef?
export default function CreatePostForm(props){
    const {communitiesData, linkflairsData} = props;

    const [communityError, setCommunityError] = useState(false);
    const [titleError, setTitleError] = useState([false, '']);
    const [linkFlairError, setLinkFlairError] = useState(false);
    const [contentError, setContentError] = useState(false);

    const { user } = useAuth();

    // Refs for accessing input values
    const titleRef = useRef();
    const contentRef = useRef();
    const communityRef = useRef();
    const linkFlairRef = useRef();

    return (
        <form id="create-post-form">
            {communityError && (
            <p id="create-post-community-error" style={{ color: 'red' }}>
                *Selecting a community is required
            </p>
            )}
            <SelectCommunity ref={communityRef} communities={communitiesData}/>
            {titleError[0] && (
            <p id="create-post-title-error" style={{ color: 'red' }}>
                {titleError[1]}
            </p>
            )}
            <label htmlFor="create-post-title">Title: </label>
            <input ref={titleRef} id="create-post-title" name="create-post-content" placeholder="* Required"></input>
            {linkFlairError && (
            <p id="create-post-link-flair-error" style={{ color: 'red' }}>
                *Link Flair cannot exceed 30 chars
            </p>
            )}
            <SelectLinkFliar ref={linkFlairRef} linkFlairs={linkflairsData}/>
            {contentError && (
            <p id="create-post-content-error" style={{ color: 'red' }}>
                *Content Section cannot be empty
            </p>
            )}
            <label htmlFor="create-post-content">Content: </label>
            <textarea ref={contentRef} id="create-post-content" placeholder="* Required (Description)"></textarea>
            {/* {usernameError && (
            <p id="create-post-username-error" style={{ color: 'red' }}>
                *Username cannot be empty
            </p>
            )}
            <label htmlFor="create-post-username">Username: </label>
            <input ref={usernameRef} id="create-post-username" placeholder="* Required"></input> */}
            <button id="submit-post" onClick={(event)=>handleSubmit(event)}>Submit</button>
        </form>
    );

    function checkValidity(){
        const title = titleRef.current.value;
        const content = contentRef.current.value;
        const username = user.name;
        const community = communityRef.current.value;
        const linkFlair = linkFlairRef.current.value;

        let valid = true;

        console.log(username);

        if(community === 'default'){
            setCommunityError(true);
            valid = false;
        } else {
            setCommunityError(false);
        }
        
        if(title === ""){
            setTitleError([true, '*Title cannot be empty']);
            valid = false;
        } else if(title.length > 100){
            setTitleError([true, '*Title cannot exceed 100 chars']);
            valid = false;
        } 
        else {
            setTitleError([false, '']);
        }
        
        if(linkFlair.length > 30){
            setLinkFlairError(true);
            valid = false;
        } else {
            setLinkFlairError(false);
        }
        
        if(!content){
            setContentError(true);
            valid = false;
        } else {
            setContentError(false);
        }

        return valid;
    }

    async function handleSubmit(event){
        event.preventDefault();
        const title = titleRef.current.value;
        const content = contentRef.current.value;
        const username = user.name;
        const community = communityRef.current.value;
        const linkFlair = linkFlairRef.current.value;

        console.log(linkFlair);

        if(checkValidity()){
            let linkFlairID = '';

            if(! linkFlair || linkFlair === 'default'){
                
            }
            else if(linkflairsData.some(obj => obj.content === linkFlair) === false){
                try{
                    const newLinkflairRes = await axios.post('http://localhost:8000/linkflairsData/appendLinkflair', {content: linkFlair});
                    linkFlairID= newLinkflairRes.data._id;
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
            } else {
                linkFlairID = linkflairsData.find(obj => obj.content === linkFlair)._id;
            }

            const postObj =
                {
                    title: title,
                    content: content,
                    linkFlairID:  linkFlairID,
                    postedBy: username,
                    postedDate: new Date(),
                    commentIDs: [],
                    views: 0,
                    votes: 0,
                };
            

            await axios.post('http://localhost:8000/postsData/appendPost', {
                post: postObj,
                communityName: community
            });

            props.onPageChange('home');
        }
    }
}