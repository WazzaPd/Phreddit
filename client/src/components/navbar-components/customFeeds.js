import NavItem from "./navItem.js";
import NavItemHeader from "./navItemHeader.js";
import { useState } from 'react';

const CustomFeeds = () => {
    const [toggle, setToggle] = useState(false);

    const toggleContent = () => {
        setToggle(!toggle);
    }
    return (  
        // Community Feeds (optional) 
        <div id="custom-feeds">
            <NavItemHeader 
                divId="custom-feeds-toggle"
                divClass="has-carret"
                imgClass="carret-img"
                imgAlt="carret Img"
                text="CUSTOM FEEDS"
                onClick = {toggleContent}
            />
            <NavItem 
                divId="create-feed-and-img"
                divClass= {`can-toggle ${toggle? `show`: ``}`}
                imgClass="plus-sign-img"
                imgSrc="plus-sign.svg"
                imgAlt="plus-sign"
                text="Create a custom feed"
            />
        </div>
        
    );
}
 
export default CustomFeeds;