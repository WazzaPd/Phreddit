import cursorIcon from "../../imgs/cursor-icon.png";
import chatIcon from "../../imgs/chat-icon.png";
import plusSign from "../../imgs/plus-sign.svg";
import bellNotification from "../../imgs/bell-notifications.png";
import pfpPhoto from "../../imgs/pfp-photo.png";

const Section3 = (props) => {
    const {page} = props;
    return (  
        <div id="h-section3">
            <img alt="img" src = {cursorIcon} />
            <img alt="img" src = {chatIcon}/>
            <button id="create-post-button" className={`${page === `create-post` ? "create-post-highlighted" : ""}`} type="button" onClick={() => props.onPageChange('create-post')}> 
                <img alt="img" src = {plusSign} style = {{maxWidth: "28px"}}/>
                <p>Create Post</p>
            </button>
            <img alt="img" src= {bellNotification}/>
            <img alt="img" src= {pfpPhoto}/>
        </div>
    );
}
 
export default Section3;