import React from "react";
import { IoClose } from "react-icons/io5";
import "./Keywords.css";

const KeywordComponent = (props) => {
    const {keyword, isProjectInfo, isItemRemovable, onClick, onRemoveClick} = props;

    const handleClick = () => {
        if (onClick) {
            onClick(keyword);
        }
    };

    const handleRemoveClick = (event) => {
        event.stopPropagation();
        if (onRemoveClick) {
            onRemoveClick(keyword);
        }
    };

    return (
        <div className={`${isProjectInfo ? "kw-info" : "keyword-single-container"} ${isItemRemovable ? "removable" : ""}`} onClick={handleClick}>
            <div className="keyword-container">
                <p>{keyword}</p>
                {isItemRemovable && <span className="remove-icon" onClick={handleRemoveClick}><IoClose /></span>}
            </div>
        </div>
    );
}

export default KeywordComponent;