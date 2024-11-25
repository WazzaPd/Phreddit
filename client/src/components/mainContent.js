import { useState } from 'react';
import { useEffect } from 'react';
import "../stylesheets/mainContentView.css";
import "../stylesheets/newCommentView.css"
import "../stylesheets/createCommunity.css"
import HomePageView from "./main-content-components/homePageView";
import PostPageView from "./main-content-components/postPageView";
import CreatePostView from "./main-content-components/createPostView";
import CommunityPageView from "./main-content-components/communityPageView";
import SearchResultsView from './main-content-components/searchResultsView';
import NewCommentView from './main-content-components/newCommentView';
import CreateCommunityView from './main-content-components/createCommunityView';
import axios from 'axios';

export default function MainContent (props){

    const { page, toggle, selectedCommunity, searchTerms, exactSearchTerms } = props;
    //post state is for postpageview
    const [post, setPost] = useState(undefined);
    //parentCommentID is for new comment view to track what the parent comment is
    const [parentCommentID, setParentCommentID] = useState(undefined);

    // Data from the server
    const [communitiesData, setCommunitiesData] = useState(null);
    const [commentsData, setCommentsData] = useState(null);
    const [linkflairsData, setLinkflairsData] = useState(null);
    const [postsData, setPostsData] = useState(null);

    // Trigger to control when data is refreshed
    const [refreshTrigger, setRefreshTrigger] = useState(false);

    // Fetch data from server
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [communitiesRes, commentsRes, linkflairsRes, postsRes] = await Promise.all([
                    axios.get('http://localhost:8000/communitiesData'),
                    axios.get('http://localhost:8000/commentsData'),
                    axios.get('http://localhost:8000/linkflairsData'),
                    axios.get('http://localhost:8000/postsData')
                ]);

                setCommunitiesData(communitiesRes.data);
                setCommentsData(commentsRes.data);
                setLinkflairsData(linkflairsRes.data);
                setPostsData(postsRes.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [refreshTrigger]);

    // add community data after adding a new community
    // Function to toggle the refreshTrigger and refetch data
    const refreshData = () => {
        setRefreshTrigger(!refreshTrigger);
    };

    let content;
    
    if (page === 'home'){
        content = <HomePageView onPageChange={props.onPageChange} setPost={setPost}/>;
    } 
    else if (page === "create-post") {
         content = <CreatePostView onPageChange={props.onPageChange}/>
    } 
    else if (page === "post-page"){
        content = <PostPageView onPageChange={props.onPageChange} post={post} setParentCommentID={setParentCommentID}/>
    } 
    else if (page === "create-comment"){
        content = <NewCommentView onPageChange={props.onPageChange} parentCommentID={parentCommentID} postID={post._id}/>
    }
    else if (page === "create-community") {
        content = <CreateCommunityView onPageChange={props.onPageChange} 
        refreshData={refreshData}
        //data={props.data}
        communitiesData={communitiesData}
        postsData={postsData}
        linkflairsData={linkflairsData}
        commentsData={commentsData}
        refreshCommunitiesNav={props.refreshCommunitiesNav}
        />
    }else if (page === 'community-page' && selectedCommunity) {
        const community = communitiesData.find(c => c._id === selectedCommunity);
        console.log("clicked community page  option");
        console.log(community);
        content = (
            <CommunityPageView
                selectedCommunityId={selectedCommunity}
                setPost={setPost}
                onPageChange={props.onPageChange}
            />
        );
    }else if (page === 'search-results'){
        content = <SearchResultsView 
            onPageChange={props.onPageChange} 
            setPost={setPost} 
            searchTerms={searchTerms} 
            exactSearchTerms={exactSearchTerms}
            />
        console.log("search results page");
    }


    return(
        <div id="mainContentView" className={`${toggle ? 'shift-home-left' : ''}`}>
            {content}
        </div>
    );

}