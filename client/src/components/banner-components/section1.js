import redditIcon from "../../imgs/Reddit-Icon.png";
import dropdownIcon from "../../imgs/dropdown-icon.png";
import { useAuth } from "../../context/AuthProvider";

const Section1 = (props) => {
    const {toggleNavbar, onPageChange} = props;
    const { isLoggedIn, logout } = useAuth(); // Access authentication state and logout function

    console.log(!isLoggedIn);

    return ( 
        <div id="h-section1">
            <button id="dropdown-button" onClick={toggleNavbar}> {/*display default to none (ALSO NEEDS TO IMPLEMENT TOGGLE) */}
                <img id="dropdown-icon" src={dropdownIcon} alt="Dropdown Icon" />
            </button>

            <img id="reddit-icon" src={redditIcon} alt="Reddit Icon" onClick = {() => {
                if (!isLoggedIn) {
                    props.switchWelcomePageOption();
                } else {
                    onPageChange('home'); 
                }}}/>
            <p id="phreddit" style = {{color: `rgb(255, 68, 51)`}} onClick = {() => {
                if (!isLoggedIn) {
                    props.switchWelcomePageOption();
                } else {
                    onPageChange('home'); 
                }}}>Phreddit</p>
        </div>
    );
}
 
export default Section1;
