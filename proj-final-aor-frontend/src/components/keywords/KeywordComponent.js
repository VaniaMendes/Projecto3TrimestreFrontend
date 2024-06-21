import React from "react";
import { IoClose } from "react-icons/io5";
import "./Keywords.css";

const KeywordComponent = (props) => {
  const {
    id,
    keyword,
    isProjectInfo,
    isItemRemovable,
    onClick,
    onRemoveClick,
    onRemoveSkill,
    onRemoveInterest,
  } = props;


  //Handle the click event
  const handleClick = () => {
    if (onClick) {
      onClick(keyword);
    }
  };

  //Handle the remove click event
  const handleRemoveClick = (event) => {
    event.stopPropagation();
    if (onRemoveClick) {
      onRemoveClick(keyword, id);
    } else if (onRemoveInterest) {
      onRemoveInterest();
    } else if (onRemoveSkill) {
      onRemoveSkill();
    }
  };

 

  return (
    <div
      className={`${isProjectInfo ? "kw-info" : "keyword-single-container"} ${
        isItemRemovable ? "removable" : ""
      }`}
      onClick={handleClick}
    >
      <div className="keyword-container">
        <p>{keyword}</p>
        {isItemRemovable && (
          <span className="remove-icon" onClick={handleRemoveClick}>
            <IoClose />
          </span>
        )}
      </div>
    </div>
  );
};

export default KeywordComponent;
