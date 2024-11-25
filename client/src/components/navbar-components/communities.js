import NavItem from "./navItem";
import NavItemHeader from "./navItemHeader";
import { useEffect, useState } from 'react';
import axios from 'axios';

const Communities = (props) => {
    const {page, selectedCommunity} = props;

    const [toggle, setToggle] = useState(false);
    const [communitiesData, setCommunitiesData] = useState([]);

    const toggleContent = () => {
        setToggle(!toggle);
    }

    useEffect(() => {
        const fetchData = async() => {
            try{
                const res = await axios.get('http://localhost:8000/communitiesData');
                // console.log('navbar recieved community data');
                // console.log(res.data);
                setCommunitiesData(res.data);
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
        fetchData();
    }, [props.refreshTrigger]);

    return (  
        <div id="COMMUNITIES">
            <NavItemHeader 
                divClass="has-carret"
                imgClass="carret-img"
                imgAlt="carret Img"
                text="COMMUNITIES"
                onClick = {toggleContent}
            />
            { page ==="create-community"? 
            (<NavItem
                divId="create-community-button-highlighted"
                divClass= {`can-toggle ${toggle? `show` : ``}`}
                imgClass="plus-sign-img"
                imgSrc="plus-sign.svg"
                imgAlt="plus-sign" 
                text="Create a Community"
                onClick={() => props.onPageChange("create-community")}
            />): 
            (<NavItem
                divId="create-community-button"
                divClass= {`can-toggle ${toggle? `show` : ``}`}
                imgClass="plus-sign-img"
                imgSrc="plus-sign.svg"
                imgAlt="plus-sign" 
                text="Create a Community"
                onClick={() => props.onPageChange("create-community")}
            />)}
            {page === 'community-page' ? (
                <div id="community-list" className={`can-toggle ${toggle? `show` : ``}`}> 
                    {communitiesData.map((community, index) => (
                        <div id={community.name} className={`community-content 
                            ${community._id === selectedCommunity ? `community-page-highlighted` : ``}`}
                            key={index} 
                            onClick={() => props.onPageChange("community-page", community._id)}
                        >
                        {/* Display a div containing an anchor, and inside the anchor, a paragraph with the community name */}
                        <p style={{ textDecoration: 'underline' }}>{community.name}</p>
                        </div>
                    ))}
                </div>
                ):
                <div id="community-list" className={`can-toggle ${toggle? `show` : ``}`} > 
                    {communitiesData.map((community, index) => (
                    
                        <div id={community.name} className="community-content" 
                        key={index} onClick={() => props.onPageChange("community-page", community._id)}
                        >
                        {/* Display a div containing an anchor, and inside the anchor, a paragraph with the community name */}
                        <p style={{ textDecoration: 'underline' }}>{community.name}</p>
                        </div>
                    ))}
                </div>
            }  

        </div>
    );
}
 
export default Communities;