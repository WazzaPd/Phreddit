import HeaderTitle from "./community-page-header-components/headerTitle";
import NumPosts from "./community-page-header-components/numPosts";
import SortButtons from "./community-page-header-components/sortButtons";
import { useAuth } from "../../../context/AuthProvider";
import axios from "axios";

const CommunityPageHeader = (props) => {

  const { user, isLoggedIn } = useAuth();

  console.log(props.community)

  function timeAgo(pastDate) {

    if (!(pastDate instanceof Date)) {
      pastDate = new Date(pastDate);
  }

    const now = new Date();
    const timeDifference = now - pastDate; // Difference in milliseconds

    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (years > 0) {
        return years === 1 ? '1 year ago' : `${years} years ago`;
    } else if (months > 0) {
        return months === 1 ? '1 month ago' : `${months} months ago`;
    } else if (weeks > 0) {
        return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
    } else if (days > 0) {
        return days === 1 ? '1 day ago' : `${days} days ago`;
    } else if (hours > 0) {
        return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
    } else if (minutes > 0) {
        return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`;
    } else if (seconds > 0) {
        return seconds === 1 ? '1 second ago' : `${seconds} seconds ago`;
    } else {
        return 'just now';
    }
  }

  async function handleJoinCommunity(){
    try {
      const response = await axios.post("http://localhost:8000/communitiesData/joinCommunity", {
        username: user.displayName,
        userID: user.id,
        communityID: props.community._id
      });

      props.setrefreshMembers(true);

    } catch (error) {
        console.error("Error joining community:", error.response?.data || error.message);
        alert("Failed to Join Community. Please try again.");
    }
  }

  async function handleLeaveCommunity(){
    try {
      const response = await axios.post("http://localhost:8000/communitiesData/leaveCommunity", {
        username: user.displayName,
        userID: user.id,
        communityID: props.community._id
      });

      props.setrefreshMembers(true);

    } catch (error) {
        console.error("Error joining community:", error.response?.data || error.message);
        alert("Failed to Join Community. Please try again.");
    }
  }

  return (
    <div id="community-header-container">
      <div id="community-header-title-and-button-container">
        <HeaderTitle communityName={props.communityName} /> 
        <SortButtons setLoading={props.setLoading} onSortChange={props.onSortChange} />
      </div>
      <p>{props.community.description}</p>
      <p>Start Date: {timeAgo(props.community.startDate)}</p>
      <p>Created By: {props.createdBy}</p>
      { isLoggedIn && 
        (props.community.members.includes(user.displayName) ? (
          <button onClick={handleLeaveCommunity}>Leave Community</button>
        ) : (
          <button onClick={handleJoinCommunity}>Join Community</button>
        ))
      }
      <div style = {{display: "flex", flexDirection: "row", alignItems: "center", columnGap: "20px"}}>
        <NumPosts numPosts={props.numPosts} /> 
        <div id="number-of-members">             {/* Extra requirement (member count) */}
          <p>Members: {props.numMembers}</p>
        </div>
      </div>
    </div>
  );
};

export default CommunityPageHeader;
