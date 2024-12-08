import "../stylesheets/banner.css"; 
import Section1 from "./banner-components/section1";
import Section2 from "./banner-components/section2";
import Section3 from "./banner-components/section3";
import { useAuth } from "../context/AuthProvider";

const Banner = (props) => {
    const { isLoggedIn, user, login, logout } = useAuth();
    const { onPageChange, toggleNavbar, extractSearchTerms, setSearchTerms, page} = props;

    const handleSearch = (searchTerm) => {
        const terms = extractSearchTerms(searchTerm); 
        setSearchTerms(terms); 
        onPageChange('search-results'); 
    };

    return (
        <header className="header">
            <Section1 toggleNavbar={toggleNavbar} onPageChange={onPageChange} />
            <Section2 onPageChange={onPageChange} onSearch={handleSearch} /> {/* Pass search handler to Section2 */}
            <Section3 onPageChange={onPageChange} page={page}/>
        </header>
    );
};

export default Banner;
