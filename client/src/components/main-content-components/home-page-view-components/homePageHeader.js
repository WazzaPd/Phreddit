import HeaderTitle from "./page-header-components/headerTitle";
import NumPosts from "./page-header-components/numPosts";
import SortButtons from "./page-header-components/sortButtons";

export default function HomePageHeader(props) {

    return (
        <div id="home-header-container">
            <div id="home-header-title-and-button-container">
                <HeaderTitle/>
                <SortButtons setLoading={props.setLoading} onSortChange={props.onSortChange}/>
            </div>
            <NumPosts numPosts={props.numPosts}/>
        </div>
    );
}
