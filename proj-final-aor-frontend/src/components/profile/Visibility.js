import React, {useState, useEffect} from 'react';
import { useIntl } from 'react-intl';


const Visibility = (props) => {

    const{visibility, onChangeVisibility, project, profile, showTasksList} = props;
    const [isPrivate, setIsPrivate] = useState(false);
    const intl = useIntl();

    useEffect(() => {
        setIsPrivate(visibility);
    }, [visibility]);

    const handleToggle = () => {
        setIsPrivate(!isPrivate);
        if (project) {
            showTasksList(); // Chamando a função showTasksList se o projeto estiver marcado
        } else {
            onChangeVisibility(); // Chamando onChangeVisibility se for perfil
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