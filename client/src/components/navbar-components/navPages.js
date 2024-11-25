import NavItem from "./navItem.js";

const NavPages = (props) => {

    const {page} = props;

    return (  
        <div id="nav-pages">
            {/* Nav Pages Section */}
            { page ==='home'? 
            (<NavItem 
                divId="home"
                divClass="home-page-highlighted"
                imgClass="nav-pages-img"
                imgSrc="home-img.png"
                imgAlt="Home Icon"
                text="Home"
                onClick={props.onPageChange}
            />) : 
            (<NavItem 
                divId="home"
                divClass="home-page"
                imgClass="nav-pages-img"
                imgSrc="home-img.png"
                imgAlt="Home Icon"
                text="Home"
                onClick={props.onPageChange}
            />)}
            <NavItem 
            imgClass="nav-pages-img"
            imgSrc="popular-img.png"
            imgAlt="Popular Icon"
            text="Popular"
            />
            <NavItem 
            imgClass="nav-pages-img"
            imgSrc="explore-img.png"
            imgAlt="Explore Icon"
            text="Explore"
            />
            <NavItem 
            imgClass="nav-pages-img"
            imgSrc="all-img.png"
            imgAlt="All Icon"
            text="All"
            />

        </div>
    );
}
 
export default NavPages;