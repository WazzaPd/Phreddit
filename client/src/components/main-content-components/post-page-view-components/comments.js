import StructureComments from "./structureComment";

export default function Comments(props){

    const {postData, commentsData, postID} = props;

    const post_commentIDs = postData.find(post => post._id === postID).commentIDs;
    
    return(
        <div id="comments-container">
            <StructureComments commentsData={commentsData} commentIDs={post_commentIDs} onPageChange={props.onPageChange} setParentCommentID={props.setParentCommentID}/>
        </div>
    );
}