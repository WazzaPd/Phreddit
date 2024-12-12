import { useState, useEffect } from "react";
import axios from "axios";

const EditPostPage = (props) => {
    const { postID, onPageChange } = props;

    const [postTitle, setPostTitle] = useState("");
    const [postContent, setPostContent] = useState("");
    const [editMode, setEditMode] = useState(false);
    const [editedTitle, setEditedTitle] = useState("");
    const [editedContent, setEditedContent] = useState("");
    const [error, setError] = useState("");

    // Fetch post details when component mounts
    useEffect(() => {
        const fetchPostDetails = async () => {
            try {
                const response = await axios.get(`/postsData/${postID}`);
                const post = response.data;
                setPostTitle(post.title);
                setPostContent(post.content);
                setEditedTitle(post.title);
                setEditedContent(post.content);
            } catch (err) {
                setError("Failed to fetch post details");
                console.error(err);
            }
        };

        fetchPostDetails();
    }, [postID]);

    // Handle post deletion
    const handleDeletePost = async () => {
        try {
            const confirmDelete = window.confirm("Are you sure you want to delete this post? This action cannot be undone.");
            
            if (confirmDelete) {
                // Perform Depth-First Search to delete related comments
                await axios.delete(`/commentsData/delete-post-comments/${postID}`, {
                    withCredentials: true
                });

                // Delete the post itself
                await axios.delete(`/postsData/delete/${postID}`, {
                    withCredentials: true
                });
                
                alert("Post and its comments deleted successfully");
                onPageChange("profile");
            }
        } catch (err) {
            console.error("Error deleting post:", err);
            setError(err.response?.data?.message || "Failed to delete post");
        }
    };

    // Handle starting edit mode
    const handleStartEdit = () => {
        setEditMode(true);
        setEditedTitle(postTitle);
        setEditedContent(postContent);
    };

    // Handle canceling edit
    const handleCancelEdit = () => {
        setEditMode(false);
        setEditedTitle(postTitle);
        setEditedContent(postContent);
        setError("");
    };

    // Handle saving edited post
    const handleSaveEdit = async () => {
        try {
            // Validate inputs
            if (!editedTitle.trim() || !editedContent.trim()) {
                setError("Title and content cannot be empty");
                return;
            }

            // Don't make API call if nothing has changed
            if (editedTitle === postTitle && editedContent === postContent) {
                setEditMode(false);
                return;
            }

            const response = await axios.put(`/postsData/edit/${postID}`, {
                title: editedTitle.trim(),
                content: editedContent.trim()
            }, {
                withCredentials: true
            });

            setPostTitle(editedTitle);
            setPostContent(editedContent);
            setEditMode(false);
            setError("");
            alert("Post updated successfully");
        } catch (err) {
            console.error("Error updating post:", err);
            setError(err.response?.data?.message || "Failed to update post");
        }
    };

    return (  
        <div id="edit-post-page">
            <h1 style={{marginTop: "50px", marginRight: "100px", display: "inline-block"}}>
                Edit Post Page 
            </h1> 
            <button onClick={() => onPageChange("profile")}> 
                Back
            </button>
            <hr/>
            {!editMode ? (
                <>
                    <button onClick={handleStartEdit}>Edit Post</button> 
                    <button onClick={handleDeletePost}>Delete Post</button>
                    <div>
                        <p><strong>Title:</strong> {postTitle}</p>
                        <p><strong>Content:</strong> {postContent}</p>
                    </div>
                </>
            ) : (
                <div>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>
                            <strong>Title:</strong>
                        </label>
                        <input
                            type="text"
                            value={editedTitle}
                            onChange={(e) => setEditedTitle(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '8px',
                                marginBottom: '10px'
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>
                            <strong>Content:</strong>
                        </label>
                        <textarea
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                            style={{
                                width: '100%',
                                minHeight: '200px',
                                padding: '8px',
                                marginBottom: '10px'
                            }}
                        />
                    </div>
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

export default EditPostPage;