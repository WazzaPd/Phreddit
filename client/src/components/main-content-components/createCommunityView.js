import CreateCommunityForm from "./create-community-view-components/createCommunityForm";
const CreateCommunityView = (props) => {
    const { onPageChange, communitiesData, postsData, commentsData, linkflairsData } = props;
    return (  
        <div id="create-community-container">    
            <h1 id = "create-community-header">Create a Community</h1>
            <CreateCommunityForm 
              communitiesData = {communitiesData} 
              postsData = {postsData} 
              commentsData = {commentsData} 
              linkflairsData = {linkflairsData} 
              onPageChange = {onPageChange}
              refreshCommunitiesNav = {props.refreshCommunitiesNav}
            />
        </div>

    );
}
 
export default CreateCommunityView;