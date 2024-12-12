import { useState, useEffect } from "react";
import axios from 'axios';

const EditCommentPage = (props) => {
    const { commentID, onPageChange } = props;

    const [commentContent, setCommentContent] = useState("");
    const [editMode, setEditMode] = useState(false);
    const [editedContent, setEditedContent] = useState("");
    const [error, setError] = useState("");

    // Fetch comment content when component mounts
    useEffect(() => {
        const fetchCommentContent = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/commentsData/${commentID}`);
                setCommentContent(response.data.content);
                setEditedContent(response.data.content); // Initialize edit content
            } catch (error) {
                console.error('Error fetching comment:', error);
                setError("Failed to fetch comment");
            }
        };

        fetchCommentContent();
    }, [commentID]);

    // Handle comment deletion
    const handleDeleteComment = async () => {
        try {
            const confirmDelete = window.confirm(
                "Are you sure you want to delete this comment? This will also delete all replies. This action cannot be undone."
            );

            if (confirmDelete) {
                await axios.delete(`http://localhost:8000/commentsData/delete/${commentID}`);
                onPageChange("profile");
            }
        } catch (error) {
            console.error('Error deleting comment:', error);
            setError("Failed to delete comment");
        }
    };

    // Handle starting edit mode
    const handleStartEdit = () => {
        setEditMode(true);
        setEditedContent(commentContent);
    };

    // Handle canceling edit
    const handleCancelEdit = () => {
        setEditMode(false);
        setEditedContent(commentContent);
        setError("");
    };

    // Handle saving edited comment
    const handleSaveEdit = async () => {
        try {
            // Don't allow empty comments
            if (!editedContent.trim()) {
                setError("Comment cannot be empty");
                return;
            }

            // Don't make API call if content hasn't changed
            if (editedContent === commentContent) {
                setEditMode(false);
                return;
            }

            const response = await axios.put(`http://localhost:8000/commentsData/edit/${commentID}`, {
                content: editedContent,
                editedDate: new Date()
            }, {
                withCredentials: true
            });

            setCommentContent(editedContent);
            setEditMode(false);
            setError("");
        } catch (error) {
            console.error('Error updating comment:', error);
            setError("Failed to update comment");
        }
    };

    return (  
        <div id="edit-comment-page">
            <h1 style={{marginTop: "50px", marginRight: "100px", display: "inline-block"}}>
                Edit Comment Page 
            </h1> 
            <button onClick={() => onPageChange("profile")}> 
                Back
            </button>
            <hr/>
            {!editMode ? (
                <>
                    <button onClick={handleStartEdit}>Edit Comment</button> 
                    <button onClick={handleDeleteComment}>Delete Comment</button>
                    <p>{commentContent}</p>
                </>
            ) : (
                <div>
                    <textarea
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        style={{
                            width: '100%',
                            minHeight: '100px',
                            marginBottom: '10px',
                            padding: '8px'
                        }}
                    />
                    <div>
                        <button onClick={handleSaveEdit}>Save Changes</button>
                        <button onClick={handleCancelEdit}>Cancel</button>
                    </div>
                </div>
            )}
            {error && <p style={{color: 'red'}}>{error}</p>}
        </div>
    );
};
 
export default EditCommentPage;