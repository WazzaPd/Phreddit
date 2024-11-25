import {useState, useRef} from 'react';
import axios from 'axios';

export default function NewCommentView( props ){

    const { postID, parentCommentID, onPageChange} = props;

    const [contentError, setContentError] = useState([false, '']);
    const [usernameError, setUsernameError] = useState(false);

    // Refs for accessing input values
    const contentRef = useRef();
    const usernameRef = useRef();

    return(
        <div id="new-comment-container">
            <h id="new-comment-header">Commenting to the Post</h>
            <textarea ref={contentRef} id="new-comment-comment-content" rows="6" placeholder="* Comment Content"></textarea>
            {contentError[0] && (
            <p className="new-comment-errors" style={{ color: 'red' }}>
                {contentError[1]}
            </p>
            )}
            <input ref={usernameRef} id="new-comment-username" placeholder="* Username"></input>
            {usernameError && (
            <p className="new-comment-errors" style={{ color: 'red' }}>
                *Username cannot be empty
            </p>
            )}
            <button id="submit-comment" onClick={(event)=>handleSubmit(event)}>Submit Comment</button>
        </div>
    )

    function checkValidity(){
        const content = contentRef.current.value;
        const username = usernameRef.current.value;

        let valid = true;

        if(!content){
            setContentError(true);
            setContentError([true, '*Comment cannot be empty']);
            valid = false;
        } else if(content.length > 500){
            setContentError([true, '*Comment cannot exceed 500 chars']);
            valid = false;
        } else {
            setContentError(false);
        }

        if(!username){
            setUsernameError(true);
            valid = false;
        } else {
            setUsernameError(false);
        }

        console.log(content);
        console.log(username);

        return valid;
    }

    async function handleSubmit(event){
        event.preventDefault();
        const content = contentRef.current.value;
        const username = usernameRef.current.value;

        if(checkValidity()){
            const addComment =
            {
                content: content,
                commentIDs: [],
                commentedBy: username,
                commentedDate: new Date(),
            }

            await axios.post('http://localhost:8000/commentsData/appendComment', {
                addComment,
                parentCommentID: parentCommentID,
                postID: postID
            });

            onPageChange('post-page');
        }
    }
}