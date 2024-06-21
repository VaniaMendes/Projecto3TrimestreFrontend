import React, { useState }  from "react";
import "./MemberDisplay.css";
import defaultPhoto from "./assets/profile_pic_default.png"
import {FormattedMessage, useIntl } from "react-intl";
import { MdAddCircle } from "react-icons/md";
import { MdRemoveCircle } from "react-icons/md";
import { RiArrowGoBackLine } from "react-icons/ri";
import { FaUserEdit } from "react-icons/fa";
import CustomModal from "./CustomModal";

const MemberDisplay = (props) => {
    const {id, photo, name, role, isCandidate, isInsideProject, handleAddMember, handleApproveCandidate} = props;
    const intl = useIntl();

    const [addColor, setAddColor] = useState('#2bd948');
    const [removeColor, setRemoveColor] = useState('#dd7973');
    const [showSelect, setShowSelect] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [userType, setUserType] = useState("");

    let className;
    if (role && !isInsideProject) {
        className = "member-display";
    } else if (isInsideProject) {
        className = "inside-project-member-display";
    } else {
        className = isCandidate ? "candidate-member" : "available-member";
    }

    const handleAddClick = () => {
        setShowSelect(true);
    };

    const handleBackClick = () => {
        setShowSelect(false);
    };

    const handleSelectChange = (event) => {
        const userType = event.target.value;
        setUserType(userType);
        if (userType) {
            setShowModal(true);
        }
    };

    const confirmAddMember = () => {
        handleAddMember(id, userType, photo, name);
        setShowSelect(false);
        setShowModal(false);
    };

    const confirmApproveCandidate = () => {
        handleApproveCandidate(id, userType, photo, name);
        setShowSelect(false);
        setShowModal(false);
    }

    const onCloseModal = () => {
        setShowSelect(false);
        setShowModal(false);
    };


    return (
        <div className={className}>
            <div className="photo-container">
                <img src={photo || defaultPhoto} alt="member" />
            </div>
            <div className="name-container">
                <h4>{name}</h4>
                {role ? <p><FormattedMessage id={role} /></p> : null}
            </div>
            {className === "inside-project-member-display" && role !== "CREATOR" ? (
                <>
                 {!showSelect && (
                    <div>
                        <FaUserEdit fontSize='0.8em' onClick={handleAddClick}/>
                    </div>
                 )}
                {showSelect && (
                    <div className="select-member-type-container">
                        <span onClick={handleBackClick}>
                            <RiArrowGoBackLine fontSize="0.6em" title={intl.formatMessage({ id: 'back' })}/>
                        </span>
                        <select onChange={handleSelectChange}>
                            <option value="">{intl.formatMessage({ id: 'selectRole' })}</option>
                            <option value="COLLABORATOR">{intl.formatMessage({ id: 'COLLABORATOR' })}</option>
                            <option value="MANAGER">{intl.formatMessage({ id: 'MANAGER' })}</option>
                        </select>
                    </div>
                )}
                </>

                ): null}
            {"available-member" === className ? (
                <div className="add-remove-pair">
                    {!showSelect && (
                        <span onClick={handleAddClick}>
                            <MdAddCircle
                                color={addColor}
                                onMouseEnter={() => setAddColor('#33b249')}
                                onMouseLeave={() => setAddColor('#2bd948')}
                                title={intl.formatMessage({ id: 'addToProject' })}
                            />
                        </span>
                    )}
                    {showSelect && (
                        <div className="select-member-type-container">
                            <span onClick={handleBackClick}>
                                <RiArrowGoBackLine fontSize="0.6em" title={intl.formatMessage({ id: 'back' })}/>
                            </span>
                            <select onChange={handleSelectChange}>
                                <option value="">{intl.formatMessage({ id: 'selectRole' })}</option>
                                <option value="COLLABORATOR">{intl.formatMessage({ id: 'COLLABORATOR' })}</option>
                                <option value="MANAGER">{intl.formatMessage({ id: 'MANAGER' })}</option>
                            </select>
                        </div>
                    )}
                </div>
            ) : null}
            {"candidate-member" === className ? (
                <div className="add-remove-pair">
                    {!showSelect && (
                        <span>
                            <MdRemoveCircle
                                color={removeColor}
                                onMouseEnter={() => setRemoveColor('#ED0800')}
                                onMouseLeave={() => setRemoveColor('#dd7973')}
                                title={intl.formatMessage({ id: 'removeCandidate' })}
                            />
                        </span>
                    )}
                    {!showSelect && (
                        <span onClick={handleAddClick}>
                            <MdAddCircle
                                color={addColor}
                                onMouseEnter={() => setAddColor('#2bd948')}
                                onMouseLeave={() => setAddColor('#33b249')}
                                title={intl.formatMessage({ id: 'addCandidate' })}
                            />
                        </span>
                    )}
                    {showSelect && (
                        <div className="select-member-type-container">
                            <span onClick={handleBackClick}>
                                <RiArrowGoBackLine fontSize="0.6em" title={intl.formatMessage({ id: 'back' })}/>
                            </span>
                            <select onChange={handleSelectChange}>
                                <option value="">{intl.formatMessage({ id: 'selectRole' })}</option>
                                <option value="COLLABORATOR">{intl.formatMessage({ id: 'COLLABORATOR' })}</option>
                                <option value="MANAGER">{intl.formatMessage({ id: 'MANAGER' })}</option>
                            </select>
                        </div>
                    )}
                </div>
            ) : null}
            <div>
            <CustomModal
                title={isCandidate ? <FormattedMessage id="confirmCandidate"/> : <FormattedMessage id="confirmAddMember"/>}
                label={isCandidate ? <FormattedMessage id="sureConfirmCandidate"/> : <FormattedMessage id="sureConfirmAddMember"/>}
                show={showModal}
                onClose={onCloseModal}
                onConfirm={isCandidate ? confirmApproveCandidate : confirmAddMember}
            />
            </div>
        </div>
    );
};

export default MemberDisplay;