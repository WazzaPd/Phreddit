const Section2 = (props) => {
  const { onSearch, onPageChange } = props;

  const handleKeyDown = (e) => {
      if (e.key === 'Enter') { // if the user presses Enter
          const searchTerm = e.target.value; 
          if (searchTerm) {
              onSearch(searchTerm);
              onPageChange('search-results');
          }
      }
  };

  return (
      <div id="h-section2">
          <input
              id="searchbar"
              type="search"
              placeholder="Search Phreddit"
              onKeyDown={handleKeyDown}
          />
      </div>
  );
};

export default Section2;
