import React, {useState, useEffect} from 'react';
import { useIntl } from 'react-intl';


const Visibility = (props) => {

    const{visibility, onChangeVisibility} = props;
    const [isPrivate, setIsPrivate] = useState(false);
    const intl = useIntl();

    useEffect(() => {
        setIsPrivate(visibility);
    }, [visibility]);

    const handleToggle = () => {
        setIsPrivate(!isPrivate);
        onChangeVisibility();
    };

    return (
        <div className="profile-visibility-container">
            <label className="switch">
                <input type="checkbox" checked={!isPrivate} onChange={handleToggle} />
                <span className="slider round"></span>
            </label>
            <span id="visibility-status">{isPrivate ? intl.formatMessage({ id: "public" }) : intl.formatMessage({ id: "private" })}  </span>
        </div>
    );
};

export default Visibility;