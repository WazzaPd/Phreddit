import NavPages from "./navbar-components/navPages";
import "../stylesheets/nav.css";
import CustomFeeds from "./navbar-components/customFeeds";
import Communities from "./navbar-components/communities";
import Resources from "./navbar-components/resources";

const Navbar = (props) => {
    
    const {toggle, page, selectedCommunity} = props;
    return (  
        <section id = "navbar">
            <nav className = "side-navbar" style = {{display: toggle ?  "block" : "none"}}>
                <NavPages page={page} onPageChange={props.onPageChange}/>
                <CustomFeeds/>
                <Communities page={page} onPageChange={props.onPageChange} selectedCommunity = {selectedCommunity} refreshTrigger={props.refreshTrigger}/>
                <Resources/>
            </nav>
        </section>
    );
}
 
export default Navbar;