import {useState, forwardRef} from 'react';

const SelectLinkFliar = forwardRef((props, ref) => {
    const [creating, setState] = useState(false);

    //const{linkFlairs} = props.linkFlairs;

    return (
        <div id="link-flair-and-button-container">
            
            {creating ? (
                <input ref={ref} id="create-post-link-flair-input" />
            ) : (
            <select ref={ref} defaultValue="default" id="create-post-link-flair-select">
                <option value="default" disabled>Select a link flair (Optional)</option>
                {props.linkFlairs.map((linkFlair, index) => (
                    <option value={linkFlair.content} key={index}>{linkFlair.content}</option>
                ))}
            </select>
            )}

            <button id="switch-link-fliar-button" onClick={(event) => {
                event.preventDefault(); 
                setState(!creating);
            }} >Create new</button>
        </div>
    );
});

export default SelectLinkFliar;