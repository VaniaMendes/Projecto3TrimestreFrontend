import React from "react";
import "./Keywords.css";

const KeywordComponent = (props) => {
    const {keyword, isProjectInfo} = props;

    return (
        <div className={isProjectInfo ? "kw-info" : "keyword-single-container"}>
            <p>{keyword}</p>
        </div>
    );
}

export default KeywordComponent;