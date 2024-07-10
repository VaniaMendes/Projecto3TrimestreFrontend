import React, {useState, useEffect} from 'react';
import { useIntl } from 'react-intl';


const Visibility = (props) => {
//Destructure props to extract specif values
    const{visibility, onChangeVisibility, project, profile, showTasksList} = props;
    
    //State variables
    const [isPrivate, setIsPrivate] = useState(false);
    const intl = useIntl();

    // useEffect hook to update the local state when the visibility prop changes
    useEffect(() => {
        setIsPrivate(visibility);
    }, [visibility]);


    // Function to handle the toggle visibility button click
    const handleToggle = () => {
        setIsPrivate(!isPrivate);
        if (project) {
            showTasksList(); // CIf we are in a project, we call the function showTasksList
        } else {
            onChangeVisibility(); // In the profile we call the function onChangeVisibility
        }
    };

    return (
        <div className={`profile-visibility-container ${project ? 'project-position' : ''}`}>
            <label className="switch">
                {profile && (<input type="checkbox" checked={!isPrivate} onChange={handleToggle} />)}
                {project && (<input type="checkbox" checked={!isPrivate} onChange={handleToggle} />)}
                
                <span className="slider round"></span>
            </label>
            {profile && ( 
            <span id="visibility-status">{isPrivate ? intl.formatMessage({ id: "public" }) : intl.formatMessage({ id: "private" })}  </span>)}
            {project && ( <span id="visibility-status">{intl.formatMessage({ id:"showTaskList" })}</span>)}
        </div>
    );
};

export default Visibility;