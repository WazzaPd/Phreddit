import HeaderTitle from "./header-components/headerTitle";
import SortButtons from "./header-components/sortButtons";
import NumPosts from "./header-components/numPosts";

const SearchResultsHeader = (props) => {
  const { postData, onSortChange, setLoading, exactSearchTerms, communitiesData, linkFlairsData, commentsData, postsData } = props;
  return (  
    <div id="search-results-header-container">
      <div id="search-results-header-title-and-button-container">
        <HeaderTitle 
          postData={postData} 
          exactSearchTerms={exactSearchTerms}
          //data={data}
          communitiesData={communitiesData}
          linkFlairsData={linkFlairsData}
          commentsData={commentsData}
          postsData={postsData}
        />
        <SortButtons setLoading={setLoading} onSortChange={onSortChange}/>
      </div>
      <NumPosts postData={postData}/>
      
    </div>
  );
}
 
export default SearchResultsHeader;