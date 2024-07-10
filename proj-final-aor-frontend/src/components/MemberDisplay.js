import React, { useEffect, useState }  from "react";
import "./MemberDisplay.css";
import defaultPhoto from "./assets/profile_pic_default.png"
import {FormattedMessage, useIntl } from "react-intl";
import { MdAddCircle } from "react-icons/md";
import { MdRemoveCircle } from "react-icons/md";
import { PiCaretCircleRightFill } from "react-icons/pi";
import { PiCaretCircleLeftFill } from "react-icons/pi";
import { PiUserCircleMinusFill } from "react-icons/pi";
import { PiUserSwitchFill } from "react-icons/pi";
import { FiEdit3 } from "react-icons/fi";

import CustomModal from "./CustomModal";

const MemberDisplay = (props) => {
    const {id, photo, name, role, visitorIsProjectMember, isCandidate, isInsideProject, handleAddMember, handleApproveCandidate, handleRemoveMember, onMemberRoleChange} = props;
    const intl = useIntl();

    const [addColor, setAddColor] = useState('#2bd948');
    const [removeColor, setRemoveColor] = useState('#dd7973');
    const [iconEditColor, setIconEditColor] = useState('#8D8D8D');
    const [iconMinusColor, setIconMinusColor] = useState('#8D8D8D');
    const [iconSwitchColor, setIconSwitchColor] = useState('#8D8D8D');
    const [showHiddenContent, setShowHiddenContent] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [userType, setUserType] = useState("");
    const [newRole, setNewRole] = useState(role);

    let className;
    if (role && !isInsideProject) {
        className = "member-display";
    } else if (isInsideProject) {
        className = "inside-project-member-display";
    } else {
        className = isCandidate ? "candidate-member" : "available-member";
    }

    const nextRole = role === 'COLLABORATOR'
    ? intl.formatMessage({ id: 'MANAGER' })
    : intl.formatMessage({ id: 'COLLABORATOR' });

    useEffect(() => {
        if (role === 'COLLABORATOR') {
            setNewRole('MANAGER');
        } else {
            setNewRole('COLLABORATOR');
        }
    }, [role]);

    const handleAddClick = () => {
        setShowHiddenContent(true);
    };

    const handleBackClick = () => {
        setShowHiddenContent(false);
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
        setShowHiddenContent(false);
        setShowModal(false);
    };

    const confirmApproveCandidate = () => {
        handleApproveCandidate(id, userType, photo, name);
        setShowHiddenContent(false);
        setShowModal(false);
    }

    const confirmRemoveMember = () => {
        handleRemoveMember(id);
        setShowHiddenContent(false);
        setShowModal(false);
    };

    const handleRoleChange = () => {
        onMemberRoleChange(id, newRole);
        setShowHiddenContent(false);
    };

    const onRemoveClick = () => {
        setShowModal(true);
    };

    const onCloseModal = () => {
        setShowHiddenContent(false);
        setShowModal(false);
    };

    const modalTitle = isInsideProject 
    ? <FormattedMessage id="confirmRemoveMember"/> 
    : isCandidate 
        ? <FormattedMessage id="confirmCandidate"/> 
        : <FormattedMessage id="confirmAddMember"/>;

    const modalLabel = isInsideProject 
        ? <FormattedMessage id="sureConfirmRemoveMember"/> 
        : isCandidate 
            ? <FormattedMessage id="sureConfirmCandidate"/> 
            : <FormattedMessage id="sureConfirmAddMember"/>;

    const onConfirmModal = isInsideProject 
        ? confirmRemoveMember 
        : isCandidate 
            ? confirmApproveCandidate 
            : confirmAddMember;


    return (
        <div className={className}>
            <div className="photo-container">
                <img src={photo || defaultPhoto} alt="member" />
            </div>
            <div className="name-container">
                <h4>{name}</h4>
                {role ? <p><FormattedMessage id={role} /></p> : null}
            </div>
            {className === "inside-project-member-display" && role !== "CREATOR" && visitorIsProjectMember ? (
                <>
                 {!showHiddenContent && (
                    <div className="user-circle-gear-icon">
                        <FiEdit3
                            fontSize='0.9em' 
                            onClick={handleAddClick}
                            color={iconEditColor}
                            onMouseEnter={() => setIconEditColor('#282828')}
                            onMouseLeave={() => setIconEditColor('#8D8D8D')}
                            title={intl.formatMessage({ id: 'edit' })}
                        />
                    </div>
                 )}
                
                    <div className={`select-member-type-container ${showHiddenContent ? 'show' : ''}`}>
                        <span onClick={handleBackClick}>
                            <PiCaretCircleLeftFill title={intl.formatMessage({ id: 'back' })}/>
                        </span>
                        <div className="remove-edit-role-icons-cont">
                            <PiUserCircleMinusFill 
                                fontSize='1.1em'
                                onClick={onRemoveClick}
                                color={iconMinusColor}
                                onMouseEnter={() => setIconMinusColor('#A0000C')}
                                onMouseLeave={() => setIconMinusColor('#8D8D8D')}
                                title={intl.formatMessage({ id: 'remove' })}
                            />
                            <PiUserSwitchFill
                                fontSize='1.1em'
                                onClick={handleRoleChange}
                                color={iconSwitchColor}
                                onMouseEnter={() => setIconSwitchColor('#282828')}
                                onMouseLeave={() => setIconSwitchColor('#8D8D8D')}
                                title={intl.formatMessage(
                                    { id: 'switchRole', defaultMessage: 'Switch to {role}' },
                                    { role: nextRole }
                                  )}
                            />
                        </div>
                    </div>
                
                </>

                ): null}
            {"available-member" === className ? (
                <div className="add-remove-pair">
                    {!showHiddenContent && (
                        <span onClick={handleAddClick}>
                            <MdAddCircle
                                color={addColor}
                                onMouseEnter={() => setAddColor('#33b249')}
                                onMouseLeave={() => setAddColor('#2bd948')}
                                title={intl.formatMessage({ id: 'addToProject' })}
                            />
                        </span>
                    )}
                    
                        <div className={`select-member-type-container ${showHiddenContent ? 'show' : ''}`}>
                            <span onClick={handleBackClick}>
                                <PiCaretCircleRightFill  fontSize="0.8em" title={intl.formatMessage({ id: 'back' })}/>
                            </span>
                            <select onChange={handleSelectChange}>
                                <option value="">{intl.formatMessage({ id: 'selectRole' })}</option>
                                <option value="COLLABORATOR">{intl.formatMessage({ id: 'COLLABORATOR' })}</option>
                                <option value="MANAGER">{intl.formatMessage({ id: 'MANAGER' })}</option>
                            </select>
                        </div>
                    
                </div>
            ) : null}
            {"candidate-member" === className ? (
                <div className="add-remove-pair">
                    {!showHiddenContent && (
                        <span>
                            <MdRemoveCircle
                                color={removeColor}
                                onMouseEnter={() => setRemoveColor('#ED0800')}
                                onMouseLeave={() => setRemoveColor('#dd7973')}
                                title={intl.formatMessage({ id: 'removeCandidate' })}
                            />
                        </span>
                    )}
                    {!showHiddenContent && (
                        <span onClick={handleAddClick}>
                            <MdAddCircle
                                color={addColor}
                                onMouseEnter={() => setAddColor('#2bd948')}
                                onMouseLeave={() => setAddColor('#33b249')}
                                title={intl.formatMessage({ id: 'addCandidate' })}
                            />
                        </span>
                    )}
                        <div className={`select-member-type-container ${showHiddenContent ? 'show' : ''}`}>
                            <span onClick={handleBackClick}>
                                <PiCaretCircleRightFill  fontSize="0.9em" title={intl.formatMessage({ id: 'back' })}/>
                            </span>
                            <select onChange={handleSelectChange}>
                                <option value="">{intl.formatMessage({ id: 'selectRole' })}</option>
                                <option value="COLLABORATOR">{intl.formatMessage({ id: 'COLLABORATOR' })}</option>
                                <option value="MANAGER">{intl.formatMessage({ id: 'MANAGER' })}</option>
                            </select>
                        </div>
                    
                </div>
            ) : null}
            <div>
            <CustomModal
                title={modalTitle}
                label={modalLabel}
                show={showModal}
                onClose={onCloseModal}
                onConfirm={onConfirmModal}
            />
            </div>
        </div>
    );
};

export default MemberDisplay;