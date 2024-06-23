import React from "react";
import './ResourceInfo.css';
import defaultDigitalPhoto from "../assets/profile_pic_default.png";

const ResourceInfo = (props) => {
    const {photo, id, name, brand} = props;

    return (
        <div className="resource-container">
            <div className="resource-photo-container">
                <img src={photo || defaultDigitalPhoto} alt={name} className="resource-photo"/>
            </div>
            <div className="resource-info-container">
                <p>{name}</p>
                <p>{brand}</p>
            </div>
        </div>
    );
};

export default ResourceInfo;