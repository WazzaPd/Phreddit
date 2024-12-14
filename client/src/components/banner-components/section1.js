import redditIcon from "../../imgs/Reddit-Icon.png";
import dropdownIcon from "../../imgs/dropdown-icon.png";
import { useAuth } from "../../context/AuthProvider";
import axios from 'axios'
import { useEffect, useState } from 'react';

const Section1 = (props) => {
    const {toggleNavbar, onPageChange} = props;
    const { isLoggedIn, logout } = useAuth(); // Access authentication state and logout function
    const [admin, setAdmin] = useState(false);

    const handleRevertToAdmin = async () => {
        try {
            const response = await axios.post('http://localhost:8000/auth/admin/revert', {}, { withCredentials: true });
    
            if (response.status === 200) {
                window.location.reload(); // Refresh to apply the admin session
            }
        } catch (error) {
            console.error('Error reverting to admin:', error.response?.data || error.message);
            alert(error.response?.data?.message || 'Failed to revert to admin.');
        }
    };

    const checkAdminSession = async () => {
        try {
            const response = await axios.get('http://localhost:8000/auth/admin/validate-session', { withCredentials: true });
    
            if (response.data.isAdmin) {
                console.log('Admin session is active.');
                return true;
            } else {
                console.log('Admin session is not active.');
                return false;
            }
        } catch (error) {
            console.error('Error checking admin session:', error.response?.data || error.message);
            return false;
        }
    };

    useEffect(() => {
        async function fetchData() {
            const isitadmin = await checkAdminSession();
            await setAdmin(isitadmin);
            console.log(isitadmin);
        }
        fetchData();
    }, []);

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
            {admin && (
                <button onClick={handleRevertToAdmin} className="revert-to-admin">Revert to Admin</button>
            )}
        </div>
    );
}
 
export default Section1;
