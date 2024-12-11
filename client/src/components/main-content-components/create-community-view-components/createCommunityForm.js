import { useEffect, useState } from "react";
import axios from 'axios';
import { useAuth } from "../../../context/AuthProvider";

const CreateCommunityForm = (props) => {
  const { onPageChange } = props;

  const [validCommunityName, setValidCommunityName] = useState(true);
  const [communityNameError, setCommunityNameError] = useState('');
  const [validDescription, setValidDescription] = useState(true);
  const [descriptionError, setDescriptionError] = useState('');

  const [communityName, setCommunityName] = useState('');
  const [description, setDescription] = useState('');
  const [creatorUsername, setCreatorUsername] = useState('');

  const { user } = useAuth();   //Auth provider

  useEffect(() => {
    setCreatorUsername(user.name);
  }, [user]);

  async function engenderCommunityClicked() {
    let isValid = true;

    if (communityName.length === 0) {
      setCommunityNameError("Community name cannot be empty");
      setValidCommunityName(false);
      isValid = false;
    } else if (communityName.length > 100) {
      setCommunityNameError("Community name cannot be longer than 100 characters");
      setValidCommunityName(false);
      isValid = false;
    } else {
      setCommunityNameError('');
      setValidCommunityName(true);
    }

    if (description.length === 0) {
      setDescriptionError("Description cannot be empty");
      setValidDescription(false);
      isValid = false;
    } else if (description.length > 500) {
      setDescriptionError("Description cannot be longer than 500 characters");
      setValidDescription(false);
      isValid = false;
    } else {
      setDescriptionError('');
      setValidDescription(true);
    }


    if (isValid) {
      try{
        console.log(communityName);
        console.log(description);
        console.log(creatorUsername);
        
        const community = await axios.post('http://localhost:8000/communitiesData/appendCommunities', {
          name: communityName,
          description: description,
          members: [creatorUsername],
          memberCount: 1,
          createdBy: creatorUsername,
          postIDs: [],
        });
        console.log("created community", community.data);
        await props.refreshCommunitiesNav();  // Refresh the communities nav
        onPageChange("community-page", community.data._id);
        
      }catch(e){
        console.log("error creating community", e);
        alert("COMMUNITY NAME ALREADY EXISTS");
      }
      
    }
  }

  return (
    <div className="create-community-form">
      <input
        type="text"
        id="create-community-name"
        placeholder="*Community Name"
        value={communityName}
        onChange={(e) => setCommunityName(e.target.value)} 
      />
      {!validCommunityName && <p className="create-community-errors">{communityNameError}</p>}

      <textarea
        id="create-community-description"
        placeholder="*Description"
        rows="6"
        value={description}
        onChange={(e) => setDescription(e.target.value)} 
      />
      {!validDescription && <p className="create-community-errors">{descriptionError}</p>}

      <button
        id="create-community-engender-community"
        onClick={engenderCommunityClicked}
      >
        Engender Community
      </button>
    </div>
  );
}

export default CreateCommunityForm;
