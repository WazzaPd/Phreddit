import { forwardRef } from 'react';
import { useAuth } from "../../../context/AuthProvider";

const SelectCommunity = forwardRef((props, ref) => {
    const { user } = useAuth();

    // Sort the communities based on whether the user is a member
    const sortedCommunities = [...props.communities].sort((a, b) => {
        const isUserInA = a.members.includes(user?.name);
        const isUserInB = b.members.includes(user?.name);
        if (isUserInA && !isUserInB) return -1; // User is in 'a' but not in 'b'
        if (!isUserInA && isUserInB) return 1;  // User is in 'b' but not in 'a'
        return 0;                               // Both or neither
    });

    return (
        <select ref={ref} defaultValue="default" id="select-community">
            <option value="default" disabled>* Select a community</option>
            {sortedCommunities.map((community, index) => (
                <option value={community.name} key={index}>{community.name}</option>
            ))}
        </select>
    );
});

export default SelectCommunity;
