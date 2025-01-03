import "../stylesheets/banner.css"; 
import Section1 from "./banner-components/section1";
import Section2 from "./banner-components/section2";
import Section3 from "./banner-components/section3";

const Banner = (props) => {
    const { onPageChange, toggleNavbar, extractSearchTerms, setSearchTerms, page, switchWelcomePageOption } = props;

    const handleSearch = (searchTerm) => {
        const terms = extractSearchTerms(searchTerm); 
        setSearchTerms(terms); 
        onPageChange('search-results'); 
    };

    return (
        <header className="header">
            <Section1 
                toggleNavbar={toggleNavbar} 
                onPageChange={onPageChange} 
                switchWelcomePageOption={switchWelcomePageOption}/>
            <Section2 onPageChange={onPageChange} onSearch={handleSearch} /> {/* Pass search handler to Section2 */}
            <Section3 
                onPageChange={onPageChange} 
                page={page} 
                switchWelcomePageOption={switchWelcomePageOption} 
            />
        </header>
    );
};

export default Banner;
