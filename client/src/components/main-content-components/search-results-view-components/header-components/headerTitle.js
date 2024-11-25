const HeaderTitle = (props) => {
  const { postData, exactSearchTerms } = props;

  if(postData.length === 0){
    return (  
      <h1 id="header-title">No results found for: {exactSearchTerms}</h1>
    );
  }
  return (  
    <h1 id="header-title">Search Results For: {exactSearchTerms}</h1>
  );
}
 
export default HeaderTitle ;