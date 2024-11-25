import NavItem from "./navItem";
import NavItemHeader from "./navItemHeader";
import { useState } from 'react';

const Resources = () => {
    const [toggle, setToggle] = useState(false);

    const toggleContent = () => {
        setToggle(!toggle);
    }
    return (  
        <div id="resources">
            <NavItemHeader
                divClass="has-carret"
                imgClass="carret-img"
                imgAlt="carret Img"
                text="Resources"
                pId="resources-title"
                onClick = {toggleContent}
            />
            {/* Section 1 */}
            <section className={`can-toggle ${toggle? `show` : ``}`}>
                <NavItem 
                    divClass={`can-toggle ${toggle? `show` : ``}`}
                    imgClass="resources-img"
                    imgSrc="about-reddit-img.png"
                    imgAlt="about phreddit"
                    text="About Phreddit"
                />
                <NavItem 
                    divClass={`can-toggle ${toggle? `show` : ``}`}
                    imgClass="resources-img"
                    imgSrc="advertise-img.png"
                    imgAlt="about phreddit"
                    text="Advertise"
                />
                <NavItem 
                    divClass={`can-toggle ${toggle? `show` : ``}`}
                    imgClass="resources-img"
                    imgSrc="help-img.png"
                    imgAlt="about phreddit"
                    text="Help"
                />
                <NavItem 
                    divClass={`can-toggle ${toggle? `show` : ``}`}
                    imgClass="resources-img"
                    imgSrc="blog-img.png"
                    imgAlt="about phreddit"
                    text="Blog"
                />
                <NavItem 
                    divClass={`can-toggle ${toggle? `show` : ``}`}
                    imgClass="resources-img"
                    imgSrc="careers-img.png"
                    imgAlt="about phreddit"
                    text="Careers"
                />
                <NavItem 
                    divClass={`can-toggle ${toggle? `show` : ``}`}
                    imgClass="resources-img"
                    imgSrc="press-img.png"
                    imgAlt="about phreddit"
                    text="Press"
                />
            </section>
            
            <section className={`can-toggle ${toggle? `show` : ``}`}>
                <NavItem 
                    divClass={`can-toggle ${toggle? `show` : ``}`}
                    imgClass="resources-img"
                    imgSrc="communities-img.png"
                    imgAlt="about phreddit"
                    text="Communities"
                />
                <NavItem 
                    divClass={`can-toggle ${toggle? `show` : ``}`}
                    imgClass="resources-img"
                    imgSrc="best-of-reddit.png"
                    imgAlt="about phreddit"
                    text="Best of Phreddit"
                />
                <NavItem 
                    divClass={`can-toggle ${toggle? `show` : ``}`}
                    imgClass="resources-img"
                    imgSrc="topics-img.png"
                    imgAlt="about phreddit"
                    text="Topics"
                />
            </section>
            
            <section className={`can-toggle ${toggle? `show` : ``}`}>
                <NavItem 
                    divClass={`can-toggle ${toggle? `show` : ``}`}
                    imgClass="resources-img"
                    imgSrc="content-policy-img.png"
                    imgAlt="about phreddit"
                    text="Content Policy"
                />
                <NavItem 
                    divClass={`can-toggle ${toggle? `show` : ``}`}
                    imgClass="resources-img"
                    imgSrc="privacy-policy-img.png"
                    imgAlt="about phreddit"
                    text="Privacy Policy"
                />
                <NavItem 
                    divClass={`can-toggle ${toggle? `show` : ``}`}
                    imgClass="resources-img"
                    imgSrc="user-agreement-img.png"
                    imgAlt="about phreddit"
                    text="User Agreement"
                />
            </section>
        </div>
    );
}
 
export default Resources;