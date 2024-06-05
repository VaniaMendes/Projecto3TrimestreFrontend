import React from "react";
import "./MemberDisplay.css";
import defaultPhoto from "./assets/profile_pic_default.png"
import {FormattedMessage } from "react-intl";

const MemberDisplay = (props) => {
    const photo = props.photo;
    const name = props.name;
    const role = props.role;

    return (
        <div className="member-display">
            
                <div className="photo-container">
                    <img src={photo || defaultPhoto} alt="member" />
                </div>
                <div className="name-container">
                    <h4>{name}</h4>
                    <p><FormattedMessage id={role}/></p>
                </div>
            
        </div>
    );
}

export default MemberDisplay;