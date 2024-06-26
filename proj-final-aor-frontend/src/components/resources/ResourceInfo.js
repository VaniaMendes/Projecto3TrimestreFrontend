import React from "react";
import './ResourceInfo.css';
import { HiMiniKey } from "react-icons/hi2";
import { HiMiniWrench } from "react-icons/hi2";
import { FormattedMessage } from "react-intl";

const ResourceInfo = (props) => {
    const {photo, id, name, brand, type, projectsNumber} = props;

    return (
        <div className="resource-container">
            
                <div className="resource-photo-container">
                    {
                        photo ? (
                        <img src={photo} alt="Description of the image" className="resource-photo" />
                        ) : type === "DIGITAL" ? (
                        <HiMiniKey fontSize='2em'/>
                        ) : type === "MATERIAL" ? (
                        <HiMiniWrench fontSize='2em'/>
                        ) : null
                    }
                </div>
                <div className="resource-info-container">
                    <div className="label-name-container">
                        <h4>{name}</h4>
                    </div>
                    
                    <div className="label-name-container">
                        <p><FormattedMessage id="brand"/> : &nbsp;</p><h4>{brand}</h4>
                    </div>
                    <div className="label-name-container">
                        <p><FormattedMessage id="projectsNumber"/> : &nbsp;</p><h4>{projectsNumber}</h4>
                    </div>
                </div>

        </div>
    );
};

export default ResourceInfo;