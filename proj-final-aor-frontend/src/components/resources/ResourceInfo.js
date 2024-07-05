import React, { useState } from "react";
import './ResourceInfo.css';
import { HiMiniKey, HiMiniWrench } from "react-icons/hi2";
import { FormattedMessage } from "react-intl";
import EditResourceModal from "./EditResourceModal";

const ResourceInfo = (props) => {
    const { photo, id, name, brand, type, projectsNumber, onClick } = props;
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleClick = () => {
        setIsModalOpen(true);
        if (onClick) {
            onClick();
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const renderResourceIcon = (photo, type) => {
        if (photo) {
            return <img src={photo} alt="Resource" className="resource-photo" />;
        } else if (type === "DIGITAL") {
            return <HiMiniKey fontSize='2em'/>;
        } else if (type === "MATERIAL") {
            return <HiMiniWrench fontSize='2em'/>;
        }
        return null;
    };

    return (
      <>
        <div className="resource-container" onClick={handleClick}>
            <div className="resource-photo-container">
                {renderResourceIcon(photo, type)}
            </div>
            <div className="resource-info-container">
                <div className="label-name-container">
                    <h4>{name}</h4>
                </div>
                <div className="label-name-container">
                    <p><FormattedMessage id="brand" /> : &nbsp;</p><h4>{brand}</h4>
                </div>
                <div className="label-name-container">
                    <p><FormattedMessage id="projectsNumber" /> : &nbsp;</p><h4>{projectsNumber}</h4>
                </div>
            </div>
        </div>
        {isModalOpen && (
          <EditResourceModal
              id={id}
              onClose={closeModal}
          />
        )}
      </>
    );
};

export default ResourceInfo;