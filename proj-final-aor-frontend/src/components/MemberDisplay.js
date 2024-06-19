import React from "react";
import "./MemberDisplay.css";
import defaultPhoto from "./assets/profile_pic_default.png"
import {FormattedMessage } from "react-intl";

const MemberDisplay = (props) => {
    const {photo, name, role, isCandidate} = props;

    let className;
    if (role) {
        className = "member-display";
    } else {
        className = isCandidate ? "candidate-member" : "available-member";
    }

    return (
        <div className={className}>
            <div className="photo-container">
                <img src={photo || defaultPhoto} alt="member" />
            </div>
            <div className="name-container">
                <h4>{name}</h4>
                {role ? <p><FormattedMessage id={role}/></p> : null}
            </div>
            {"candidate-member" === className ? 
                        <div className="add-remove-pair">
                            <span className="add-span">+</span><span className="remove-span">asda</span>
                        </div>
                    : null}
        </div>
    );
}

export default MemberDisplay;