import React from "react";
import "../keywords/Keywords.css";

const SkillComponent = (props) => {
    const {keyword, isProjectInfo, onClick} = props;
    const handleClick = () => {
        if (onClick) {
          onClick();
        }
    }

    return (
        <div className={isProjectInfo ? "kw-info" : "keyword-single-container"} onClick={handleClick}>
            <p>{keyword}</p>

        </div>
    );
}

export default SkillComponent;