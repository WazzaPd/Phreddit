import { useState, useEffect } from "react";
import axios from "axios";

const EditCommunityPage = (props) => {
    const { communityID, onPageChange, refreshCommunitiesNav } = props;
    const [communityName, setCommunityName] = useState("");
    const [communityDescription, setCommunityDescription] = useState("");
    const [editMode, setEditMode] = useState(false);
    const [editedName, setEditedName] = useState("");
    const [editedDescription, setEditedDescription] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchCommunityDetails = async () => {
            try {
                const response = await axios.get(`/communitiesData/${communityID}`);
                const community = response.data;
                setCommunityName(community.name);
                setCommunityDescription(community.description);
                setEditedName(community.name);
                setEditedDescription(community.description);
            } catch (err) {
                setError("Failed to fetch community details");
                console.error(err);
            }
        };

        fetchCommunityDetails();
    }, [communityID]);

    const handleDeleteCommunity = async () => {
        try {
            const confirmDelete = window.confirm(
                "Are you sure you want to delete this community? This will also delete all posts and comments. This action cannot be undone."
            );
            
            if (confirmDelete) {
                await axios.delete(`/communitiesData/delete/${communityID}`, {
                    withCredentials: true
                });
                
                alert("Community deleted successfully");
                refreshCommunitiesNav();
                onPageChange("profile");
            }
        } catch (err) {
            console.error("Error deleting community:", err);
            setError(err.response?.data?.message || "Failed to delete community");
        }
    };

    const handleStartEdit = () => {
        setEditMode(true);
        setEditedName(communityName);
        setEditedDescription(communityDescription);
    };

    const handleCancelEdit = () => {
        setEditMode(false);
        setEditedName(communityName);
        setEditedDescription(communityDescription);
        setError("");
    };

    const handleSaveEdit = async () => {
        try {
            // Validate inputs
            if (!editedName.trim() || !editedDescription.trim()) {
                setError("Name and description cannot be empty");
                return;
            }

            // Don't make API call if nothing has changed
            if (editedName === communityName && editedDescription === communityDescription) {
                setEditMode(false);
                return;
            }

            const response = await axios.put(`/communitiesData/edit/${communityID}`, {
                name: editedName.trim(),
                description: editedDescription.trim()
            }, {
                withCredentials: true
            });

            setCommunityName(editedName);
            setCommunityDescription(editedDescription);
            setEditMode(false);
            setError("");
            refreshCommunitiesNav(); // Update the navigation bar
            alert("Community updated successfully");
        } catch (err) {
            if (err.response?.status === 400) {
                setError(err.response.data.message || "Name already exists");
            } else {
                console.error("Error updating community:", err);
                setError("Failed to update community");
            }
        }
    };

    return ( 
        <div id="edit-community-page">
            <h1 style={{marginTop: "50px", marginRight: "100px", display: "inline-block"}}>
                Edit Community Page 
            </h1> 
            <button onClick={() => onPageChange("profile")}> 
                Back
            </button>
            <hr/>
            {!editMode ? (
                <>
                    <button onClick={handleStartEdit}>Edit Community</button> 
                    <button onClick={handleDeleteCommunity}>Delete Community</button>
                    <div>
                        <p><strong>Name:</strong> {communityName}</p>
                        <p><strong>Description:</strong> {communityDescription}</p>
                    </div>
                </>
            ) : (
                <div>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>
                            <strong>Name:</strong>
                        </label>
                        <input
                            type="text"
                            value={editedName}
                            onChange={(e) => setEditedName(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '8px',
                                marginBottom: '10px'
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>
                            <strong>Description:</strong>
                        </label>
                        <textarea
                            value={editedDescription}
                            onChange={(e) => setEditedDescription(e.target.value)}
                            style={{
                                width: '100%',
                                minHeight: '150px',
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

export default EditCommunityPage;