import {forwardRef} from 'react';

const SelectCommunity = forwardRef((props, ref) => {

    // const{communities} = props.communities;
    // for some reason communites const will be undefined

    return (
        <select ref={ref} defaultValue="default" id="select-community">
            <option value="default" disabled>* Select a community</option>
            {props.communities.map((community, index)=>(
                <option value={community.name} key={index}>{community.name}</option>
            ))}
        </select>
    );
});

export default SelectCommunity;