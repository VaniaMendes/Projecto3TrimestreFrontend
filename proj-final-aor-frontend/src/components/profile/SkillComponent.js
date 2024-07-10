import React from "react";
import "../keywords/Keywords.css";

const SkillComponent = (props) => {
    // Destructure props to extract specific values
    const {keyword, isProjectInfo, onClick} = props;

    // Define a function to handle click event in the SkillComponent
    const handleClick = () => {
        // If an onClick function is provided in the props, call it
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