import React from "react";
import "./KeywordComponent.css";

const KeywordComponent = (props) => {
    const keyword = props.keyword;

    return (
        <div className="keyword-single-container">
            <p>{keyword}</p>
        </div>
    );
}

export default KeywordComponent;